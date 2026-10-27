import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Store,
  HeartHandshake,
  Home,
  FileText,
  UserCheck,
  Baby,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Info,
  Clock,
  Send,
} from 'lucide-react';
import { Citizen, LetterTypeKey, LetterSubmission, VillageProfile } from '../types';
import { LETTER_TYPES, generateLetterNumber } from '../data/letterTemplates';

interface SubmissionFormProps {
  citizens: Citizen[];
  selectedCitizen: Citizen | null;
  village: VillageProfile;
  totalSubmissionsCount: number;
  onSuccessSubmission: (submission: LetterSubmission) => void;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  selectedCitizen,
  village,
  totalSubmissionsCount,
  onSuccessSubmission,
}) => {
  const [selectedLetterKey, setSelectedLetterKey] = useState<LetterTypeKey>('SKU');
  const [showAllLetters, setShowAllLetters] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generalKeperluan, setGeneralKeperluan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync / populate defaults when letter or citizen changes
  useEffect(() => {
    const meta = LETTER_TYPES[selectedLetterKey];
    const initial: Record<string, string> = {};
    meta.fields.forEach((f) => {
      if (f.name === 'alamatDomisili' && selectedCitizen) {
        initial[f.name] = `${selectedCitizen.alamat}, RT ${selectedCitizen.rt} / RW ${selectedCitizen.rw}, Dusun ${selectedCitizen.dusun}, Desa ${selectedCitizen.desa}`;
      } else if (f.name === 'alamatUsaha' && selectedCitizen) {
        initial[f.name] = `${selectedCitizen.alamat}, Desa ${selectedCitizen.desa}`;
      } else if (f.name === 'namaAyah' && selectedCitizen) {
        initial[f.name] = selectedCitizen.nama;
      } else {
        initial[f.name] = f.defaultValue || (f.options ? f.options[0] : '');
      }
    });
    setFormData(initial);
  }, [selectedLetterKey, selectedCitizen]);

  const handleFieldChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getLetterIcon = (iconName: string) => {
    switch (iconName) {
      case 'Store':
        return <Store className="w-5 h-5 text-blue-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-rose-600" />;
      case 'Home':
        return <Home className="w-5 h-5 text-emerald-600" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-amber-600" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-indigo-600" />;
      case 'Baby':
        return <Baby className="w-5 h-5 text-pink-600" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-slate-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCitizen) {
      alert('Mohon masukkan atau pilih NIK warga terlebih dahulu di Bagian 1.');
      return;
    }

    setIsSubmitting(true);

    // Generate unique verification code & submission ID
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const submissionId = `REG-${Date.now().toString().slice(-6)}`;
    const nomorSurat = generateLetterNumber(selectedLetterKey, totalSubmissionsCount + 1);
    const kodeVerifikasi = `TTE-${selectedLetterKey}-${randomHex}-${Date.now().toString().slice(-4)}`;
    const hashKeabsahan = `SHA256-${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`.toUpperCase();

    const keperluanText = formData.keperluan || generalKeperluan || 'Keperluan Administrasi Resmi';

    const newSubmission: LetterSubmission = {
      id: submissionId,
      nomorSurat,
      jenisSurat: selectedLetterKey,
      namaSurat: LETTER_TYPES[selectedLetterKey].judulResmi,
      nikPemohon: selectedCitizen.nik,
      namaPemohon: selectedCitizen.nama,
      dataPemohon: selectedCitizen,
      detailSurat: formData,
      keperluan: keperluanText,
      tanggalPengajuan: new Date().toISOString(),
      tanggalDisetujui: new Date().toISOString(),
      status: 'SELESAI', // Langsung terbit otomatis di Anjungan Mandiri
      catatanPetugas: 'Diterbitkan otomatis melalui Anjungan Mandiri Desa Sukamaju dengan verifikasi NIK Kependudukan.',
      kodeVerifikasi,
      hashKeabsahan,
      notifikasiWaTerkirim: false,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      // Trigger joyful celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore if confetti fails
      }
      onSuccessSubmission(newSubmission);
    }, 600);
  };

  const currentMeta = LETTER_TYPES[selectedLetterKey];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step 2: Choose Letter Type */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">
              2
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Pilihan Surat Populer
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Pilih surat resmi yang ingin diajukan
          </span>
        </div>

        {/* 4 Popular Letters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {(['SKU', 'SKTM', 'DOMISILI', 'PENGANTAR'] as LetterTypeKey[]).map((key) => {
            const meta = LETTER_TYPES[key];
            const isSelected = selectedLetterKey === key;
            return (
              <div
                key={key}
                onClick={() => setSelectedLetterKey(key)}
                className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 shadow-sm ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/60 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-100'
                      }`}
                    >
                      {getLetterIcon(meta.iconName)}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      Populer
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {meta.judulResmi} ({key})
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {meta.deskripsi}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <Clock className="w-3 h-3" /> {meta.waktuProses}
                  </span>
                  <span
                    className={`font-semibold ${
                      isSelected ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  >
                    {isSelected ? '✓ Terpilih' : 'Pilih'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Expander for Other Village Letters */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAllLetters(!showAllLetters)}
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showAllLetters ? 'rotate-180' : ''}`}
            />
            {showAllLetters
              ? 'Sembunyikan Pilihan Surat Lainnya'
              : 'Lihat Opsi Surat Lainnya (Kelahiran, Kematian, Belum Menikah)'}
          </button>

          {showAllLetters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-100 animate-fadeIn">
              {(['BELUM_MENIKAH', 'KELAHIRAN', 'KEMATIAN'] as LetterTypeKey[]).map((key) => {
                const meta = LETTER_TYPES[key];
                const isSelected = selectedLetterKey === key;
                return (
                  <div
                    key={key}
                    onClick={() => setSelectedLetterKey(key)}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                        : 'border-slate-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1.5 rounded-md bg-slate-100">
                        {getLetterIcon(meta.iconName)}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {meta.judulResmi}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {meta.deskripsi}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Step 3: Specific Letter Detail Fields */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">
              3
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Lengkapi Rincian Dokumen: {currentMeta.judulResmi}
              </h3>
              <p className="text-xs text-slate-500">
                Kode Klasifikasi Surat: <span className="font-mono font-bold text-slate-700">{currentMeta.kodeKlasifikasi}</span> &bull; {currentMeta.singkatan}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Fields for the selected letter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentMeta.fields.map((field) => (
            <div
              key={field.name}
              className={field.type === 'textarea' ? 'md:col-span-2' : ''}
            >
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                {field.label}{' '}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === 'select' ? (
                <select
                  value={formData[field.name] || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  required={field.required}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  rows={3}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              )}

              {field.helperText && (
                <p className="text-[11px] text-slate-500 mt-1">
                  {field.helperText}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Village Guarantee Info Banner */}
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 flex items-start gap-3 text-xs text-blue-900">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">
              Kop Surat Resmi & QR Code Keabsahan Otomatis Diterbitkan
            </p>
            <p className="text-blue-800/90 leading-relaxed">
              Dokumen yang dihasilkan menggunakan format resmi {village.namaDesa}, lengkap dengan Tanda Tangan Elektronik {village.jabatanPenandatangan}, stempel digital, dan tautan verifikasi keabsahan yang dapat discan oleh instansi tujuan.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            {selectedCitizen ? (
              <span className="text-emerald-700 font-medium">
                ✓ Pemohon: <strong>{selectedCitizen.nama}</strong> ({selectedCitizen.nik})
              </span>
            ) : (
              <span className="text-amber-600 font-medium">
                ⚠️ Mohon isi NIK pada Bagian 1 terlebih dahulu
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !selectedCitizen}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer ${
              !selectedCitizen || isSubmitting
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Memproses Dokumen & QR Code...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Terbitkan Dokumen & PDF Otomatis</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
