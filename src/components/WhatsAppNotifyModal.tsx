import React, { useState } from 'react';
import { MessageSquare, Copy, Check, ExternalLink, X, Send, PhoneCall, ShieldCheck } from 'lucide-react';
import { LetterSubmission, VillageProfile } from '../types';
import { generateWhatsAppMessage, createWhatsAppWebLink } from '../utils/whatsapp';

interface WhatsAppNotifyModalProps {
  submission: LetterSubmission;
  village: VillageProfile;
  isOpen: boolean;
  onClose: () => void;
  onMarkSent?: (submissionId: string) => void;
}

export const WhatsAppNotifyModal: React.FC<WhatsAppNotifyModalProps> = ({
  submission,
  village,
  isOpen,
  onClose,
  onMarkSent,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(
    submission.dataPemohon.noHp || '081234567890'
  );
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(submission.notifikasiWaTerkirim);

  if (!isOpen) return null;

  const rawMessage = generateWhatsAppMessage(submission, village, 'COMPLETED');
  const waLink = createWhatsAppWebLink(phoneNumber, rawMessage);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    window.open(waLink, '_blank');
    setSentSuccess(true);
    if (onMarkSent) {
      onMarkSent(submission.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-emerald-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-500/80 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Notifikasi WhatsApp Otomatis
              </h3>
              <p className="text-xs text-emerald-100">
                Kirim informasi surat selesai langsung ke nomor warga
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Target Phone Input */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                Nomor WhatsApp Penerima:
              </span>
              <span className="text-slate-500 font-mono">
                Warga: {submission.namaPemohon}
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Contoh: 081234567890 atau 6281234567890"
                className="w-full px-3.5 py-2 font-mono font-bold text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Format Indonesia otomatis disesuaikan (dimulai 08... atau 628...).
            </p>
          </div>

          {/* Message Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700">
                Pratinjau Pesan Notifikasi:
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Salin Teks
                  </>
                )}
              </button>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-200/90 rounded-xl p-4 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
              {rawMessage}
            </div>
          </div>

          {/* Status indication */}
          {sentSuccess && (
            <div className="bg-emerald-100 text-emerald-900 px-3.5 py-2 rounded-lg text-xs flex items-center gap-2 font-medium">
              <Check className="w-4 h-4 text-emerald-700 shrink-0" />
              Notifikasi telah diteruskan dan tercatat pada status permohonan.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Copy className="w-4 h-4" />
              Salin Pesan
            </button>

            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4" />
              Kirim via WhatsApp Web/App
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
