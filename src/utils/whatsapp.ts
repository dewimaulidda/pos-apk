import { LetterSubmission, VillageProfile } from '../types';
import { formatIndonesianDate } from '../data/letterTemplates';

export function sanitizePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

export function generateWhatsAppMessage(
  submission: LetterSubmission,
  village: VillageProfile,
  type: 'COMPLETED' | 'SUBMITTED' = 'COMPLETED'
): string {
  const tglPengajuan = formatIndonesianDate(submission.tanggalPengajuan);
  const tglSelesai = formatIndonesianDate(submission.tanggalDisetujui || new Date().toISOString());
  
  if (type === 'SUBMITTED') {
    return `*LAYANAN MANDIRI ${village.namaDesa}*
Yth. Bpk/Ibu *${submission.namaPemohon}*
(NIK: ${submission.nikPemohon})

Pengajuan surat Anda telah kami terima di sistem pelayanan mandiri desa:
📄 *Jenis Surat:* ${submission.namaSurat}
🔢 *Nomor Resi:* #${submission.id}
📅 *Waktu:* ${tglPengajuan}
⏳ *Status:* Sedang Ditinjau / Diproses

Dokumen sedang diverifikasi oleh staf pelayanan. Anda akan menerima pesan notifikasi WhatsApp kembali setelah surat resmi ditandatangani dan siap diunduh.

Terima kasih atas partisipasi Anda menggunakan Layanan Digital Desa Sukamaju.
_Kantor Desa: ${village.alamatDesa} | Telp: ${village.telepon}_`;
  }

  return `*PEMBERITAHUAN SURAT RESMI SELESAI*
🏛️ *${village.namaDesa}*
Kecamatan ${village.namaKecamatan.replace('KECAMATAN ', '')} - ${village.namaPemerintah.replace('PEMERINTAH ', '')}

Yth. Bpk/Ibu *${submission.namaPemohon}*
(NIK: ${submission.nikPemohon})

Alhamdulillah, surat permohonan administrasi Anda telah *SELESAI DIPROSES* dan telah ditandatangani secara elektronik (TTE) resmi oleh ${village.jabatanPenandatangan}.

📋 *RINCIAN DOKUMEN:*
• *Jenis Surat:* ${submission.namaSurat}
• *Nomor Surat:* ${submission.nomorSurat}
• *Tanggal Terbit:* ${tglSelesai}
• *Keperluan:* ${submission.keperluan || 'Administrasi'}
• *Kode Verifikasi:* ${submission.kodeVerifikasi}

📱 *KEABSAHAN DOKUMEN:*
Surat ini dilengkapi dengan *QR Code Verifikasi Resmi* dan Tanda Tangan Elektronik yang sah sesuai perundang-undangan. Keaslian surat dapat dicek secara langsung melalui portal resmi desa.

💾 *DOKUMEN PDF:*
Dokumen PDF resmi ber-KOP dan QR Code keabsahan dapat langsung diunduh melalui portal Mandiri Desa atau diambil cetakannya di loket pelayanan kantor desa.

_Pesan ini dikirimkan secara otomatis oleh Sistem Layanan Surat & Administrasi Mandiri ${village.namaDesa}._`;
}

export function createWhatsAppWebLink(
  phone: string,
  message: string
): string {
  const sanitized = sanitizePhoneNumber(phone);
  return `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;
}
