import { LetterTypeKey } from '../types';

export interface LetterMeta {
  key: LetterTypeKey;
  kodeKlasifikasi: string; // Misal 503 untuk ekonomi/usaha, 401 untuk sosial/SKTM, 470 untuk kependudukan/domisili, 300 untuk pengantar/keamanan
  singkatan: string;
  judulResmi: string;
  deskripsi: string;
  waktuProses: string;
  iconName: string;
  isPopular: boolean;
  fields: {
    name: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'textarea' | 'date';
    placeholder?: string;
    options?: string[];
    required?: boolean;
    defaultValue?: string;
    helperText?: string;
  }[];
}

export const LETTER_TYPES: Record<LetterTypeKey, LetterMeta> = {
  SKU: {
    key: 'SKU',
    kodeKlasifikasi: '503',
    singkatan: 'DS-SKU',
    judulResmi: 'SURAT KETERANGAN USAHA',
    deskripsi: 'Keterangan resmi kepemilikan dan legalitas tempat usaha warga di wilayah desa.',
    waktuProses: 'Langsung Terbit (Instan)',
    iconName: 'Store',
    isPopular: true,
    fields: [
      {
        name: 'namaUsaha',
        label: 'Nama Usaha / Merk Dagang',
        type: 'text',
        placeholder: 'Contoh: Warung Berkah Barokah / Konveksi Mandiri',
        required: true,
      },
      {
        name: 'bidangUsaha',
        label: 'Jenis / Bidang Usaha',
        type: 'select',
        options: [
          'Perdagangan Sembako & Kelontong',
          'Kuliner / Makanan & Minuman',
          'Pertanian / Peternakan / Perikanan',
          'Kerajinan Tangan & UMKM Kreatif',
          'Jasa Jahit / Konveksi / Busana',
          'Bengkel Motor / Mobil & Otomotif',
          'Jasa Elektronik / Fotokopi / ATK',
          'Toko Bangunan & Material',
          'Lainnya',
        ],
        required: true,
      },
      {
        name: 'alamatUsaha',
        label: 'Alamat Lokasi Usaha',
        type: 'text',
        placeholder: 'Contoh: Kp. Sukasari RT 003 / RW 007 Desa Sukamaju',
        required: true,
      },
      {
        name: 'tahunBerdiri',
        label: 'Tahun Mulai Beroperasi',
        type: 'number',
        placeholder: 'Contoh: 2021',
        required: true,
        defaultValue: '2022',
      },
      {
        name: 'keperluan',
        label: 'Keperluan Pembuatan SKU',
        type: 'select',
        options: [
          'Pengajuan Kredit Usaha Rakyat (KUR) BRI / Mandiri / BNI / BJB',
          'Kelengkapan Syarat Bantuan Modal Usaha / BLT UMKM',
          'Syarat Pembukaan Rekening Bank Perusahaan/Usaha',
          'Syarat Pengajuan Izin Edar / P-IRT / NIB',
          'Perjanjian Kerjasama Mitra Usaha',
          'Lainnya',
        ],
        required: true,
      },
    ],
  },
  SKTM: {
    key: 'SKTM',
    kodeKlasifikasi: '401',
    singkatan: 'DS-SKTM',
    judulResmi: 'SURAT KETERANGAN TIDAK MAMPU',
    deskripsi: 'Keterangan kondisi sosial ekonomi keluarga prasejahtera untuk beasiswa, kesehatan, atau bantuan sosial.',
    waktuProses: 'Langsung Terbit (Instan)',
    iconName: 'HeartHandshake',
    isPopular: true,
    fields: [
      {
        name: 'kategoriSktm',
        label: 'Kategori Keperluan SKTM',
        type: 'select',
        options: [
          'Pendidikan (KIP Kuliah / Beasiswa Siswa / Keringanan SPP)',
          'Kesehatan (Pengobatan / Rujukan RSUD / BPJS PBI)',
          'Bantuan Sosial (PKH / Sembako / Bantuan Pemda)',
          'Keringanan Tagihan Listrik / Air Bersih',
          'Bantuan Hukum Pro Bono / Pengadilan',
        ],
        required: true,
      },
      {
        name: 'namaInstansiTujuan',
        label: 'Nama Instansi / Sekolah / Kampus Tujuan',
        type: 'text',
        placeholder: 'Contoh: Universitas Pendidikan Indonesia / RSUD Soreang',
        required: true,
      },
      {
        name: 'penghasilanBulanan',
        label: 'Rata-rata Penghasilan Keluarga per Bulan',
        type: 'select',
        options: [
          'Kurang dari Rp 500.000,- / bulan',
          'Rp 500.000 - Rp 1.000.000,- / bulan',
          'Rp 1.000.000 - Rp 1.500.000,- / bulan',
          'Tidak menentu / serabutan',
        ],
        required: true,
      },
      {
        name: 'jumlahTanggungan',
        label: 'Jumlah Anggota Keluarga yang Ditanggung',
        type: 'number',
        placeholder: 'Contoh: 3',
        required: true,
        defaultValue: '3',
      },
      {
        name: 'keteranganKondisi',
        label: 'Keterangan Tambahan / Kondisi Khusus',
        type: 'textarea',
        placeholder: 'Jelaskan kondisi ekonomi, contoh: Orang tua sakit menahun, kepala keluarga buruh harian lepas.',
        required: false,
      },
    ],
  },
  DOMISILI: {
    key: 'DOMISILI',
    kodeKlasifikasi: '470',
    singkatan: 'DS-SKD',
    judulResmi: 'SURAT KETERANGAN DOMISILI',
    deskripsi: 'Keterangan resmi tempat tinggal atau keberadaan warga di lingkungan RT/RW Desa Sukamaju.',
    waktuProses: 'Langsung Terbit (Instan)',
    iconName: 'Home',
    isPopular: true,
    fields: [
      {
        name: 'alamatDomisili',
        label: 'Alamat Tinggal Domisili Saat Ini',
        type: 'text',
        placeholder: 'Contoh: Kp. Sukasari RT 003 / RW 007 Desa Sukamaju',
        required: true,
      },
      {
        name: 'statusTempatTinggal',
        label: 'Status Kepemilikan Tempat Tinggal',
        type: 'select',
        options: [
          'Rumah Milik Sendiri',
          'Sewa / Kontrakan',
          'Menumpang di Rumah Orang Tua / Saudara',
          'Mess Karyawan / Asrama',
        ],
        required: true,
      },
      {
        name: 'lamaTinggal',
        label: 'Lama Menetap di Alamat Tersebut',
        type: 'text',
        placeholder: 'Contoh: Sejak 3 Tahun yang lalu (2023)',
        required: true,
        defaultValue: 'Sejak lahir / 5 tahun',
      },
      {
        name: 'keperluan',
        label: 'Keperluan Pembuatan Domisili',
        type: 'select',
        options: [
          'Kelengkapan Berkas Lamaran Pekerjaan',
          'Pembukaan Rekening Tabungan Bank / ATM',
          'Persyaratan Pendaftaran Sekolah / Zonasi PPDB',
          'Perekaman KTP Elektronik Baru / Mutasi Domisili',
          'Persyaratan Pengajuan Paspor / Visa',
          'Pemasangan Meteran Listrik PLN / PDAM Baru',
          'Lainnya',
        ],
        required: true,
      },
    ],
  },
  PENGANTAR: {
    key: 'PENGANTAR',
    kodeKlasifikasi: '300',
    singkatan: 'DS-SKP',
    judulResmi: 'SURAT PENGANTAR',
    deskripsi: 'Surat rekomendasi & pengantar resmi untuk pengurusan SKCK di Polsek/Polres, Disdukcapil, KUA, dll.',
    waktuProses: 'Langsung Terbit (Instan)',
    iconName: 'FileText',
    isPopular: true,
    fields: [
      {
        name: 'jenisPengantar',
        label: 'Jenis Pengantar Kepengurusan',
        type: 'select',
        options: [
          'Pengantar Pembuatan SKCK (Surat Keterangan Catatan Kepolisian)',
          'Pengantar Pembuatan KTP-el / Kartu Keluarga (Disdukcapil)',
          'Pengantar Surat Nikah / N1-N4 ke KUA',
          'Pengantar Pindah Datang / Pindah Keluar Penduduk',
          'Pengantar Izin Keramaian / Acara Hajatan Warga',
          'Pengantar Pengurusan Akta Kelahiran / Kematian',
          'Lainnya',
        ],
        required: true,
      },
      {
        name: 'instansiTujuan',
        label: 'Instansi / Lembaga Tujuan Pengantar',
        type: 'text',
        placeholder: 'Contoh: Kepolisian Sektor (Polsek) Ciwidey / Kantor Kecamatan Ciwidey',
        required: true,
      },
      {
        name: 'keperluan',
        label: 'Tujuan / Keterangan Spesifik',
        type: 'textarea',
        placeholder: 'Contoh: Untuk persyaratan pendaftaran seleksi Calon Pegawai Negeri Sipil (CPNS) / BUMN tahun 2026.',
        required: true,
      },
    ],
  },
  BELUM_MENIKAH: {
    key: 'BELUM_MENIKAH',
    kodeKlasifikasi: '474',
    singkatan: 'DS-SKBM',
    judulResmi: 'SURAT KETERANGAN BELUM PERNAH MENIKAH',
    deskripsi: 'Menerangkan bahwa yang bersangkutan berstatus jejaka/perawan dan belum pernah menikah.',
    waktuProses: 'Langsung Terbit (Instan)',
    iconName: 'UserCheck',
    isPopular: false,
    fields: [
      {
        name: 'keperluan',
        label: 'Keperluan',
        type: 'select',
        options: [
          'Persyaratan Pendaftaran Pernikahan di KUA',
          'Persyaratan Melamar Pekerjaan / Ikatan Dinas',
          'Persyaratan Beasiswa Ikatan Dinas',
          'Pengajuan KPR Rumah Subsidi',
        ],
        required: true,
      },
    ],
  },
  KELAHIRAN: {
    key: 'KELAHIRAN',
    kodeKlasifikasi: '474.1',
    singkatan: 'DS-SKL',
    judulResmi: 'SURAT KETERANGAN KELAHIRAN',
    deskripsi: 'Surat pengantar kelahiran anak dari pasangan sah warga desa untuk pembuatan Akta Kelahiran.',
    waktuProses: 'Langsung Terbit (Instan)',
    iconName: 'Baby',
    isPopular: false,
    fields: [
      {
        name: 'namaAnak',
        label: 'Nama Lengkap Anak',
        type: 'text',
        placeholder: 'Contoh: Muhammad Rayhan Pratama',
        required: true,
      },
      {
        name: 'jenisKelaminAnak',
        label: 'Jenis Kelamin Anak',
        type: 'select',
        options: ['Laki-laki', 'Perempuan'],
        required: true,
      },
      {
        name: 'tempatLahirAnak',
        label: 'Tempat Lahir Anak',
        type: 'text',
        placeholder: 'Contoh: Bandung / Puskesmas Ciwidey',
        required: true,
      },
      {
        name: 'tanggalLahirAnak',
        label: 'Tanggal Lahir Anak',
        type: 'date',
        required: true,
      },
      {
        name: 'namaAyah',
        label: 'Nama Ayah Kandung',
        type: 'text',
        required: true,
      },
      {
        name: 'namaIbu',
        label: 'Nama Ibu Kandung',
        type: 'text',
        required: true,
      },
    ],
  },
  KEMATIAN: {
    key: 'KEMATIAN',
    kodeKlasifikasi: '474.3',
    singkatan: 'DS-SKK',
    judulResmi: 'SURAT KETERANGAN KEMATIAN',
    deskripsi: 'Surat keterangan resmi atas meninggal dunianya salah satu warga desa.',
    waktuProses: 'Langsung Terbit (Instan)',
    iconName: 'FileSpreadsheet',
    isPopular: false,
    fields: [
      {
        name: 'namaAlmarhum',
        label: 'Nama Jenazah / Almarhum(ah)',
        type: 'text',
        required: true,
      },
      {
        name: 'tanggalMeninggal',
        label: 'Hari / Tanggal Meninggal',
        type: 'date',
        required: true,
      },
      {
        name: 'tempatMeninggal',
        label: 'Tempat Meninggal Dunia',
        type: 'text',
        placeholder: 'Contoh: Rumah Duka / RSUD Soreang',
        required: true,
      },
      {
        name: 'penyebabMeninggal',
        label: 'Penyebab Meninggal',
        type: 'select',
        options: ['Sakit Biasa / Usia Lanjut', 'Kecelakaan', 'Sakit Komplikasi', 'Lainnya'],
        required: true,
      },
    ],
  },
};

export function getRomanMonth(monthIndex: number): string {
  const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  return romans[monthIndex] || 'X';
}

export function formatIndonesianDate(dateString?: string): string {
  const date = dateString ? new Date(dateString) : new Date();
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const day = date.getDate().toString().padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function generateLetterNumber(letterKey: LetterTypeKey, sequenceNumber: number): string {
  const meta = LETTER_TYPES[letterKey];
  const now = new Date();
  const romanMonth = getRomanMonth(now.getMonth());
  const year = now.getFullYear();
  const formattedSeq = sequenceNumber.toString().padStart(3, '0');
  return `${meta.kodeKlasifikasi} / ${formattedSeq} / ${meta.singkatan} / ${romanMonth} / ${year}`;
}
