
import React from 'react';
import { Card, SectionTitle, QubicIcon, TypewriterText, Badge } from './UI';
import { Transaction, MarketEvent } from '../types';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  Sparkles, 
  ArrowLeftRight,
  Cpu,
  Clock,
  Box
} from 'lucide-react';

export const RecentMovements: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end px-1">
        <SectionTitle>Whale Tracker</SectionTitle>
        <div className="flex items-center gap-1.5 mb-4">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success box-shadow-[0_0_8px_#00FF9F]"></span>
            </span>
            <span className="text-[9px] font-bold text-success uppercase tracking-widest">Live</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {transactions.map((tx, index) => (
          <Card 
            key={tx.id} 
            className="p-4 flex items-center justify-between group active:scale-[0.98] transition-transform animate-in fade-in slide-in-from-bottom-2 duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 bg-background shadow-inner`}>
                    {tx.type === 'inflow' ? <ArrowDownLeft size={18} className="text-success" /> : 
                     tx.type === 'outflow' ? <ArrowUpRight size={18} className="text-danger" /> : 
                     <ArrowLeftRight size={18} className="text-accent" />}
                </div>
                <div>
                    <div className="text-sm font-bold text-textPrimary font-mono flex items-center gap-1.5">
                        {tx.asset}
                        {tx.asset === 'QUBIC' && <QubicIcon className="w-3.5 h-3.5 text-primary" />}
                    </div>
                    <Badge 
                        label={tx.type === 'inflow' ? 'Accumulating' : tx.type === 'outflow' ? 'Distributing' : 'Swapped'} 
                        color={tx.type === 'inflow' ? 'success' : tx.type === 'outflow' ? 'danger' : 'neutral'}
                    />
                </div>
            </div>

            <div className="text-right">
                <div className="text-sm font-bold text-textPrimary tabular-nums font-mono">
                    {tx.amount.toLocaleString()}
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-textSecondary font-mono">${(tx.valueUsd / 1000).toFixed(1)}k</span>
                    <div className="flex items-center gap-1 mt-0.5">
                        <Clock size={10} className="text-textMuted" />
                        <span className="text-[9px] text-textMuted">{tx.timestamp}</span>
                    </div>
                </div>
            </div>
          </Card>
        ))}
        
        {transactions.length === 0 && (
            <div className="p-8 border border-dashed border-white/10 rounded-xl text-center">
                <p className="text-xs text-textMuted uppercase tracking-widest">No recent activity detected</p>
            </div>
        )}
      </div>
    </div>
  );
};

export const MarketInsight: React.FC<{ 
  insightText: string | null; 
  marketEvents: MarketEvent[] | null;
  isLoading: boolean;
  onAnalyze: () => void;
  onN8nAnalyze: () => void;
}> = ({ insightText, marketEvents, isLoading, onAnalyze, onN8nAnalyze }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
         <SectionTitle icon={<Sparkles size={12} className="text-accent" />}>AI Intelligence</SectionTitle>
         <button 
             onClick={onN8nAnalyze}
             disabled={isLoading}
             className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primaryLight text-[9px] font-bold uppercase px-3 py-1.5 rounded-full transition-all mb-4"
         >
             <Cpu size={10} />
             Deep Scan
         </button>
      </div>

      <Card className={`relative min-h-[180px] flex flex-col justify-start border-l-2 ${insightText ? 'border-l-accent' : 'border-l-borderSubtle'}`}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full py-12 gap-3">
             <RefreshCw className="animate-spin text-accent" size={24} />
             <span className="text-[10px] tracking-[0.2em] uppercase text-accent animate-pulse font-mono">Analyzing Chain Data...</span>
          </div>
        ) : insightText ? (
          <div className="bg-black/20 p-4 rounded-lg border border-white/5 h-full">
             <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-xs leading-6 text-gray-300 font-light font-mono whitespace-pre-wrap">
                  <TypewriterText text={insightText} />
                </p>
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
            <Box size={32} className="text-primary mb-3" />
            <p className="text-[10px] text-textSecondary uppercase tracking-widest max-w-[150px]">
              Waiting for analysis trigger
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
