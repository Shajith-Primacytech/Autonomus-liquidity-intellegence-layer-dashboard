
import { GoogleGenAI } from "@google/genai";
import { WalletData, N8nWhaleResponse } from "../types";

const processEnvApiKey = process.env.API_KEY;

export const analyzeWhaleTrends = async (walletData: WalletData): Promise<string> => {
  if (!processEnvApiKey) {
    console.warn("API_KEY not found. Returning mock data.");
    return new Promise(resolve => setTimeout(() => resolve("Market context simulation: The wallet shows significant accumulation of L1 assets during the recent dip, suggesting a contrarian bullish stance. High-volume outflows to cold storage indicate long-term holding patterns rather than immediate liquidation risks."), 2000));
  }

  const ai = new GoogleGenAI({ apiKey: processEnvApiKey });

  const prompt = `
    Analyze the following wallet activity for an institutional 'Whale' investor.
    Context:
    - Address: ${walletData.address}
    - Balance: $${walletData.balanceUsd.toLocaleString()}
    - Sentiment Score: ${walletData.sentiment}
    - Whale Score: ${walletData.whaleScore}/100
    - Recent Activity: ${JSON.stringify(walletData.recentTransactions.slice(0, 5))}

    Provide a concise, professional market insight (max 3 sentences).
    Focus on liquidity behavior, accumulation vs distribution, and potential market signal.
    Tone: VC-grade, analytical, calm.
    Do not use markdown formatting like bolding or headers. Just a plain paragraph.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Flash doesn't support thinking, set to 0 or remove for Pro
      }
    });
    
    return response.text || "Analysis currently unavailable.";
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return "Unable to generate market insight at this time due to network constraints.";
  }
};

export const analyzeViaN8n = async (walletData: WalletData): Promise<string> => {
  try {
    const response = await fetch('https://daraljan.app.n8n.cloud/webhook/qubic-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: walletData.address,
        balance: walletData.balanceUsd,
        transactions: walletData.recentTransactions,
        score: walletData.whaleScore,
        // Send current timestamp to help backend logging
        request_timestamp: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error(`N8N Webhook Error: ${response.status}`);
    }

    const data: N8nWhaleResponse = await response.json();

    // Check if essential data is missing (basic validation)
    if (!data || Object.keys(data).length === 0) {
       return "Waiting for data from ALIL Engine...";
    }

    // Helper to format flow lists
    const formatList = (items: Array<{ token: string; amount: string; value: string }> | undefined) => {
        if (!items || !Array.isArray(items) || items.length === 0) return "None detected";
        return items.map(i => `- ${i.token}: ${i.amount} ($${i.value})`).join('\n');
    };

    // Construct the strictly requested Markdown format
    const markdownReport = `## 🧠 AI Market Insight – ALIL Engine

### 📌 Wallet Analyzed
${data.wallet || walletData.address}

### 📥 Major Inflows
${formatList(data.inflows)}

### 📤 Major Outflows
${formatList(data.outflows)}

### 🔍 Whale Behavior Analysis
${data.whale_behavior || "Analysis pending..."}

### 📊 Risk Score
${data.risk_score || 0} / 100

### 🐋 Executive Summary
${data.whale_summary || "No summary available."}`;

    return markdownReport;

  } catch (error) {
    console.error("N8N analysis failed:", error);
    return "Waiting for data from ALIL Engine...";
  }
};
