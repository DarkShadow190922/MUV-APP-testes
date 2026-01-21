
import React, { useState } from 'react';
import { X, ShieldAlert, ChevronRight, CheckCircle2, AlertTriangle, Loader2, AlertCircle } from 'lucide-react';
import { ReportService } from '../services/reportService';
import { ReportContentType } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: ReportContentType;
  contentId: string;
  userId: string;
  title?: string;
}

const REPORT_REASONS = [
  "Spam or misleading",
  "Violent or graphic content",
  "Harassment or bullying",
  "Hate speech",
  "Nudity or sexual content",
  "Intellectual property infringement",
  "Suicide or self-harm",
  "Illegal activities or regulated goods"
];

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, contentType, contentId, userId, title }) => {
  const [step, setStep] = useState<'reason' | 'description' | 'submitting' | 'success'>('reason');
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
    setStep('description');
    setErrorMessage(null);
  };

  const handleSubmit = async () => {
    if (!selectedReason) return;
    setStep('submitting');
    setErrorMessage(null);
    try {
      await ReportService.submitReport({
        reported_user_id: userId,
        reported_content_id: contentId,
        content_type: contentType,
        reason: selectedReason,
        description: description
      });
      setStep('success');
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit report. Please try again.");
      setStep('description');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#121212] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full">
            <X className="w-5 h-5 text-gray-400" />
          </button>
          <span className="font-bold text-sm">Report</span>
          <div className="w-9" />
        </div>

        {step === 'reason' && (
          <div className="p-2">
            <div className="p-4 mb-2">
              <h2 className="text-xl font-bold mb-1">Select a reason</h2>
              <p className="text-xs text-gray-500">Your report is anonymous. If you're in immediate danger, contact local emergency services.</p>
            </div>
            <div className="max-h-[400px] overflow-y-auto px-2">
              {REPORT_REASONS.map((reason) => (
                <button 
                  key={reason}
                  onClick={() => handleReasonSelect(reason)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors group text-left"
                >
                  <span className="text-sm font-medium text-gray-200">{reason}</span>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'description' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
              <ShieldAlert className="w-6 h-6 text-[#fe2c55]" />
              <div>
                <p className="text-xs font-bold text-[#fe2c55] uppercase tracking-wider">Reason Selected</p>
                <p className="text-sm font-bold">{selectedReason}</p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex gap-3 animate-in shake duration-300">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-xs text-red-400 font-bold">{errorMessage}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Additional details (Optional)</label>
              <textarea 
                className="w-full bg-gray-900 rounded-2xl p-4 text-sm h-32 focus:outline-none focus:ring-1 focus:ring-[#fe2c55] border border-gray-800"
                placeholder="Explain why you are reporting this content..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setStep('reason')}
                className="flex-1 py-3 border border-gray-800 rounded-xl font-bold hover:bg-gray-800 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={handleSubmit}
                className="flex-[2] py-3 bg-[#fe2c55] text-white rounded-xl font-bold hover:bg-[#e0264d] transition-colors shadow-lg shadow-[#fe2c55]/20"
              >
                Submit Report
              </button>
            </div>
          </div>
        )}

        {step === 'submitting' && (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-[#fe2c55] animate-spin" />
              <div className="absolute inset-0 bg-[#fe2c55]/20 rounded-full blur-xl animate-pulse" />
            </div>
            <p className="font-bold">Submitting to Lynx Safety...</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Analyzing Content Integrity</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Report Received</h2>
              <p className="text-sm text-gray-400 mt-2 px-4 leading-relaxed">
                Thank you for helping keep Lynx safe. Our moderation team will review the content based on our Community Guidelines.
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-xl"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
