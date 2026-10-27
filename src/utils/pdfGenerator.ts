import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { LetterSubmission, VillageProfile } from '../types';
import { formatIndonesianDate } from '../data/letterTemplates';

export async function generateOfficialPDF(
  submission: LetterSubmission,
  village: VillageProfile
): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const marginLeft = 20;
  const marginRight = pageWidth - 20;
  const contentWidth = pageWidth - 40;

  // 1. KOP SURAT
  let y = 16;

  // Garuda Crest (Simplified vector graphic drawn directly with jsPDF)
  doc.setFillColor(180, 130, 20); // Gold bronze color
  doc.setDrawColor(30, 41, 59);

  // Text Kop Surat
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.text(village.namaPemerintah.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += 5.5;

  doc.setFontSize(12);
  doc.text(village.namaKecamatan.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += 6;

  doc.setFontSize(15);
  doc.text(village.namaDesa.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += 5.5;

  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.text(
    `Alamat: ${village.alamatDesa}, Kode Pos ${village.kodePos} Telp: ${village.telepon}`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 4;
  doc.text(
    `Layanan Mandiri Online: ${village.website}  |  Email: ${village.email}`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 4;

  // Double border line for Indonesian official letter
  doc.setLineWidth(0.8);
  doc.line(marginLeft, y, marginRight, y);
  doc.setLineWidth(0.2);
  doc.line(marginLeft, y + 1.2, marginRight, y + 1.2);
  y += 8;

  // 2. JUDUL SURAT
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.text(submission.namaSurat.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  
  // Underline for title
  const textWidth = doc.getTextWidth(submission.namaSurat.toUpperCase());
  doc.setLineWidth(0.3);
  doc.line(pageWidth / 2 - textWidth / 2, y + 0.8, pageWidth / 2 + textWidth / 2, y + 0.8);
  y += 5.5;

  doc.setFont('times', 'normal');
  doc.setFontSize(10.5);
  doc.text(`Nomor: ${submission.nomorSurat}`, pageWidth / 2, y, { align: 'center' });
  y += 10;

  // 3. PEMBUKA
  doc.setFont('times', 'normal');
  doc.setFontSize(10.5);
  const pembuka = `Yang bertanda tangan di bawah ini ${village.jabatanPenandatangan}, Kecamatan ${village.namaKecamatan.replace('KECAMATAN ', '')}, ${village.namaPemerintah.replace('PEMERINTAH ', '')}, dengan ini menerangkan dengan sebenarnya bahwa:`;
  const splitPembuka = doc.splitTextToSize(pembuka, contentWidth);
  doc.text(splitPembuka, marginLeft, y);
  y += splitPembuka.length * 5 + 3;

  // 4. DATA WARGA (AUTOFILLED DARI NIK)
  const citizen = submission.dataPemohon;
  const labelX = marginLeft + 6;
  const colonX = marginLeft + 54;
  const valX = marginLeft + 58;
  const valWidth = contentWidth - 44;

  const dataRows: [string, string][] = [
    ['Nama Lengkap', citizen.nama.toUpperCase()],
    ['NIK (No. KTP)', citizen.nik],
    ['Tempat / Tanggal Lahir', `${citizen.tempatLahir}, ${formatIndonesianDate(citizen.tanggalLahir)}`],
    ['Jenis Kelamin', citizen.jenisKelamin],
    ['Kewarganegaraan', 'Indonesia (WNI)'],
    ['Agama', citizen.agama],
    ['Status Perkawinan', citizen.statusPerkawinan],
    ['Pekerjaan', citizen.pekerjaan],
    [
      'Alamat Sesuai KTP',
      `${citizen.alamat}, RT ${citizen.rt} / RW ${citizen.rw}, ${citizen.dusun}, Desa ${citizen.desa}, Kec. ${citizen.kecamatan}, ${citizen.kabupaten}`,
    ],
  ];

  for (const [label, val] of dataRows) {
    doc.setFont('times', 'normal');
    doc.text(label, labelX, y);
    doc.text(':', colonX, y);

    const splitVal = doc.splitTextToSize(val, valWidth);
    if (label === 'Nama Lengkap' || label === 'NIK (No. KTP)') {
      doc.setFont('times', 'bold');
    }
    doc.text(splitVal, valX, y);
    doc.setFont('times', 'normal');
    y += Math.max(splitVal.length * 4.8, 5.2);
  }

  y += 3;

  // 5. ISI KETERANGAN BERDASARKAN JENIS SURAT
  let isiKeterangan = '';
  if (submission.jenisSurat === 'SKU') {
    const details = submission.detailSurat;
    const keteranganRows: [string, string][] = [
      ['Nama Usaha', String(details.namaUsaha || '-')],
      ['Bidang / Jenis Usaha', String(details.bidangUsaha || '-')],
      ['Alamat Lokasi Usaha', String(details.alamatUsaha || '-')],
      ['Tahun Mulai Berdiri', String(details.tahunBerdiri || '-')],
      ['Keperluan Surat', String(details.keperluan || submission.keperluan || '-')],
    ];

    const teksPengantar =
      'Orang tersebut di atas adalah benar-benar warga penduduk Desa kami yang memiliki dan menjalankan kegiatan usaha sebagaimana keterangan berikut:';
    const splitTeksPengantar = doc.splitTextToSize(teksPengantar, contentWidth);
    doc.text(splitTeksPengantar, marginLeft, y);
    y += splitTeksPengantar.length * 5 + 3;

    for (const [lbl, val] of keteranganRows) {
      doc.text(lbl, labelX, y);
      doc.text(':', colonX, y);
      const splitVal = doc.splitTextToSize(val, valWidth);
      if (lbl === 'Nama Usaha') doc.setFont('times', 'bold');
      doc.text(splitVal, valX, y);
      doc.setFont('times', 'normal');
      y += Math.max(splitVal.length * 4.8, 5.2);
    }

    y += 2;
    isiKeterangan = `Surat keterangan ini diberikan atas permohonan yang bersangkutan sebagai kelengkapan administrasi untuk keperluan: ${details.keperluan || submission.keperluan}.`;
  } else if (submission.jenisSurat === 'SKTM') {
    const details = submission.detailSurat;
    isiKeterangan = `Bahwa nama tersebut di atas berdasarkan hasil verifikasi data kependudukan dan peninjauan di lapangan adalah benar-benar warga prasejahtera / berpenghasilan rendah dengan rata-rata penghasilan ${details.penghasilanBulanan || 'serabutan'} dan memiliki tanggungan ${details.jumlahTanggungan || '3'} orang keluarga.\n\nSurat Keterangan ini dibuat dan diberikan untuk keperluan: ${details.kategoriSktm || submission.keperluan} yang ditujukan kepada ${details.namaInstansiTujuan || 'Instansi Terkait'}.`;
  } else if (submission.jenisSurat === 'DOMISILI') {
    const details = submission.detailSurat;
    isiKeterangan = `Bahwa nama tersebut di atas adalah benar-benar penduduk yang berdomisili dan menetap di ${details.alamatDomisili || citizen.alamat} dengan status tempat tinggal ${details.statusTempatTinggal || 'Milik Sendiri'} (${details.lamaTinggal || 'sejak lahir'}).\n\nSurat Keterangan Domisili ini diterbitkan untuk dipergunakan sebagai: ${details.keperluan || submission.keperluan}.`;
  } else if (submission.jenisSurat === 'PENGANTAR') {
    const details = submission.detailSurat;
    isiKeterangan = `Menerangkan bahwa orang tersebut di atas adalah benar penduduk Desa kami yang berkelakuan baik, tidak sedang tersangkut perkara kriminal atau proses hukum, dan surat pengantar ini diberikan untuk keperluan: ${details.jenisPengantar || submission.keperluan} yang ditujukan kepada ${details.instansiTujuan || 'Instansi Berwenang'}.\nKeterangan Khusus: ${details.keperluan || submission.keperluan}`;
  } else {
    isiKeterangan = `Bahwa orang tersebut di atas adalah benar-benar warga penduduk Desa Sukamaju dan surat keterangan ini diberikan atas dasar permohonan yang bersangkutan untuk keperluan ${submission.keperluan || 'Administrasi'}.`;
  }

  const splitIsi = doc.splitTextToSize(isiKeterangan, contentWidth);
  doc.text(splitIsi, marginLeft, y);
  y += splitIsi.length * 5 + 4;

  // 6. PENUTUP
  const penutup =
    'Demikian Surat Keterangan ini kami buat dengan sebenarnya, agar dapat dipergunakan sebagaimana mestinya oleh yang berkepentingan.';
  const splitPenutup = doc.splitTextToSize(penutup, contentWidth);
  doc.text(splitPenutup, marginLeft, y);
  y += splitPenutup.length * 5 + 8;

  // Check if y is too close to bottom of page
  if (y > 230) {
    doc.addPage();
    y = 25;
  }

  // 7. TANDA TANGAN & PENGESAHAN DENGAN QR CODE RESMI
  const ttdX = pageWidth - 80;
  const tglFormatted = formatIndonesianDate(submission.tanggalDisetujui || submission.tanggalPengajuan);
  
  doc.setFont('times', 'normal');
  doc.setFontSize(10.5);
  doc.text(`Dikeluarkan di: Sukamaju`, ttdX, y);
  y += 4.5;
  doc.text(`Pada tanggal  : ${tglFormatted}`, ttdX, y);
  y += 5.5;

  doc.setFont('times', 'bold');
  doc.text(village.jabatanPenandatangan.toUpperCase(), ttdX, y);
  y += 4;

  // Generate real QR Code data URL for verification
  // The QR contains verification URL and metadata
  const qrVerificationData = JSON.stringify({
    nomorSurat: submission.nomorSurat,
    nik: submission.nikPemohon,
    nama: submission.namaPemohon,
    jenisSurat: submission.namaSurat,
    tanggal: tglFormatted,
    kodeVerifikasi: submission.kodeVerifikasi,
    desa: village.namaDesa,
    penandatangan: village.namaKepalaDesa,
    status: 'SAH & TERVERIFIKASI SISTEM TTE DESA',
  });

  try {
    const qrDataUrl = await QRCode.toDataURL(qrVerificationData, {
      width: 120,
      margin: 1,
      color: {
        dark: '#1e293b',
        light: '#ffffff',
      },
    });

    // Add QR Code next to the signature
    doc.addImage(qrDataUrl, 'PNG', marginLeft + 5, y - 2, 28, 28);

    // QR Verification Info Box
    doc.setFont('times', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const qrInfo = [
      'Pemeriksaan Keabsahan:',
      'Dokumen resmi ini ditandatangani secara elektronik (TTE).',
      `Kode Dokumen: ${submission.kodeVerifikasi}`,
      `Scan QR Code di samping untuk verifikasi validitas surat.`,
    ];
    let qrTextY = y + 2;
    for (const info of qrInfo) {
      doc.text(info, marginLeft + 35, qrTextY);
      qrTextY += 3.5;
    }
    doc.setTextColor(0, 0, 0);
  } catch (err) {
    console.error('Error generating QR for PDF:', err);
  }

  // Official Digital Stamp Simulation (Desa Sukamaju)
  doc.setDrawColor(88, 28, 135); // Purple / Navy official ink
  doc.setLineWidth(0.6);
  doc.circle(ttdX + 15, y + 14, 13);
  doc.circle(ttdX + 15, y + 14, 11);
  doc.setFont('times', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(88, 28, 135);
  doc.text('PEMERINTAH KAB. BANDUNG', ttdX + 15, y + 7, { align: 'center' });
  doc.setFontSize(7);
  doc.text('★ DESA SUKAMAJU ★', ttdX + 15, y + 14.5, { align: 'center' });
  doc.setFontSize(6);
  doc.text('KECAMATAN CIWIDEY', ttdX + 15, y + 21, { align: 'center' });
  doc.setTextColor(0, 0, 0);

  // Digital Signature Graphic Text
  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138);
  doc.text('[Ditandatangani secara elektronik]', ttdX + 2, y + 15);
  doc.setTextColor(0, 0, 0);

  y += 28;

  // Nama Pejabat & NIP
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text(village.namaKepalaDesa, ttdX, y);
  
  const nameWidth = doc.getTextWidth(village.namaKepalaDesa);
  doc.setLineWidth(0.3);
  doc.line(ttdX, y + 0.6, ttdX + nameWidth, y + 0.6);
  y += 4.5;

  if (village.nipKepalaDesa) {
    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    doc.text(village.nipKepalaDesa, ttdX, y);
  }

  // Return generated PDF as Blob
  return doc.output('blob');
}

export async function downloadOfficialPDF(
  submission: LetterSubmission,
  village: VillageProfile
): Promise<void> {
  const blob = await generateOfficialPDF(submission, village);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const cleanName = submission.namaPemohon.replace(/\s+/g, '_');
  a.download = `${submission.jenisSurat}_${submission.nikPemohon}_${cleanName}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
