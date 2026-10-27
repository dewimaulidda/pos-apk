import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, Share2, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';
import { LetterSubmission, VillageProfile } from '../types';
import { KopSurat } from './KopSurat';
import { formatIndonesianDate } from '../data/letterTemplates';
import { downloadOfficialPDF } from '../utils/pdfGenerator';

interface LetterDocumentPreviewProps {
  submission: LetterSubmission;
  village: VillageProfile;
  onOpenVerification?: (submission: LetterSubmission) => void;
  onOpenWhatsApp?: (submission: LetterSubmission) => void;
}

export const LetterDocumentPreview: React.FC<LetterDocumentPreviewProps> = ({
  submission,
  village,
  onOpenVerification,
  onOpenWhatsApp,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const citizen = submission.dataPemohon;
  const tglTerbit = formatIndonesianDate(submission.tanggalDisetujui || submission.tanggalPengajuan);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadOfficialPDF(submission, village);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const qrData = JSON.stringify({
    nomorSurat: submission.nomorSurat,
    nik: submission.nikPemohon,
    nama: submission.namaPemohon,
    jenisSurat: submission.namaSurat,
    tanggal: tglTerbit,
    kodeVerifikasi: submission.kodeVerifikasi,
    desa: village.namaDesa,
    status: 'SAH & DIVERIFIKASI RESMI SISTEM TTE DESA',
  });

  return (
    <div className="space-y-4">
      {/* Action Bar for the document */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              Dokumen Resmi Selesai Diproses
            </h4>
            <p className="text-xs text-slate-500">
              No. Registrasi: <span className="font-mono font-bold text-slate-700">{submission.nomorSurat}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? 'Membuat PDF...' : 'Unduh PDF Otomatis'}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            Cetak (Print Langsung)
          </button>

          {onOpenWhatsApp && (
            <button
              onClick={() => onOpenWhatsApp(submission)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              Notifikasi WhatsApp
            </button>
          )}

          {onOpenVerification && (
            <button
              onClick={() => onOpenVerification(submission)}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200"
              title="Lihat status keabsahan dokumen"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Cek Keabsahan QR
            </button>
          )}
        </div>
      </div>

      {/* A4 Paper Document Preview Container */}
      <div className="bg-slate-100/70 p-4 sm:p-8 rounded-2xl flex justify-center overflow-x-auto">
        <div
          id="printable-letter"
          className="print-area bg-white text-slate-900 shadow-xl border border-slate-200 sm:rounded-sm w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-14 font-['Tinos',serif] text-[13.5px] leading-relaxed relative"
        >
          {/* KOP SURAT */}
          <KopSurat village={village} />

          {/* LETTER TITLE & NUMBER */}
          <div className="text-center my-6">
            <h1 className="text-base sm:text-lg font-bold tracking-wide uppercase border-b-2 border-slate-900 inline-block px-4 pb-0.5">
              {submission.namaSurat}
            </h1>
            <p className="text-xs sm:text-sm font-normal text-slate-800 mt-1">
              Nomor : {submission.nomorSurat}
            </p>
          </div>

          {/* PREAMBLE */}
          <div className="text-justify mb-4">
            <p className="indent-8 leading-relaxed">
              Yang bertanda tangan di bawah ini {village.jabatanPenandatangan}, Kecamatan{' '}
              {village.namaKecamatan.replace('KECAMATAN ', '')},{' '}
              {village.namaPemerintah.replace('PEMERINTAH ', '')}, dengan ini menerangkan dengan sebenarnya bahwa :
            </p>
          </div>

          {/* CITIZEN DATA (AUTOFILLED FROM NIK) */}
          <div className="ml-4 sm:ml-8 my-4 space-y-1 text-slate-900 text-xs sm:text-[13px]">
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-4 sm:col-span-3 text-slate-700">Nama Lengkap</span>
              <span className="col-span-1 text-center">:</span>
              <span className="col-span-7 sm:col-span-8 font-bold">{citizen.nama.toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-4 sm:col-span-3 text-slate-700">Nomor Induk Kependudukan (NIK)</span>
              <span className="col-span-1 text-center">:</span>
              <span className="col-span-7 sm:col-span-8 font-bold tracking-wide">{citizen.nik}</span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-4 sm:col-span-3 text-slate-700">Tempat, Tanggal Lahir</span>
              <span className="col-span-1 text-center">:</span>
              <span className="col-span-7 sm:col-span-8">
                {citizen.tempatLahir}, {formatIndonesianDate(citizen.tanggalLahir)}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-4 sm:col-span-3 text-slate-700">Jenis Kelamin</span>
              <span className="col-span-1 text-center">:</span>
              <span className="col-span-7 sm:col-span-8">{citizen.jenisKelamin}</span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-4 sm:col-span-3 text-slate-700">Kewarganegaraan / Agama</span>
              <span className="col-span-1 text-center">:</span>
              <span className="col-span-7 sm:col-span-8">Indonesia (WNI) / {citizen.agama}</span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-4 sm:col-span-3 text-slate-700">Status Perkawinan</span>
              <span className="col-span-1 text-center">:</span>
              <span className="col-span-7 sm:col-span-8">{citizen.statusPerkawinan}</span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-4 sm:col-span-3 text-slate-700">Pekerjaan</span>
              <span className="col-span-1 text-center">:</span>
              <span className="col-span-7 sm:col-span-8">{citizen.pekerjaan}</span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-4 sm:col-span-3 text-slate-700">Alamat Sesuai KTP</span>
              <span className="col-span-1 text-center">:</span>
              <span className="col-span-7 sm:col-span-8 leading-normal">
                {citizen.alamat}, RT {citizen.rt} / RW {citizen.rw}, {citizen.dusun}, Desa {citizen.desa}, Kec. {citizen.kecamatan}, {citizen.kabupaten}
              </span>
            </div>
          </div>

          {/* LETTER SPECIFIC CONTENT */}
          <div className="my-5 text-justify text-xs sm:text-[13px] leading-relaxed">
            {submission.jenisSurat === 'SKU' && (
              <div className="space-y-3">
                <p className="indent-8">
                  Orang tersebut di atas adalah benar-benar warga penduduk Desa kami yang memiliki dan menjalankan kegiatan usaha sebagaimana keterangan di bawah ini:
                </p>
                <div className="ml-4 sm:ml-8 space-y-1.5 bg-slate-50 p-3 rounded border border-slate-200 text-xs sm:text-[13px]">
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-4 font-semibold text-slate-700">Nama Usaha / Usaha Dagang</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-7 font-bold text-slate-900">{String(submission.detailSurat.namaUsaha || '-')}</span>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-4 text-slate-700">Bidang / Jenis Usaha</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-7">{String(submission.detailSurat.bidangUsaha || '-')}</span>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-4 text-slate-700">Alamat Lokasi Usaha</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-7">{String(submission.detailSurat.alamatUsaha || '-')}</span>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-4 text-slate-700">Beroperasi Sejak Tahun</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-7">{String(submission.detailSurat.tahunBerdiri || '-')}</span>
                  </div>
                </div>
                <p className="indent-8">
                  Surat Keterangan Usaha ini diterbitkan dan diberikan kepada yang bersangkutan atas permohonannya sebagai kelengkapan administrasi untuk keperluan :{' '}
                  <span className="font-semibold">{submission.detailSurat.keperluan || submission.keperluan}</span>.
                </p>
              </div>
            )}

            {submission.jenisSurat === 'SKTM' && (
              <div className="space-y-3">
                <p className="indent-8">
                  Berdasarkan peninjauan lapangan dan data sensus kesejahteraan sosial kependudukan Desa kami, yang bersangkutan benar-benar tergolong dalam keluarga Kurang Mampu / Prasejahtera dengan rata-rata penghasilan per bulan <span className="font-semibold">{String(submission.detailSurat.penghasilanBulanan || 'serabutan')}</span> dan menanggung <span className="font-semibold">{String(submission.detailSurat.jumlahTanggungan || '3')}</span> orang anggota keluarga.
                </p>
                {submission.detailSurat.keteranganKondisi && (
                  <p className="indent-8 italic text-slate-700">
                    Catatan keadaan sosial: "{String(submission.detailSurat.keteranganKondisi)}"
                  </p>
                )}
                <p className="indent-8">
                  Surat Keterangan Tidak Mampu ini dibuat dan diberikan untuk memenuhi kelengkapan administrasi permohonan{' '}
                  <span className="font-bold">{String(submission.detailSurat.kategoriSktm || submission.keperluan)}</span> yang ditujukan kepada <span className="font-semibold">{String(submission.detailSurat.namaInstansiTujuan || 'Instansi Terkait')}</span>.
                </p>
              </div>
            )}

            {submission.jenisSurat === 'DOMISILI' && (
              <div className="space-y-3">
                <p className="indent-8">
                  Menerangkan bahwa nama tersebut di atas adalah benar-benar warga yang berdomisili dan menetap di{' '}
                  <span className="font-bold">{String(submission.detailSurat.alamatDomisili || citizen.alamat)}</span> dengan status kepemilikan tempat tinggal <span className="font-semibold">{String(submission.detailSurat.statusTempatTinggal || 'Milik Sendiri')}</span> ({String(submission.detailSurat.lamaTinggal || 'sejak lahir')}).
                </p>
                <p className="indent-8">
                  Surat Keterangan Domisili ini diberikan atas permintaan yang bersangkutan untuk dipergunakan sebagai kelengkapan :{' '}
                  <span className="font-semibold">{String(submission.detailSurat.keperluan || submission.keperluan)}</span>.
                </p>
              </div>
            )}

            {submission.jenisSurat === 'PENGANTAR' && (
              <div className="space-y-3">
                <p className="indent-8">
                  Menerangkan bahwa nama tersebut di atas adalah benar warga penduduk Desa Sukamaju yang berkelakuan baik, tidak sedang tersangkut perkara kriminal atau proses hukum di kepolisian, dan surat pengantar ini diberikan untuk keperluan :
                </p>
                <div className="ml-4 sm:ml-8 bg-slate-50 p-3 rounded border border-slate-200">
                  <p className="font-bold text-slate-900">{String(submission.detailSurat.jenisPengantar || submission.keperluan)}</p>
                  <p className="text-xs text-slate-600 mt-1">Ditujukan Kepada: {String(submission.detailSurat.instansiTujuan || 'Instansi Berwenang')}</p>
                  <p className="text-xs text-slate-700 mt-1.5 italic">Uraian / Keterangan: {String(submission.detailSurat.keperluan || submission.keperluan)}</p>
                </div>
              </div>
            )}

            {submission.jenisSurat !== 'SKU' &&
              submission.jenisSurat !== 'SKTM' &&
              submission.jenisSurat !== 'DOMISILI' &&
              submission.jenisSurat !== 'PENGANTAR' && (
                <p className="indent-8">
                  Bahwa nama tersebut di atas adalah benar-benar warga penduduk Desa Sukamaju dan surat keterangan ini diberikan atas dasar permohonan yang bersangkutan untuk keperluan :{' '}
                  <span className="font-semibold">{submission.keperluan || 'Administrasi'}</span>.
                </p>
              )}
          </div>

          {/* CLOSING */}
          <div className="text-justify mb-8 text-xs sm:text-[13px]">
            <p className="indent-8">
              Demikian Surat Keterangan ini kami buat dengan sebenarnya, agar dapat dipergunakan sebagaimana mestinya oleh pihak yang berkepentingan.
            </p>
          </div>

          {/* SIGNATURE & STAMP & QR CODE SECTION */}
          <div className="mt-8 pt-4 grid grid-cols-12 gap-4 items-end">
            {/* Left Column: QR Code & Electronic Integrity Box */}
            <div className="col-span-6 flex items-start gap-3">
              <div
                onClick={() => onOpenVerification && onOpenVerification(submission)}
                className="bg-white p-2 rounded border border-slate-300 shadow-xs cursor-pointer group hover:border-blue-500 transition-colors"
                title="Klik untuk membuka verifikasi keabsahan surat"
              >
                <QRCodeSVG
                  value={qrData}
                  size={88}
                  level="M"
                  includeMargin={false}
                  className="rounded"
                />
                <span className="text-[9px] font-sans text-center block text-blue-600 group-hover:underline mt-1 font-semibold">
                  Cek Keabsahan QR
                </span>
              </div>
              <div className="text-[10px] leading-tight text-slate-600 font-sans space-y-1">
                <div className="flex items-center gap-1 font-semibold text-slate-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Sertifikat TTE Sah</span>
                </div>
                <p>Dokumen resmi ini ditandatangani secara elektronik (TTE) sesuai UU ITE.</p>
                <p className="font-mono text-[9px] text-slate-500">
                  ID: {submission.kodeVerifikasi}
                </p>
                <p className="text-slate-500">Scan QR Code dengan kamera ponsel untuk validasi data.</p>
              </div>
            </div>

            {/* Right Column: Signature, Name, and Purple Village Stamp */}
            <div className="col-span-6 text-center relative font-['Tinos',serif]">
              <p className="text-xs sm:text-[13px] text-slate-800">
                Sukamaju, {tglTerbit}
              </p>
              <p className="text-xs sm:text-[13px] font-bold text-slate-900 mt-0.5">
                {village.jabatanPenandatangan.toUpperCase()}
              </p>

              {/* Digital Stamp Simulation (Desa Sukamaju Purple Ink) */}
              <div className="relative h-24 flex items-center justify-center my-1">
                {/* Official Purple Stamp */}
                <div className="absolute left-6 w-24 h-24 rounded-full border-2 border-purple-800/80 flex flex-col items-center justify-center text-purple-900 font-bold select-none pointer-events-none rotate-[-12deg] opacity-85">
                  <div className="w-[86px] h-[86px] rounded-full border border-purple-800/70 flex flex-col items-center justify-center text-center p-1">
                    <span className="text-[6.5px] uppercase tracking-tighter">PEMERINTAH KAB. BANDUNG</span>
                    <span className="text-[8.5px] uppercase tracking-wider my-0.5">★ DESA SUKAMAJU ★</span>
                    <span className="text-[6.5px] uppercase tracking-tighter">KECAMATAN CIWIDEY</span>
                  </div>
                </div>

                {/* Digital Signature Text/Graphic */}
                <div className="z-10 text-center">
                  <span className="text-xs font-serif italic text-blue-900/90 tracking-wide block bg-white/70 px-2 py-0.5 rounded">
                    [Ditandatangani secara elektronik]
                  </span>
                  <span className="text-[9px] font-sans text-slate-500 block">
                    Sertifikat Digital BSrE/BSSN
                  </span>
                </div>
              </div>

              {/* Pejabat Name & NIP */}
              <p className="text-xs sm:text-[14px] font-bold text-slate-950 underline tracking-wide">
                {village.namaKepalaDesa}
              </p>
              {village.nipKepalaDesa && (
                <p className="text-[11px] sm:text-xs text-slate-800 mt-0.5">
                  {village.nipKepalaDesa}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
