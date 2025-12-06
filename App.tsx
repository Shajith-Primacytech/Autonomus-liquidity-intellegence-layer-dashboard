import React, { useState, useRef } from 'react';
import { 
  Terminal, 
  Zap,
  Wallet,
  Cpu,
  Layers,
  X,
  Search,
  Hexagon
} from 'lucide-react';
import { Card, Button, Input, KpiCard, Badge, QubicIcon } from './components/UI';
import { MarketInsight, RecentMovements } from './components/Widgets';
import { WalletData, AppState, Transaction, MarketEvent } from './types';
import { analyzeWhaleTrends, analyzeViaN8n } from './services/geminiService';

// Mock Data Utilities
const generateMockData = (address: string): WalletData => {
  const isWhale = Math.random() > 0.4;
  const whaleScore = Math.floor(Math.random() * 30) + (isWhale ? 70 : 20);
  
  return {
    address,
    balanceUsd: Math.floor(Math.random() * 8000000) + 100000,
    whaleScore: whaleScore,
    sentiment: Math.random() > 0.6 ? 'Bullish' : Math.random() > 0.3 ? 'Neutral' : 'Bearish',
    walletType: isWhale ? (Math.random() > 0.5 ? 'Whale' : 'Smart Money') : 'Retail',
    riskLevel: Math.random() > 0.7 ? 'High' : Math.random() > 0.3 ? 'Medium' : 'Low',
    lastSynced: new Date().toLocaleTimeString(),
    recentTransactions: [
      { id: '1', type: 'inflow', asset: 'QUBIC', amount: 1405000000, valueUsd: 280000, timestamp: '10m ago' },
      { id: '2', type: 'outflow', asset: 'USDC', amount: 85000, valueUsd: 85000, timestamp: '42m ago' },
      { id: '3', type: 'swap', asset: 'WBTC', amount: 4.2, valueUsd: 165000, timestamp: '2h ago' },
      { id: '4', type: 'inflow', asset: 'QUBIC', amount: 120000000, valueUsd: 24000, timestamp: '5h ago' },
      { id: '5', type: 'outflow', asset: 'USDT', amount: 20000, valueUsd: 20000, timestamp: '1d ago' },
    ] as Transaction[]
  };
};

const App: React.FC = () => {
  const [addressInput, setAddressInput] = useState<string>('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [insightText, setInsightText] = useState<string | null>(null);
  const [marketEvents, setMarketEvents] = useState<MarketEvent[] | null>(null);
  
  const insightRef = useRef<HTMLDivElement>(null);

  const handleScan = () => {
    if (!addressInput) return;
    
    setAppState(AppState.SCANNING);
    setTimeout(() => {
      setWalletData(generateMockData(addressInput));
      setAppState(AppState.READY);
      setInsightText(null);
      setMarketEvents(null);
    }, 1200);
  };

  const handleAnalyze = async () => {
    if (!walletData) return;
    
    setAppState(AppState.ANALYZING);
    try {
      const insight = await analyzeWhaleTrends(walletData);
      setInsightText(insight);
      setMarketEvents(null);
      setTimeout(() => {
        insightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (e) {
      console.error(e);
    } finally {
      setAppState(AppState.READY);
    }
  };

  const handleN8nAnalyze = async () => {
    if (!walletData) return;
    setAppState(AppState.ANALYZING);
    try {
        const markdownReport = await analyzeViaN8n(walletData);
        setInsightText(markdownReport);
        setMarketEvents(null);
        setTimeout(() => {
            insightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    } catch (e) {
        console.error(e);
        setInsightText("Failed to retrieve market insight.");
    } finally {
        setAppState(AppState.READY);
    }
  };

  const handleClear = () => {
    setAddressInput('');
    setWalletData(null);
    setInsightText(null);
    setMarketEvents(null);
    setAppState(AppState.IDLE);
  };

  return (
    <div className="min-h-screen bg-background text-textPrimary font-sans selection:bg-accent/30 flex justify-center overflow-x-hidden relative">
      
      {/* Holographic Grid Background Overlay */}
      <div className="holo-grid fixed inset-0 z-0 opacity-80"></div>

      {/* Main App Container - Mobile Centered */}
      <div className="w-full max-w-md bg-background/50 min-h-screen shadow-2xl relative z-10 flex flex-col pb-32 border-x border-white/5">
        
        {/* HEADER */}
        <header className="px-6 pt-12 pb-8 flex flex-col items-center bg-gradient-to-b from-background via-background/95 to-transparent sticky top-0 z-50 backdrop-blur-xl border-b border-white/5">
           
           {/* Ambient Spotlight */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-40 bg-primary/20 blur-[80px] pointer-events-none opacity-80"></div>
           
           {/* Brand Block */}
           <div className="relative z-10 flex flex-col items-center">
             
             {/* Icon - Geometric Cube/Hex */}
             <div className="relative mb-4 group">
               <div className="absolute inset-0 bg-accent/30 blur-xl opacity-50 group-hover:opacity-90 transition-opacity duration-700 rounded-full"></div>
               <div className="relative bg-background border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md ring-1 ring-white/5 group-hover:ring-accent/40 transition-all duration-500 transform group-hover:scale-105">
                 <Hexagon size={28} className="text-accent" strokeWidth={1.5} />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] animate-pulse"></div>
                 </div>
               </div>
             </div>
             
             {/* Title - Futuristic & Bold */}
             <div className="flex flex-col items-center mb-2">
                <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3 font-sans filter drop-shadow-lg">
                  <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">ALIL</span>
                  <span className="text-base font-bold text-accent tracking-[0.2em] font-mono border border-accent/20 px-2 py-0.5 rounded bg-accent/5 backdrop-blur-sm">ENGINE</span>
                </h1>
             </div>

             {/* Subtitle - Monospace with Gradient Line */}
             <div className="relative group flex flex-col items-center gap-2">
               <span className="text-[10px] uppercase tracking-[0.3em] text-textSecondary font-mono font-medium text-center leading-relaxed">
                 Autonomous Liquidity<br/>Intelligence Layer
               </span>
               <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-accent/50 to-transparent group-hover:w-32 transition-all duration-700 ease-out"></div>
             </div>
           </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-col p-6 space-y-8 flex-grow">
          
          {/* SEARCH */}
          <section className="space-y-4">
            <div className="relative">
              <Input 
                placeholder="Scan Wallet ID..."
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                className="pl-10 h-12"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={16} />
              {addressInput && (
                <button onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted p-1">
                  <X size={14} />
                </button>
              )}
            </div>
            <Button onClick={handleScan} className="w-full h-12 shadow-lg" disabled={appState === AppState.SCANNING}>
              {appState === AppState.SCANNING ? "CONNECTING..." : "SCAN WALLET"}
            </Button>
          </section>

          {walletData && (
            <>
              {/* KPI GRID (2 Columns for Mobile) */}
              <section className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 {/* Row 1 */}
                 <KpiCard 
                    label="Score" 
                    value={walletData.whaleScore}
                    subValue="Whale Idx"
                    color="#1FF0FF"
                    sparklineData={[40, 50, 60, 80, walletData.whaleScore]}
                 />
                 <KpiCard 
                    label="Risk Level" 
                    value={<Badge label={walletData.riskLevel} color={walletData.riskLevel === 'Low' ? 'success' : walletData.riskLevel === 'High' ? 'danger' : 'accent'} />}
                 />
                 
                 {/* Row 2 */}
                 <KpiCard 
                    label="Sentiment" 
                    value={<Badge label={walletData.sentiment} color={walletData.sentiment === 'Bullish' ? 'success' : walletData.sentiment === 'Bearish' ? 'danger' : 'neutral'} />}
                 />
                 <KpiCard 
                    label="Type" 
                    value={walletData.walletType}
                    subValue="Entity Class"
                    color="#9545FF"
                 />
                 
                 {/* Row 3 - Full Width */}
                 <div className="col-span-2">
                   <KpiCard 
                      label="Balance" 
                      value={<span className="text-accent">${walletData.balanceUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>}
                      subValue="Total Liquidity (USD)"
                      color="#1AFFB0"
                      className="shadow-[0_0_15px_rgba(31,240,255,0.15)] border-accent/20"
                   />
                 </div>
              </section>

              {/* MARKET INSIGHT */}
              <section ref={insightRef} className="animate-in fade-in slide-in-from-bottom-8 duration-500 delay-100">
                  <MarketInsight 
                      insightText={insightText}
                      marketEvents={marketEvents} 
                      isLoading={appState === AppState.ANALYZING}
                      onAnalyze={handleAnalyze}
                      onN8nAnalyze={handleN8nAnalyze}
                  />
                  
                  {!insightText && (
                    <Button variant="secondary" onClick={handleAnalyze} className="w-full mt-4 text-xs h-10 border-dashed">
                       GENERATE QUICK SUMMARY
                    </Button>
                  )}
              </section>

              {/* TRANSACTIONS */}
              <section className="animate-in fade-in slide-in-from-bottom-8 duration-500 delay-200">
                  <RecentMovements transactions={walletData.recentTransactions} />
              </section>
            </>
          )}

        </main>

        {/* FIXED FOOTER */}
        <footer className="fixed bottom-0 left-0 right-0 bg-secondaryBg/90 backdrop-blur-xl border-t border-white/5 py-4 px-6 z-50">
           <div className="max-w-md mx-auto flex justify-between items-center text-[9px] uppercase tracking-widest text-textMuted font-mono">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_5px_currentColor] animate-pulse"></div>
                 <span>Operational</span>
              </div>
              <div className="flex flex-col items-end">
                 <span className="text-accent">Powered by QUBIC</span>
                 <span className="opacity-50">v1.4.3 Mobile</span>
              </div>
           </div>
        </footer>

      </div>
    </div>
  );
};

export default App;