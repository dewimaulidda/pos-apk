import React, { useState, useEffect } from 'react';
import { Search, UserCheck, AlertCircle, Sparkles, UserPlus, Phone, MapPin, Calendar, Briefcase, Check } from 'lucide-react';
import { Citizen } from '../types';
import { formatIndonesianDate } from '../data/letterTemplates';

interface CitizenAutofillInputProps {
  citizens: Citizen[];
  selectedCitizen: Citizen | null;
  onSelectCitizen: (citizen: Citizen | null) => void;
  onAddNewCitizenModal: () => void;
  onUpdatePhone?: (phone: string) => void;
}

export const CitizenAutofillInput: React.FC<CitizenAutofillInputProps> = ({
  citizens,
  selectedCitizen,
  onSelectCitizen,
  onAddNewCitizenModal,
  onUpdatePhone,
}) => {
  const [nikInput, setNikInput] = useState(selectedCitizen ? selectedCitizen.nik : '');
  const [hasSearched, setHasSearched] = useState(false);
  const [phoneEdit, setPhoneEdit] = useState(selectedCitizen ? selectedCitizen.noHp : '');

  // Keep state in sync if parent changes selectedCitizen
  useEffect(() => {
    if (selectedCitizen) {
      setNikInput(selectedCitizen.nik);
      setPhoneEdit(selectedCitizen.noHp);
      setHasSearched(true);
    }
  }, [selectedCitizen]);

  const handleNikChange = (value: string) => {
    // Only allow numbers, max 16 digits
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    setNikInput(cleaned);
    setHasSearched(true);

    if (cleaned.length === 16) {
      const match = citizens.find((c) => c.nik === cleaned);
      if (match) {
        onSelectCitizen(match);
        setPhoneEdit(match.noHp);
      } else {
        onSelectCitizen(null);
      }
    } else if (cleaned.length === 0) {
      onSelectCitizen(null);
    } else {
      // Partial typing - check if prefix matches
      const exactMatch = citizens.find((c) => c.nik === cleaned);
      if (exactMatch) {
        onSelectCitizen(exactMatch);
        setPhoneEdit(exactMatch.noHp);
      } else {
        onSelectCitizen(null);
      }
    }
  };

  const handleSelectPreset = (citizen: Citizen) => {
    setNikInput(citizen.nik);
    onSelectCitizen(citizen);
    setPhoneEdit(citizen.noHp);
    setHasSearched(true);
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">
              1
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Identifikasi Warga (Autofill Cepat NIK)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cukup masukkan 16 digit NIK. Sistem otomatis mengambil Nama, Alamat/RT/RW, dan Tempat/Tanggal Lahir dari database kependudukan.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddNewCitizenModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          + Tambah Data Warga Baru
        </button>
      </div>

      {/* Input NIK with Real-time Search */}
      <div className="space-y-3">
        <label className="block text-xs sm:text-sm font-semibold text-slate-800">
          Nomor Induk Kependudukan (NIK) Pemohon{' '}
          <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>

          <input
            type="text"
            value={nikInput}
            onChange={(e) => handleNikChange(e.target.value)}
            placeholder="Masukkan 16 digit NIK KTP Anda (Contoh: 3204125406930002)"
            maxLength={16}
            className={`w-full pl-11 pr-24 py-3.5 text-base sm:text-lg font-mono tracking-wider rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 ${
              selectedCitizen
                ? 'border-emerald-500 bg-emerald-50/20 text-slate-900 focus:ring-emerald-400'
                : hasSearched && nikInput.length === 16 && !selectedCitizen
                ? 'border-amber-400 bg-amber-50/20 text-slate-900 focus:ring-amber-300'
                : 'border-slate-300 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-blue-500 focus:border-blue-500'
            }`}
          />

          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-slate-400">
              {nikInput.length}/16 digit
            </span>
            {selectedCitizen && (
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600">
                <Check className="w-4 h-4" />
              </span>
            )}
          </div>
        </div>

        {/* Quick Citizen Presets (Demo Helper for Instant User Testing) */}
        <div className="pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-medium">Coba NIK Contoh (Klik untuk isi otomatis langsung):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {citizens.slice(0, 4).map((c) => {
              const isSelected = selectedCitizen?.nik === c.nik;
              return (
                <button
                  key={c.nik}
                  type="button"
                  onClick={() => handleSelectPreset(c)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-semibold">{c.nama.split(' ')[0]}</span>
                  <span className="text-[11px] opacity-75 font-mono">({c.nik.slice(-4)})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Citizen Lookup Result Card */}
      {selectedCitizen ? (
        <div className="bg-gradient-to-br from-emerald-50/60 via-slate-50 to-blue-50/40 rounded-xl border border-emerald-200/80 p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {selectedCitizen.nama.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    {selectedCitizen.nama}
                  </h4>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                    <UserCheck className="w-3 h-3" /> Terverifikasi
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono">
                  NIK: {selectedCitizen.nik} &bull; {selectedCitizen.jenisKelamin} &bull; {calculateAge(selectedCitizen.tanggalLahir)} Tahun
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-100 text-blue-800">
                Data Otomatis Terhubung
              </span>
            </div>
          </div>

          {/* Grid of Autofilled Citizen Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {/* Tempat & Tanggal Lahir */}
            <div className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-1">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-blue-500" /> Tempat, Tgl Lahir
              </span>
              <p className="font-semibold text-slate-900">
                {selectedCitizen.tempatLahir}, {formatIndonesianDate(selectedCitizen.tanggalLahir)}
              </p>
            </div>

            {/* Alamat & RT/RW */}
            <div className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-1 sm:col-span-2">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> Alamat / RT / RW
              </span>
              <p className="font-semibold text-slate-900 leading-snug">
                {selectedCitizen.alamat}, RT {selectedCitizen.rt} / RW {selectedCitizen.rw}, {selectedCitizen.dusun}, Desa {selectedCitizen.desa}
              </p>
            </div>

            {/* Pekerjaan */}
            <div className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-1">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Briefcase className="w-3.5 h-3.5 text-amber-500" /> Pekerjaan
              </span>
              <p className="font-semibold text-slate-900">{selectedCitizen.pekerjaan}</p>
            </div>

            {/* Status & Agama */}
            <div className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-1">
              <span className="text-slate-500 font-medium">Status & Agama</span>
              <p className="font-semibold text-slate-900">
                {selectedCitizen.statusPerkawinan} / {selectedCitizen.agama}
              </p>
            </div>

            {/* No. WhatsApp (Editable for instant notifications) */}
            <div className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-1">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> No. WhatsApp Notifikasi
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={phoneEdit}
                  onChange={(e) => {
                    setPhoneEdit(e.target.value);
                    if (onUpdatePhone) onUpdatePhone(e.target.value);
                  }}
                  className="w-full font-mono font-semibold text-slate-900 border-b border-slate-300 focus:border-emerald-500 focus:outline-none py-0.5 text-xs"
                  placeholder="081234567890"
                />
              </div>
            </div>
          </div>
        </div>
      ) : hasSearched && nikInput.length === 16 ? (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs text-amber-900">
            <h4 className="font-bold text-amber-900">
              NIK {nikInput} Belum Ditemukan di Database Desa
            </h4>
            <p className="mt-0.5">
              Data kependudukan belum terdaftar atau Anda mungkin warga pendatang baru. Anda dapat mendaftarkan NIK Anda sekarang agar otomatis terisi.
            </p>
            <div className="mt-2.5">
              <button
                type="button"
                onClick={onAddNewCitizenModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-xs cursor-pointer shadow-xs transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Daftarkan NIK Baru ke Database
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
