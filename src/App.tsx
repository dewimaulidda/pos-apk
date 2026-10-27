/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  Share2,
  Download,
  Printer,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Building,
  Users,
  Search,
  Clock,
  Send,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { Citizen, LetterSubmission, VillageProfile } from './types';
import { INITIAL_CITIZENS, DEFAULT_VILLAGE_PROFILE } from './data/citizens';
import { Navbar } from './components/Navbar';
import { CitizenAutofillInput } from './components/CitizenAutofillInput';
import { SubmissionForm } from './components/SubmissionForm';
import { LetterDocumentPreview } from './components/LetterDocumentPreview';
import { AdminDashboard } from './components/AdminDashboard';
import { WhatsAppNotifyModal } from './components/WhatsAppNotifyModal';
import { VerificationModal } from './components/VerificationModal';
import { AddCitizenModal } from './components/AddCitizenModal';
import { generateLetterNumber } from './data/letterTemplates';

// Initial pre-seeded submissions for instant demonstration
const INITIAL_SUBMISSIONS: LetterSubmission[] = [
  {
    id: 'REG-104821',
    nomorSurat: '503 / 084 / DS-SKU / X / 2026',
    jenisSurat: 'SKU',
    namaSurat: 'SURAT KETERANGAN USAHA',
    nikPemohon: '3204121508890001',
    namaPemohon: 'BAMBANG HERMANTO',
    dataPemohon: INITIAL_CITIZENS[0],
    detailSurat: {
      namaUsaha: 'Warung Berkah Barokah & Grosir Sembako',
      bidangUsaha: 'Perdagangan Sembako & Kelontong',
      alamatUsaha: 'Kp. Sukasari RT 003 / RW 007 Desa Sukamaju',
      tahunBerdiri: '2020',
      keperluan: 'Pengajuan Kredit Usaha Rakyat (KUR) BRI Unit Ciwidey',
    },
    keperluan: 'Pengajuan Kredit Usaha Rakyat (KUR) BRI Unit Ciwidey',
    tanggalPengajuan: '2026-10-26T08:30:00.000Z',
    tanggalDisetujui: '2026-10-26T08:32:15.000Z',
    status: 'SELESAI',
    catatanPetugas: 'Diverifikasi langsung oleh Pelayanan Mandiri Desa.',
    kodeVerifikasi: 'TTE-SKU-9B8F21-4401',
    hashKeabsahan: 'SHA256-8F2B149E08A639B0C7741DE38B4A217E',
    notifikasiWaTerkirim: true,
    tanggalWaTerkirim: '2026-10-26T08:33:00.000Z',
  },
  {
    id: 'REG-104820',
    nomorSurat: '401 / 052 / DS-SKTM / X / 2026',
    jenisSurat: 'SKTM',
    namaSurat: 'SURAT KETERANGAN TIDAK MAMPU',
    nikPemohon: '3204126711990004',
    namaPemohon: 'DEWI ANGGRAENI',
    dataPemohon: INITIAL_CITIZENS[3],
    detailSurat: {
      kategoriSktm: 'Pendidikan (KIP Kuliah / Beasiswa Siswa / Keringanan SPP)',
      namaInstansiTujuan: 'Universitas Pendidikan Indonesia (UPI) Bandung',
      penghasilanBulanan: 'Kurang dari Rp 500.000,- / bulan',
      jumlahTanggungan: '4',
      keteranganKondisi: 'Ayah bekerja sebagai buruh tani serabutan, ibu sakit menahun.',
    },
    keperluan: 'Pendidikan (KIP Kuliah) - Universitas Pendidikan Indonesia (UPI) Bandung',
    tanggalPengajuan: '2026-10-25T14:10:00.000Z',
    tanggalDisetujui: '2026-10-25T14:15:20.000Z',
    status: 'SELESAI',
    catatanPetugas: 'Kategori prasejahtera memenuhi kriteria Permensos.',
    kodeVerifikasi: 'TTE-SKTM-7C129A-3891',
    hashKeabsahan: 'SHA256-1A24C9E89945170B1F45DF045E1B99AA',
    notifikasiWaTerkirim: true,
    tanggalWaTerkirim: '2026-10-25T14:16:00.000Z',
  },
  {
    id: 'REG-104819',
    nomorSurat: '470 / 119 / DS-SKD / X / 2026',
    jenisSurat: 'DOMISILI',
    namaSurat: 'SURAT KETERANGAN DOMISILI',
    nikPemohon: '3204125406930002',
    namaPemohon: 'SITI NURHALIZA PUTRI',
    dataPemohon: INITIAL_CITIZENS[1],
    detailSurat: {
      alamatDomisili: 'Jl. Babakan Cempaka No. 12 RT 001 / RW 004 Dusun Girang Desa Sukamaju',
      statusTempatTinggal: 'Rumah Milik Sendiri',
      lamaTinggal: 'Sejak lahir (Tahun 1993)',
      keperluan: 'Kelengkapan Berkas Lamaran Pekerjaan di BUMN',
    },
    keperluan: 'Kelengkapan Berkas Lamaran Pekerjaan di BUMN',
    tanggalPengajuan: '2026-10-24T10:05:00.000Z',
    tanggalDisetujui: '2026-10-24T10:06:40.000Z',
    status: 'SELESAI',
    catatanPetugas: 'Domisili terverifikasi sesuai Kartu Keluarga.',
    kodeVerifikasi: 'TTE-DOMISILI-5D88E2-2290',
    hashKeabsahan: 'SHA256-7E59D104AA84F769213CEB880312F981',
    notifikasiWaTerkirim: true,
  },
];

export default function App() {
  const [citizens, setCitizens] = useState<Citizen[]>(() => {
    const saved = localStorage.getItem('desa_citizens');
    return saved ? JSON.parse(saved) : INITIAL_CITIZENS;
  });

  const [submissions, setSubmissions] = useState<LetterSubmission[]>(() => {
    const saved = localStorage.getItem('desa_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [village, setVillage] = useState<VillageProfile>(() => {
    const saved = localStorage.getItem('desa_profile');
    return saved ? JSON.parse(saved) : DEFAULT_VILLAGE_PROFILE;
  });

  const [currentView, setCurrentView] = useState<'KIOSK' | 'PREVIEW' | 'ADMIN'>('KIOSK');
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(citizens[1]); // Default to Siti Nurhaliza
  const [currentSubmission, setCurrentSubmission] = useState<LetterSubmission | null>(
    INITIAL_SUBMISSIONS[0]
  );

  // Modals
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isAddCitizenModalOpen, setIsAddCitizenModalOpen] = useState(false);
  const [targetForModal, setTargetForModal] = useState<LetterSubmission | null>(null);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('desa_citizens', JSON.stringify(citizens));
  }, [citizens]);

  useEffect(() => {
    localStorage.setItem('desa_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('desa_profile', JSON.stringify(village));
  }, [village]);

  // Handle successful generation
  const handleSuccessSubmission = (newSub: LetterSubmission) => {
    setSubmissions((prev) => [newSub, ...prev]);
    setCurrentSubmission(newSub);
    setCurrentView('PREVIEW');
  };

  const handleOpenWhatsApp = (sub: LetterSubmission) => {
    setTargetForModal(sub);
    setIsWhatsAppModalOpen(true);
  };

  const handleOpenVerification = (sub?: LetterSubmission) => {
    setTargetForModal(sub || currentSubmission || submissions[0] || null);
    setIsVerificationModalOpen(true);
  };

  const handleMarkWaSent = (submissionId: string) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? { ...s, notifikasiWaTerkirim: true, tanggalWaTerkirim: new Date().toISOString() }
          : s
      )
    );
    if (currentSubmission && currentSubmission.id === submissionId) {
      setCurrentSubmission({
        ...currentSubmission,
        notifikasiWaTerkirim: true,
        tanggalWaTerkirim: new Date().toISOString(),
      });
    }
  };

  const handleAddNewCitizen = (newCitizen: Citizen) => {
    setCitizens((prev) => [newCitizen, ...prev]);
    setSelectedCitizen(newCitizen);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onChangeView={setCurrentView}
        onOpenVerification={() => handleOpenVerification()}
        village={village}
        hasCurrentSubmission={!!currentSubmission}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* VIEW 1: KIOSK (PENGURUSAN SURAT MANDIRI) */}
        {currentView === 'KIOSK' && (
          <div className="space-y-6">
            {/* Hero Banner for Village Self-Service */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Modul Layanan Surat & Administrasi Mandiri</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Pelayanan Surat Keterangan Desa Cepat, TTE Sah & Notifikasi WhatsApp
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Cukup masukkan NIK Anda untuk autofill otomatis nama, tempat/tanggal lahir, dan alamat RT/RW. Pilih surat populer (SKU, SKTM, Domisili, Pengantar), dokumen PDF resmi ber-KOP dan QR Code keabsahan langsung diterbitkan dalam hitungan detik.
                </p>

                {/* 3 Step Indicator */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                  <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/10 text-xs">
                    <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center font-bold text-[11px]">
                      1
                    </span>
                    <span className="font-medium text-slate-200">Input NIK (Autofill)</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/10 text-xs">
                    <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center font-bold text-[11px]">
                      2
                    </span>
                    <span className="font-medium text-slate-200">Pilih Surat Populer</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/10 text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-[11px]">
                      3
                    </span>
                    <span className="font-medium text-slate-200">Cetak PDF & Notif WA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1: Autofill NIK Component */}
            <CitizenAutofillInput
              citizens={citizens}
              selectedCitizen={selectedCitizen}
              onSelectCitizen={setSelectedCitizen}
              onAddNewCitizenModal={() => setIsAddCitizenModalOpen(true)}
              onUpdatePhone={(phone) => {
                if (selectedCitizen) {
                  setSelectedCitizen({ ...selectedCitizen, noHp: phone });
                }
              }}
            />

            {/* Steps 2, 3, & 4: Letter Selection, Dynamic Fields, and Instant Generator */}
            <SubmissionForm
              citizens={citizens}
              selectedCitizen={selectedCitizen}
              village={village}
              totalSubmissionsCount={submissions.length}
              onSuccessSubmission={handleSuccessSubmission}
            />
          </div>
        )}

        {/* VIEW 2: PREVIEW DOKUMEN RESMI A4 & PDF */}
        {currentView === 'PREVIEW' && currentSubmission && (
          <div className="space-y-6">
            {/* Top Navigation Back */}
            <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <button
                onClick={() => setCurrentView('KIOSK')}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Pengajuan Surat Baru
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenWhatsApp(currentSubmission)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  Kirim Notifikasi WhatsApp ke Pemohon
                </button>
              </div>
            </div>

            {/* Document Success Banner */}
            <div className="no-print bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Surat Keterangan Berhasil Diterbitkan & Ditandatangani!
                  </h3>
                  <p className="text-xs text-slate-600">
                    Dokumen ini sah dan memiliki QR Code verifikasi. Kirimkan notifikasi WhatsApp kepada warga agar mereka segera mengetahui dokumen telah siap.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenWhatsApp(currentSubmission)}
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Kirim Notifikasi WhatsApp
                </button>
              </div>
            </div>

            {/* A4 Document Visual Component */}
            <LetterDocumentPreview
              submission={currentSubmission}
              village={village}
              onOpenVerification={handleOpenVerification}
              onOpenWhatsApp={handleOpenWhatsApp}
            />
          </div>
        )}

        {/* VIEW 3: ADMIN DASHBOARD */}
        {currentView === 'ADMIN' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Panel Petugas Pelayanan Desa
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Kelola dokumen surat keluar, verifikasi arsip, dan monitoring notifikasi WhatsApp warga
                </p>
              </div>

              <button
                onClick={() => setCurrentView('KIOSK')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Form Warga
              </button>
            </div>

            <AdminDashboard
              submissions={submissions}
              citizens={citizens}
              village={village}
              onUpdateVillage={setVillage}
              onViewDocument={(sub) => {
                setCurrentSubmission(sub);
                setCurrentView('PREVIEW');
              }}
              onOpenWhatsApp={handleOpenWhatsApp}
              onOpenVerification={handleOpenVerification}
              onAddNewCitizenModal={() => setIsAddCitizenModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            &copy; {new Date().getFullYear()} {village.namaDesa}. Pelayanan Surat & Administrasi Mandiri Desa.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleOpenVerification()}
              className="hover:text-blue-600 cursor-pointer font-medium"
            >
              Cek Keabsahan QR Code
            </button>
            <span>&bull;</span>
            <span className="font-mono text-[11px] text-slate-400">
              Format Permendagri & TTE Resmi
            </span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* WhatsApp Modal */}
      {targetForModal && (
        <WhatsAppNotifyModal
          submission={targetForModal}
          village={village}
          isOpen={isWhatsAppModalOpen}
          onClose={() => setIsWhatsAppModalOpen(false)}
          onMarkSent={handleMarkWaSent}
        />
      )}

      {/* Verification Modal */}
      <VerificationModal
        submission={targetForModal}
        allSubmissions={submissions}
        village={village}
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onSelectSubmission={(sub) => {
          setCurrentSubmission(sub);
          setCurrentView('PREVIEW');
          setIsVerificationModalOpen(false);
        }}
      />

      {/* Add New Citizen Modal */}
      <AddCitizenModal
        isOpen={isAddCitizenModalOpen}
        onClose={() => setIsAddCitizenModalOpen(false)}
        onAddCitizen={handleAddNewCitizen}
      />
    </div>
  );
}
