
import React, { useState } from 'react';
import { X, Gift, CheckCircle2, Loader2, AlertCircle, DollarSign, Heart } from 'lucide-react';
import { MonetizationService } from '../services/monetizationService';
import { currentUser } from '../services/mockData';
import { User } from '../types';

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  toUser: User;
  videoId?: string;
}

const GIFTS = [
  { amount: 0.10, label: 'Rose', icon: '🌹' },
  { amount: 0.50, label: 'Finger Heart', icon: '🫰' },
  { amount: 1.00, label: 'Confetti', icon: '🎉' },
  { amount: 5.00, label: 'Lion', icon: '🦁' },
  { amount: 10.00, label: 'Falcon', icon: '🦅' },
  { amount: 50.00, label: 'Universe', icon: '🌌' }
];

const TipModal: React.FC<TipModalProps> = ({ isOpen, onClose, toUser, videoId }) => {
  const [step, setStep] = useState<'select' | 'processing' | 'success'>('select');
  const [selectedGift, setSelectedGift] = useState<typeof GIFTS[0] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!selectedGift) return;
    
    setStep('processing');
    setErrorMsg(null);

    try {
      await MonetizationService.processTip(currentUser.id, toUser.id, selectedGift.amount, videoId);
      setStep('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Transaction failed');
      setStep('select');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-[#121212] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full">
            <X className="w-5 h-5 text-gray-400" />
          </button>
          <span className="font-bold text-sm">Send Gift</span>
          <div className="w-9" />
        </div>

        {step === 'select' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <img src={toUser.avatar} className="w-10 h-10 rounded-full border border-gray-800" alt="avatar" />
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Send to</p>
                <p className="text-sm font-bold">@{toUser.username}</p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-400 font-bold">
                <AlertCircle className="w-4 h-4" />
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              {GIFTS.map((gift) => (
                <button 
                  key={gift.label}
                  onClick={() => setSelectedGift(gift)}
                  className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${
                    selectedGift?.label === gift.label 
                      ? 'bg-[#fe2c55]/10 border-[#fe2c55] scale-105' 
                      : 'bg-white/5 border-transparent hover:border-gray-700'
                  }`}
                >
                  <span className="text-2xl mb-1">{gift.icon}</span>
                  <p className="text-[10px] font-bold text-gray-300 mb-1">{gift.label}</p>
                  <p className="text-[10px] font-bold text-[#fe2c55] flex items-center">
                    <DollarSign className="w-2 h-2" />
                    {gift.amount.toFixed(2)}
                  </p>
                </button>
              ))}
            </div>

            <div className="pt-2">
               <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                  <span>Your Balance</span>
                  <span className="text-white">${currentUser.balance.toFixed(2)}</span>
               </div>
               <button 
                onClick={handleSend}
                disabled={!selectedGift || currentUser.balance < selectedGift.amount}
                className="w-full bg-[#fe2c55] text-white py-3.5 rounded-2xl font-bold hover:bg-[#e0264d] transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-[#fe2c55]/20 flex items-center justify-center gap-2"
              >
                <Gift className="w-4 h-4" />
                Send {selectedGift?.label || 'Gift'}
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-12 h-12 text-[#fe2c55] animate-spin" />
            <p className="font-bold">Processing Transfer...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in">
            <div className="relative">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <Heart className="w-10 h-10 text-white fill-current" />
              </div>
              <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1.5 border-4 border-[#121212]">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Gift Sent!</h2>
              <p className="text-sm text-gray-400 mt-2">Your support means a lot to @{toUser.username}.</p>
            </div>
            <button 
              onClick={onClose}
              className="w-full bg-white text-black py-3 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
            >
              Back to Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TipModal;
