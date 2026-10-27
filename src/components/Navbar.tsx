import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, Settings, User, CheckCircle2, QrCode, Building2 } from 'lucide-react';
import { VillageProfile } from '../types';

interface NavbarProps {
  currentView: 'KIOSK' | 'PREVIEW' | 'ADMIN';
  onChangeView: (view: 'KIOSK' | 'PREVIEW' | 'ADMIN') => void;
  onOpenVerification: () => void;
  village: VillageProfile;
  hasCurrentSubmission: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onChangeView,
  onOpenVerification,
  village,
  hasCurrentSubmission,
}) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WIB'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top micro bar for e-Government badge */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Portal Pelayanan Administrasi Kependudukan Terpadu (SPBE)</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 font-mono">
          <span>{timeStr}</span>
          <span className="text-slate-400">&bull;</span>
          <span className="text-emerald-400 font-semibold">Server Aktif 24 Jam</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Village Identity */}
          <div
            onClick={() => onChangeView('KIOSK')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-100 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight leading-tight">
                  {village.namaDesa}
                </h1>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                  Mandiri
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Layanan Administrasi Surat Cepat & Verifikasi QR Code
              </p>
            </div>
          </div>

          {/* Navigation Views */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => onChangeView('KIOSK')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentView === 'KIOSK'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pengajuan Surat Mandiri</span>
              <span className="sm:hidden">Buat Surat</span>
            </button>

            {hasCurrentSubmission && (
              <button
                onClick={() => onChangeView('PREVIEW')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'PREVIEW'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Dokumen PDF</span>
              </button>
            )}

            <button
              onClick={() => onChangeView('ADMIN')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentView === 'ADMIN'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Panel Petugas Desa</span>
              <span className="sm:hidden">Admin</span>
            </button>

            <button
              onClick={onOpenVerification}
              className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer flex items-center gap-1.5"
              title="Cek Keabsahan Dokumen via QR"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Cek Keabsahan QR</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
