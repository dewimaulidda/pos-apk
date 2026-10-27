import React, { useState } from 'react';
import {
  FileText,
  Users,
  Building,
  Search,
  Download,
  Share2,
  CheckCircle,
  Eye,
  Plus,
  Printer,
  ShieldCheck,
  Check,
  Clock,
  Sparkles,
} from 'lucide-react';
import { LetterSubmission, Citizen, VillageProfile } from '../types';
import { formatIndonesianDate } from '../data/letterTemplates';
import { downloadOfficialPDF } from '../utils/pdfGenerator';

interface AdminDashboardProps {
  submissions: LetterSubmission[];
  citizens: Citizen[];
  village: VillageProfile;
  onUpdateVillage: (profile: VillageProfile) => void;
  onViewDocument: (sub: LetterSubmission) => void;
  onOpenWhatsApp: (sub: LetterSubmission) => void;
  onOpenVerification: (sub: LetterSubmission) => void;
  onAddNewCitizenModal: () => void;
  onApproveSubmission?: (subId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  submissions,
  citizens,
  village,
  onUpdateVillage,
  onViewDocument,
  onOpenWhatsApp,
  onOpenVerification,
  onAddNewCitizenModal,
  onApproveSubmission,
}) => {
  const [activeTab, setActiveTab] = useState<'SURAT' | 'WARGA' | 'PENGATURAN'>('SURAT');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [tempVillage, setTempVillage] = useState<VillageProfile>(village);
  const [savedSettings, setSavedSettings] = useState(false);

  // Filtered submissions
  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch =
      s.namaPemohon.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nikPemohon.includes(searchTerm) ||
      s.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.namaSurat.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered citizens
  const filteredCitizens = citizens.filter((c) => {
    return (
      c.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nik.includes(searchTerm) ||
      c.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.pekerjaan.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSaveVillage = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateVillage(tempVillage);
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Overview Metric Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Surat Diterbitkan</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{submissions.length}</p>
          <span className="text-[11px] text-emerald-600 font-medium">100% Ber-KOP & QR Code</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Database Warga (NIK)</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{citizens.length}</p>
          <span className="text-[11px] text-slate-500">Tersinkronisasi Autofill</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Notifikasi WA Terkirim</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {submissions.filter((s) => s.notifikasiWaTerkirim).length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Pengiriman Otomatis</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Otoritas Validasi TTE</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-900 mt-2 truncate">
            {village.namaKepalaDesa.split(',')[0]}
          </p>
          <span className="text-[11px] text-slate-500">{village.jabatanPenandatangan}</span>
        </div>
      </div>

      {/* Main Tab Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('SURAT')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'SURAT'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Daftar Arsip Surat Masuk & Keluar ({submissions.length})
          </button>

          <button
            onClick={() => setActiveTab('WARGA')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'WARGA'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Database Penduduk / NIK ({citizens.length})
          </button>

          <button
            onClick={() => setActiveTab('PENGATURAN')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'PENGATURAN'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-4 h-4" />
            Pengaturan KOP Surat & Profil Desa
          </button>
        </div>

        {/* Tab 1: Submissions Management */}
        {activeTab === 'SURAT' && (
          <div className="p-5 sm:p-6 space-y-4">
            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[260px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari berdasarkan Nama Pemohon, NIK, No. Surat..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="SELESAI">Selesai / Terbit</option>
                  <option value="PENDING">Menunggu Verifikasi</option>
                </select>
              </div>
            </div>

            {/* Table of Submissions */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200 uppercase text-[10.5px]">
                  <tr>
                    <th className="px-4 py-3">No. Surat & Tanggal</th>
                    <th className="px-4 py-3">Jenis Dokumen</th>
                    <th className="px-4 py-3">Pemohon (NIK)</th>
                    <th className="px-4 py-3">Status & QR</th>
                    <th className="px-4 py-3">Notifikasi WA</th>
                    <th className="px-4 py-3 text-right">Aksi Dokumen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        Belum ada dokumen surat yang sesuai dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5">
                          <span className="font-mono font-bold text-slate-900 block">
                            {sub.nomorSurat}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {formatIndonesianDate(sub.tanggalDisetujui || sub.tanggalPengajuan)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-slate-900 block">
                            {sub.namaSurat}
                          </span>
                          <span className="text-[11px] text-slate-500 line-clamp-1">
                            {sub.keperluan}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-bold text-slate-900 block">
                            {sub.namaPemohon}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500">
                            {sub.nikPemohon}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-100 text-emerald-800">
                            <Check className="w-3 h-3" /> Sah & Terbit
                          </span>
                          <button
                            onClick={() => onOpenVerification(sub)}
                            className="block text-[10px] text-blue-600 hover:underline mt-1 font-mono"
                          >
                            {sub.kodeVerifikasi.slice(0, 16)}...
                          </button>
                        </td>
                        <td className="px-4 py-3.5">
                          {sub.notifikasiWaTerkirim ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Terkirim
                            </span>
                          ) : (
                            <button
                              onClick={() => onOpenWhatsApp(sub)}
                              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 cursor-pointer"
                            >
                              <Share2 className="w-3 h-3" /> Kirim WA
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => onViewDocument(sub)}
                            title="Buka Dokumen A4"
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => downloadOfficialPDF(sub, village)}
                            title="Unduh PDF Resmi"
                            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onOpenWhatsApp(sub)}
                            title="Kirim Notifikasi WhatsApp"
                            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Citizens Management */}
        {activeTab === 'WARGA' && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[260px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari NIK, Nama Warga, Alamat..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={onAddNewCitizenModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Tambah Penduduk Baru
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200 uppercase text-[10.5px]">
                  <tr>
                    <th className="px-4 py-3">NIK (16 Digit)</th>
                    <th className="px-4 py-3">Nama Lengkap</th>
                    <th className="px-4 py-3">TTL & Usia</th>
                    <th className="px-4 py-3">Alamat (RT/RW)</th>
                    <th className="px-4 py-3">Pekerjaan</th>
                    <th className="px-4 py-3">No. WhatsApp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredCitizens.map((c) => (
                    <tr key={c.nik} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {c.nik}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {c.nama}
                      </td>
                      <td className="px-4 py-3">
                        {c.tempatLahir}, {formatIndonesianDate(c.tanggalLahir)}
                      </td>
                      <td className="px-4 py-3">
                        {c.alamat}, RT {c.rt} / RW {c.rw}
                      </td>
                      <td className="px-4 py-3">{c.pekerjaan}</td>
                      <td className="px-4 py-3 font-mono text-emerald-700 font-medium">
                        {c.noHp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Village Profile & KOP Surat Configuration */}
        {activeTab === 'PENGATURAN' && (
          <form onSubmit={handleSaveVillage} className="p-5 sm:p-6 space-y-4 max-w-2xl">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              Kustomisasi KOP Surat & Pejabat Penandatangan
            </h4>

            {savedSettings && (
              <div className="bg-emerald-100 text-emerald-800 px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                Data KOP Surat dan Profil Desa Berhasil Diperbarui!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Pemerintah Daerah / Kabupaten
                </label>
                <input
                  type="text"
                  value={tempVillage.namaPemerintah}
                  onChange={(e) =>
                    setTempVillage({ ...tempVillage, namaPemerintah: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Kecamatan
                </label>
                <input
                  type="text"
                  value={tempVillage.namaKecamatan}
                  onChange={(e) =>
                    setTempVillage({ ...tempVillage, namaKecamatan: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Kantor Desa
                </label>
                <input
                  type="text"
                  value={tempVillage.namaDesa}
                  onChange={(e) =>
                    setTempVillage({ ...tempVillage, namaDesa: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Alamat Kantor Desa
                </label>
                <input
                  type="text"
                  value={tempVillage.alamatDesa}
                  onChange={(e) =>
                    setTempVillage({ ...tempVillage, alamatDesa: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kode Pos & Telepon
                </label>
                <input
                  type="text"
                  value={tempVillage.telepon}
                  onChange={(e) =>
                    setTempVillage({ ...tempVillage, telepon: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Website / Email Resmi
                </label>
                <input
                  type="text"
                  value={tempVillage.website}
                  onChange={(e) =>
                    setTempVillage({ ...tempVillage, website: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Pejabat Penandatangan
                </label>
                <input
                  type="text"
                  value={tempVillage.namaKepalaDesa}
                  onChange={(e) =>
                    setTempVillage({ ...tempVillage, namaKepalaDesa: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Jabatan (Contoh: Kepala Desa Sukamaju)
                </label>
                <input
                  type="text"
                  value={tempVillage.jabatanPenandatangan}
                  onChange={(e) =>
                    setTempVillage({ ...tempVillage, jabatanPenandatangan: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Simpan Perubahan KOP & Profil Desa
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
