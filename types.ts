
export interface Transaction {
  id: string;
  type: 'inflow' | 'outflow' | 'swap';
  asset: string;
  amount: number;
  valueUsd: number;
  timestamp: string;
  destination?: string;
}

export interface WalletData {
  address: string;
  balanceUsd: number;
  whaleScore: number; // 0-100
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  recentTransactions: Transaction[];
  lastSynced: string;
  // New fields for Premium UI
  walletType: 'Smart Money' | 'Whale' | 'Retail' | 'Exchange';
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface AnalysisResult {
  insightText: string;
  generatedAt: string;
}

export interface MarketEvent {
  wallet_id: string;
  insight_text: string;
  sentiment: string;
  created_at: string;
}

// New interface for the expected N8N response structure
export interface N8nWhaleResponse {
  wallet: string;
  inflows: Array<{ token: string; amount: string; value: string }>;
  outflows: Array<{ token: string; amount: string; value: string }>;
  top_tokens: string[];
  risk_score: number;
  whale_behavior: string;
  whale_summary: string;
}

export enum AppState {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  ANALYZING = 'ANALYZING',
  READY = 'READY',
}
