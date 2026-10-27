import React, { useState } from 'react';
import { X, UserPlus, Check, MapPin, Phone, Calendar, IdCard } from 'lucide-react';
import { Citizen } from '../types';

interface AddCitizenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCitizen: (citizen: Citizen) => void;
}

export const AddCitizenModal: React.FC<AddCitizenModalProps> = ({
  isOpen,
  onClose,
  onAddCitizen,
}) => {
  const [formData, setFormData] = useState<Citizen>({
    nik: '320412' + Math.floor(1000000000 + Math.random() * 9000000000).toString(),
    nama: '',
    tempatLahir: 'Bandung',
    tanggalLahir: '1995-05-15',
    jenisKelamin: 'Laki-laki',
    agama: 'Islam',
    statusPerkawinan: 'Kawin',
    pekerjaan: 'Wiraswasta',
    alamat: 'Kp. Sukamaju No. ',
    rt: '001',
    rw: '002',
    dusun: 'Dusun Mekar Asri',
    desa: 'Sukamaju',
    kecamatan: 'Ciwidey',
    kabupaten: 'Kabupaten Bandung',
    provinsi: 'Jawa Barat',
    noHp: '081234567890',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nik.length !== 16) {
      alert('NIK harus tepat 16 digit angka!');
      return;
    }
    if (!formData.nama.trim()) {
      alert('Nama lengkap wajib diisi!');
      return;
    }

    onAddCitizen(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Tambah Data Kependudukan Baru
              </h3>
              <p className="text-xs text-blue-100">
                Daftarkan warga baru agar otomatis terdeteksi via NIK
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            {/* NIK */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-800 mb-1">
                Nomor Induk Kependudukan (NIK 16 Digit) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={16}
                value={formData.nik}
                onChange={(e) =>
                  setFormData({ ...formData, nik: e.target.value.replace(/\D/g, '').slice(0, 16) })
                }
                placeholder="320412xxxxxxxxxx"
                className="w-full px-3 py-2 font-mono font-bold text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                {formData.nik.length}/16 digit
              </span>
            </div>

            {/* Nama Lengkap */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-800 mb-1">
                Nama Lengkap (Sesuai KTP) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value.toUpperCase() })}
                placeholder="Contoh: AHMAD HIDAYAT"
                className="w-full px-3 py-2 font-semibold bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              />
            </div>

            {/* Tempat Lahir */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Tempat Lahir <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.tempatLahir}
                onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tanggal Lahir */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Tanggal Lahir <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.tanggalLahir}
                onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.jenisKelamin}
                onChange={(e) =>
                  setFormData({ ...formData, jenisKelamin: e.target.value as any })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            {/* Agama */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Agama <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.agama}
                onChange={(e) =>
                  setFormData({ ...formData, agama: e.target.value as any })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Konghucu">Konghucu</option>
              </select>
            </div>

            {/* Status Perkawinan */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Status Perkawinan
              </label>
              <select
                value={formData.statusPerkawinan}
                onChange={(e) =>
                  setFormData({ ...formData, statusPerkawinan: e.target.value as any })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Belum Kawin">Belum Kawin</option>
                <option value="Kawin">Kawin</option>
                <option value="Cerai Hidup">Cerai Hidup</option>
                <option value="Cerai Mati">Cerai Mati</option>
              </select>
            </div>

            {/* Pekerjaan */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Pekerjaan
              </label>
              <input
                type="text"
                value={formData.pekerjaan}
                onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                placeholder="Contoh: Wiraswasta / Karyawan"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Alamat Jalan / Kp */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-800 mb-1">
                Alamat / Kampung / Jalan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                placeholder="Contoh: Kp. Sukasari No. 12"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* RT & RW */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                RT (3 Digit)
              </label>
              <input
                type="text"
                maxLength={3}
                value={formData.rt}
                onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                placeholder="001"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                RW (3 Digit)
              </label>
              <input
                type="text"
                maxLength={3}
                value={formData.rw}
                onChange={(e) => setFormData({ ...formData, rw: e.target.value })}
                placeholder="002"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            {/* No WhatsApp */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-800 mb-1">
                Nomor WhatsApp (Untuk Notifikasi Surat Selesai) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.noHp}
                onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                placeholder="Contoh: 081234567890"
                className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg text-slate-600 text-[11px] leading-relaxed">
            Data ini akan tersimpan ke database sensus kependudukan desa dan langsung aktif untuk autofill pengajuan semua jenis surat.
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Simpan & Pilih NIK Ini
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
