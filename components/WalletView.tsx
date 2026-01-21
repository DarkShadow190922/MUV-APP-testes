
import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Download, PieChart, ShieldCheck, Clock, CheckCircle, AlertCircle, Loader2, Hash, Zap } from 'lucide-react';
import { WalletService } from '../services/walletService';
import { Wallet, Transaction } from '../types';

const StatCard: React.FC<{ label: string; value: string; icon: any; color: string }> = ({ label, value, icon: Icon, color }) => (
  <div className="bg-[#1f1f1f] p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">+12.5%</span>
    </div>
    <h3 className="text-gray-400 text-sm font-medium">{label}</h3>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const WalletView: React.FC = () => {
  const [wallet, setWallet] = useState<Wallet>(WalletService.getWallet());
  const [transactions, setTransactions] = useState<Transaction[]>(WalletService.getTransactions());
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const handleWithdraw = async () => {
    if (wallet.balance <= 0) return;
    
    setIsWithdrawing(true);
    try {
      await WalletService.withdraw(wallet.balance, 'PayPal', { email: 'lynx_payouts@gmail.com' });
      setWallet({ ...WalletService.getWallet() });
      setTransactions([...WalletService.getTransactions()]);
      setWithdrawSuccess(true);
      setTimeout(() => setWithdrawSuccess(false), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Withdrawal failed');
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Earnings Dashboard</h1>
          <p className="text-gray-400">Manage your coins, gifts, and ad revenue.</p>
        </div>
        <button 
          onClick={handleWithdraw}
          disabled={isWithdrawing || wallet.balance <= 0}
          className={`px-6 py-2.5 rounded-full font-bold transition-all flex items-center gap-2 ${
            withdrawSuccess ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-gray-200'
          } disabled:opacity-50`}
        >
          {isWithdrawing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : withdrawSuccess ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          {withdrawSuccess ? 'Requested' : 'Withdraw'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Available Balance" 
          value={`$${wallet.balance.toFixed(2)}`} 
          icon={DollarSign} 
          color="bg-blue-600" 
        />
        <StatCard 
          label="Ad Revenue" 
          value={`$${wallet.ad_revenue.toFixed(2)}`} 
          icon={PieChart} 
          color="bg-purple-600" 
        />
        <StatCard 
          label="Gift Earnings" 
          value={`$${wallet.tips_received.toFixed(2)}`} 
          icon={TrendingUp} 
          color="bg-[#fe2c55]" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#1f1f1f] rounded-2xl p-6 border border-gray-800 flex flex-col h-[450px]">
          <h2 className="text-xl font-bold mb-6">Recent Transactions</h2>
          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0 group">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    tx.type === 'earning' || tx.type === 'tip_received' || tx.type === 'brand_partnership' ? 'bg-green-500/10' : 'bg-[#fe2c55]/10'
                  }`}>
                    {tx.type === 'withdrawal' || tx.type === 'tip_sent' ? (
                      <Download className="w-5 h-5 text-[#fe2c55]" />
                    ) : (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <p className="font-bold text-sm capitalize">{tx.type.replace('_', ' ')}</p>
                       {tx.reference_id && (
                         <span className="text-[9px] text-gray-600 font-mono bg-black/30 px-1 rounded flex items-center gap-1">
                            <Hash className="w-2 h-2" />
                            {tx.reference_id}
                         </span>
                       )}
                    </div>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(tx.created_at).toLocaleDateString()} • {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${tx.type === 'withdrawal' || tx.type === 'tip_sent' ? 'text-[#fe2c55]' : 'text-green-400'}`}>
                    {tx.type === 'withdrawal' || tx.type === 'tip_sent' ? '-' : '+'}${tx.amount.toFixed(2)}
                  </p>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${
                    tx.status === 'completed' ? 'text-green-500/50' : 'text-yellow-500/50'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
                <AlertCircle className="w-12 h-12 opacity-20" />
                <p className="text-sm font-bold">No transactions yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-green-400" />
              Creator Fund
            </h2>
            <p className="text-sm text-gray-400 mb-6">You're eligible for the premium creator fund. Apply now to start earning from every view.</p>
            <div className="bg-black/30 p-4 rounded-xl mb-6 border border-white/5">
               <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-gray-400">Creator Fund Earnings</span>
                  <span className="text-white">${wallet.creator_fund_earnings.toFixed(2)}</span>
               </div>
               <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (wallet.creator_fund_earnings / 500) * 100)}%` }} 
                  />
               </div>
            </div>
            <button className="w-full bg-[#fe2c55] py-3 rounded-xl font-bold hover:bg-[#e0264d] transition-colors shadow-lg shadow-[#fe2c55]/20 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              Upgrade My Tier
            </button>
          </div>

          <div className="bg-[#1f1f1f] rounded-2xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold mb-4">Payout Method</h2>
            <div className="flex items-center gap-4 bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-gray-500 transition-colors cursor-pointer group">
              <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center font-bold italic text-white shadow-lg">PayPal</div>
              <div className="flex-1">
                <p className="font-bold text-sm">lynx_payouts@gmail.com</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Primary Account</p>
              </div>
              <button className="text-xs text-gray-400 font-bold hover:text-white group-hover:text-white transition-colors">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletView;
