export type LetterTypeKey = 'SKU' | 'SKTM' | 'DOMISILI' | 'PENGANTAR' | 'KELAHIRAN' | 'KEMATIAN' | 'BELUM_MENIKAH';

export interface Citizen {
  nik: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string; // YYYY-MM-DD
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  agama: 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu';
  statusPerkawinan: 'Belum Kawin' | 'Kawin' | 'Cerai Hidup' | 'Cerai Mati';
  pekerjaan: string;
  alamat: string;
  rt: string;
  rw: string;
  dusun: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  noHp: string; // WhatsApp number
}

export interface LetterSubmission {
  id: string; // Resi / ID
  nomorSurat: string;
  jenisSurat: LetterTypeKey;
  namaSurat: string;
  nikPemohon: string;
  namaPemohon: string;
  dataPemohon: Citizen;
  detailSurat: Record<string, string | number | boolean>;
  keperluan: string;
  tanggalPengajuan: string;
  tanggalDisetujui?: string;
  status: 'PENDING' | 'DISETUJUI' | 'SELESAI' | 'DITOLAK';
  catatanPetugas?: string;
  kodeVerifikasi: string; // QR code verification token
  hashKeabsahan: string;
  notifikasiWaTerkirim: boolean;
  tanggalWaTerkirim?: string;
}

export interface VillageProfile {
  namaPemerintah: string; // PEMERINTAH KABUPATEN BANDUNG
  namaKecamatan: string; // KECAMATAN CIWIDEY
  namaDesa: string; // DESA SUKAMAJU
  alamatDesa: string; // Jl. Raya Ciwidey No. 142
  kodePos: string; // 40973
  telepon: string; // (022) 5928xxx
  email: string; // desasukamaju@bandungkab.go.id
  website: string; // https://sukamaju.desa.id
  namaKepalaDesa: string; // DRS. H. MULYADI KUSUMA, M.Si
  nipKepalaDesa?: string; // NIP 19740512 200212 1 004
  jabatanPenandatangan: string; // KEPALA DESA SUKAMAJU
}
