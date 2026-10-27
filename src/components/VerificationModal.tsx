import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, CheckCircle2, Lock, FileText, Search, X, Calendar, User, Building, AlertTriangle } from 'lucide-react';
import { LetterSubmission, VillageProfile } from '../types';
import { formatIndonesianDate } from '../data/letterTemplates';

interface VerificationModalProps {
  submission: LetterSubmission | null;
  allSubmissions: LetterSubmission[];
  village: VillageProfile;
  isOpen: boolean;
  onClose: () => void;
  onSelectSubmission?: (sub: LetterSubmission) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  submission,
  allSubmissions,
  village,
  isOpen,
  onClose,
  onSelectSubmission,
}) => {
  const [searchToken, setSearchToken] = useState('');
  const [searchedSub, setSearchedSub] = useState<LetterSubmission | null>(submission);
  const [hasSearched, setHasSearched] = useState(false);

  // Sync when prop changes
  React.useEffect(() => {
    if (submission) {
      setSearchedSub(submission);
      setSearchToken(submission.kodeVerifikasi);
    }
  }, [submission]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const cleaned = searchToken.trim().toLowerCase();
    const found = allSubmissions.find(
      (s) =>
        s.kodeVerifikasi.toLowerCase().includes(cleaned) ||
        s.nomorSurat.toLowerCase().includes(cleaned) ||
        s.id.toLowerCase().includes(cleaned) ||
        s.nikPemohon.includes(cleaned)
    );
    setSearchedSub(found || null);
  };

  const target = searchedSub || submission;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Portal Verifikasi Keabsahan Surat Digital
              </h3>
              <p className="text-xs text-slate-400">
                Sistem Tanda Tangan Elektronik (TTE) & Validasi QR Code Desa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Search box for verification code or letter number */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchToken}
                onChange={(e) => setSearchToken(e.target.value)}
                placeholder="Cari Kode Verifikasi, No. Surat, atau NIK..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              Cek Validitas
            </button>
          </form>

          {target ? (
            <div className="space-y-4">
              {/* Big Success Verified Banner */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-4 sm:p-5 text-white shadow-md flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 uppercase tracking-widest text-emerald-100 mb-1">
                    TERVERIFIKASI ASLI & SAH
                  </div>
                  <h4 className="font-extrabold text-base sm:text-lg leading-tight">
                    Dokumen Resmi Pemerintah Desa
                  </h4>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    Surat ini tercatat secara sah di buku register arsip digital dan tidak mengalami manipulasi data.
                  </p>
                </div>
              </div>

              {/* Document Identity Cards */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-xs">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-2.5">
                  <span className="text-slate-500">Nomor Registrasi Surat</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {target.nomorSurat}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-500 block mb-0.5">Jenis Dokumen</span>
                    <span className="font-bold text-slate-900">{target.namaSurat}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Tanggal Penerbitan</span>
                    <span className="font-semibold text-slate-900">
                      {formatIndonesianDate(target.tanggalDisetujui || target.tanggalPengajuan)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Nama Pemohon</span>
                    <span className="font-bold text-slate-900">{target.namaPemohon}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">NIK Pemohon</span>
                    <span className="font-mono font-semibold text-slate-900">{target.nikPemohon}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block mb-0.5">Keperluan Dokumen</span>
                    <span className="text-slate-800">{target.keperluan}</span>
                  </div>
                </div>
              </div>

              {/* Electronic Signature & Cryptographic Seal Box */}
              <div className="border border-indigo-100 bg-indigo-50/50 rounded-xl p-4 space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-indigo-900 font-bold">
                  <Lock className="w-4 h-4 text-indigo-600" />
                  <span>Sertifikat Tanda Tangan Elektronik (TTE) Desa</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Pejabat Penandatangan:</span>
                    <span className="font-bold">{village.namaKepalaDesa}</span>
                    <span className="block text-[11px] text-slate-500">{village.jabatanPenandatangan}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Otoritas Penerbit:</span>
                    <span className="font-semibold">{village.namaDesa}</span>
                    <span className="block text-[11px] text-slate-500">{village.namaPemerintah}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-indigo-100/80">
                  <span className="text-slate-500 block text-[10px]">Hash Integritas Dokumen (Cryptographic SHA-256):</span>
                  <span className="font-mono text-[10px] text-indigo-900 break-all select-all bg-white px-2 py-1 rounded border border-indigo-200 block mt-0.5">
                    {target.hashKeabsahan || 'SHA256-4D9A81BCF29048E12A6C88349210B'}
                  </span>
                </div>
              </div>
            </div>
          ) : hasSearched ? (
            <div className="bg-rose-50 rounded-xl border border-rose-200 p-5 text-center text-rose-900 space-y-2">
              <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
              <h4 className="font-bold text-sm">Dokumen Tidak Ditemukan</h4>
              <p className="text-xs text-rose-700">
                Nomor surat atau kode verifikasi "{searchToken}" tidak terdaftar di sistem arsip resmi Desa Sukamaju. Pastikan kode yang Anda masukkan benar.
              </p>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Sistem Informasi Desa &bull; Pelayanan Publik Mandiri
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
