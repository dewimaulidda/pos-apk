import React from 'react';
import { VillageProfile } from '../types';

interface KopSuratProps {
  village: VillageProfile;
  className?: string;
}

export const KopSurat: React.FC<KopSuratProps> = ({ village, className = '' }) => {
  return (
    <div className={`relative pb-3 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        {/* Garuda / Lambang Daerah Seal */}
        <div className="w-20 h-20 shrink-0 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-18 h-18 text-amber-600 fill-current drop-shadow-xs"
            aria-label="Lambang Garuda Indonesia"
          >
            {/* Stylized Emblem of Garuda */}
            <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
            <path
              d="M50 12 L56 26 L72 28 L60 40 L64 56 L50 48 L36 56 L40 40 L28 28 L44 26 Z"
              fill="#b45309"
            />
            {/* Central Shield */}
            <path
              d="M38 42 Q50 38 62 42 L62 62 Q50 74 38 62 Z"
              fill="#dc2626"
              stroke="#fbbf24"
              strokeWidth="2"
            />
            <circle cx="50" cy="52" r="5" fill="#fbbf24" />
            {/* Banner Ribbon */}
            <path
              d="M26 78 Q50 72 74 78 L78 84 Q50 78 22 84 Z"
              fill="#e2e8f0"
              stroke="#475569"
              strokeWidth="1.5"
            />
            <text
              x="50"
              y="82"
              textAnchor="middle"
              fontSize="4"
              fontWeight="bold"
              fill="#1e293b"
              fontFamily="Times New Roman, serif"
            >
              BHINNEKA TUNGGAL IKA
            </text>
          </svg>
        </div>

        {/* Text Kop Surat */}
        <div className="flex-1 text-center font-['Tinos',serif]">
          <h3 className="text-base font-bold tracking-wider text-slate-900 leading-tight">
            {village.namaPemerintah.toUpperCase()}
          </h3>
          <h3 className="text-base font-bold tracking-wider text-slate-900 leading-tight">
            {village.namaKecamatan.toUpperCase()}
          </h3>
          <h2 className="text-xl font-extrabold tracking-widest text-slate-950 leading-tight my-0.5">
            {village.namaDesa.toUpperCase()}
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            Alamat: {village.alamatDesa}, Kode Pos {village.kodePos} &bull; Telp: {village.telepon}
          </p>
          <p className="text-xs text-slate-600 leading-tight">
            Layanan Mandiri Online: <span className="underline">{village.website}</span> &bull; Email: {village.email}
          </p>
        </div>

        {/* Right Spacer for balance */}
        <div className="w-20 h-20 shrink-0 hidden sm:block"></div>
      </div>

      {/* Official Government Double Border Line */}
      <div className="mt-3">
        <div className="h-[2.5px] bg-slate-950 w-full"></div>
        <div className="h-[0.8px] bg-slate-950 w-full mt-[1.5px]"></div>
      </div>
    </div>
  );
};
