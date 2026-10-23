/**
 * ============================================================
 * 
 *
 * Fitur / konsep utama:
 * 1. Memilih anggota koperasi yang berstatus ACTIVE.
 * 2. Menginput nominal pokok pinjaman.
 * 3. Memilih tenor pinjaman dalam bulan.
 * 4. Menentukan persentase jasa sederhana.
 * 5. Memvalidasi data sebelum disimpan.
 * 6. Mengirim data pinjaman melalui REST API.
 * 7. Memperbarui daftar pinjaman setelah berhasil.
 * 8. Menampilkan sisa pinjaman dan status.
 * 9. Menangani pesan keberhasilan dan kegagalan.
 *
 * Alur program:
 * Pilih Anggota → Input Pokok → Pilih Tenor
 * → Pilih Jasa → Validasi → REST API
 * → Google Sheets → Reload → Daftar Pinjaman
 * ============================================================
 */

// ============================================================
// 1. IMPORT LIBRARY DAN KOMPONEN
// ============================================================

// React dan Hook untuk mengelola state.
import React, { useState } from 'react';

// Komponen antarmuka React Native.
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Library ikon.
import { Ionicons } from '@expo/vector-icons';

// Layanan komunikasi REST API.
import { api } from '../api/api';

// Komponen pemilih anggota aktif.
import MemberPicker from '../components/MemberPicker';

// Komponen dropdown reusable.
import Dropdown from '../components/Dropdown';

// Komponen antarmuka yang digunakan bersama.
import {
  Badge,
  Btn,
  Card,
  EmptyState,
  Field,
  InfoNote,
  SectionTitle,
} from '../components/UI';

// Definisi tipe data TypeScript.
import {
  Loan,
  Member,
} from '../types';

// Fungsi format mata uang dan tanggal.
import {
  rupiah,
  today,
} from '../utils/format';

// ============================================================
// 2. DEFINISI PROPS
// ============================================================

/**
 * Props merupakan data dan fungsi yang diterima
 * LoansScreen dari komponen induk.
 *
 * members : Daftar anggota koperasi.
 * loans   : Daftar pinjaman anggota.
 * reload  : Memuat ulang data setelah transaksi.
 */
type LoansScreenProps = {
  members: Member[];
  loans: Loan[];
  reload: () => Promise<void> | void;
};

// ============================================================
// 3. KOMPONEN UTAMA LOANS SCREEN
// ============================================================

export default function LoansScreen({
  members,
  loans,
  reload,
}: LoansScreenProps) {

  // ----------------------------------------------------------
  // 3.1 STATE FORM PINJAMAN
  // ----------------------------------------------------------

  /**
   * member:
   * Menyimpan member_id anggota yang dipilih.
   */
  const [member, setMember] = useState('');

  /**
   * principal:
   * Menyimpan nominal pokok pinjaman.
   *
   * Nilai disimpan sebagai string karena berasal
   * dari komponen TextInput.
   */
  const [principal, setPrincipal] = useState('');

  /**
   * tenor:
   * Menyimpan jangka waktu pinjaman dalam bulan.
   *
   * Nilai awal adalah 6 bulan.
   */
  const [tenor, setTenor] = useState('6');

  /**
   * rate:
   * Menyimpan persentase jasa sederhana.
   *
   * Nilai awal adalah 1%.
   */
  const [rate, setRate] = useState('1');

  /**
   * busy:
   * Menandai proses penyimpanan pinjaman.
   *
   * true  = Proses penyimpanan berlangsung.
   * false = Tidak sedang menyimpan.
   */
  const [busy, setBusy] = useState(false);

  // ==========================================================
  // 4. FUNGSI MENYIMPAN PINJAMAN
  // ==========================================================

  /**
   * Fungsi save() dijalankan ketika pengguna
   * menekan tombol Simpan Pinjaman.
   *
   * Tahapan:
   * 1. Memeriksa kelengkapan data pinjaman.
   * 2. Mengaktifkan indikator proses.
   * 3. Mengirim data melalui REST API.
   * 4. Mengosongkan input pokok pinjaman.
   * 5. Memuat ulang data aplikasi.
   * 6. Menampilkan pesan berhasil.
   * 7. Menangani error apabila proses gagal.
   */
  const save = async () => {

    // --------------------------------------------------------
    // 4.1 VALIDASI DATA PINJAMAN
    // --------------------------------------------------------

    /**
     * Data pinjaman tidak boleh disimpan jika:
     * - Anggota belum dipilih.
     * - Pokok pinjaman bernilai nol atau negatif.
     * - Tenor pinjaman bernilai nol atau negatif.
     *
     * Jika tidak valid, tampilkan Alert
     * dan hentikan proses penyimpanan.
     */
    if (
      !member ||
      Number(principal) <= 0 ||
      Number(tenor) <= 0
    ) {
      return Alert.alert(
        'Validasi',
        'Data pinjaman belum lengkap.'
      );
    }

    // --------------------------------------------------------
    // 4.2 PROSES PENYIMPANAN PINJAMAN
    // --------------------------------------------------------

    try {

      /**
       * Mengaktifkan status busy agar tombol
       * Simpan Pinjaman tidak dapat ditekan
       * berulang selama request berlangsung.
       */
      setBusy(true);

      // ------------------------------------------------------
      // 4.3 MENGIRIM DATA KE REST API
      // ------------------------------------------------------

      /**
       * Memanggil endpoint pembuatan pinjaman.
       *
       * Data yang dikirim:
       * member_id    : ID anggota.
       * date         : Tanggal pinjaman.
       * principal    : Pokok pinjaman.
       * tenor_months : Lama pinjaman dalam bulan.
       * service_rate : Persentase jasa sederhana.
       * note         : Keterangan pinjaman.
       *
       * Google Apps Script memproses data dan
       * menyimpannya ke Google Sheets.
       *
       * Aturan satu pinjaman aktif per anggota
       * diterapkan pada sisi server.
       */
      await api.createLoan({
        member_id: member,
        date: today(),
        principal: Number(principal),
        tenor_months: Number(tenor),
        service_rate: Number(rate),
        note: 'Pinjaman koperasi sederhana',
      });

      // ------------------------------------------------------
      // 4.4 MENGOSONGKAN INPUT POKOK PINJAMAN
      // ------------------------------------------------------

      /**
       * Setelah REST API berhasil, input pokok
       * pinjaman dikosongkan.
       *
       * Pilihan anggota, tenor, dan jasa tetap
       * dipertahankan sesuai program awal.
       */
      setPrincipal('');

      // ------------------------------------------------------
      // 4.5 MEMPERBARUI DATA APLIKASI
      // ------------------------------------------------------

      /**
       * Memuat ulang data pinjaman sehingga
       * daftar peminjam menampilkan data terbaru.
       */
      await reload();

      // ------------------------------------------------------
      // 4.6 MENAMPILKAN PESAN BERHASIL
      // ------------------------------------------------------

      Alert.alert(
        'Berhasil',
        'Pinjaman dibuat.'
      );

    } catch (e: any) {

      // ------------------------------------------------------
      // 4.7 MENANGANI KESALAHAN
      // ------------------------------------------------------

      /**
       * Menampilkan pesan kesalahan jika:
       * - Koneksi REST API bermasalah.
       * - Server menolak pembuatan pinjaman.
       * - Terjadi kesalahan proses lainnya.
       */
      Alert.alert(
        'Gagal',
        e.message
      );

    } finally {

      // ------------------------------------------------------
      // 4.8 MENGAKHIRI STATUS PROSES
      // ------------------------------------------------------

      /**
       * Mengembalikan busy menjadi false
       * setelah proses selesai atau gagal.
       */
      setBusy(false);
    }
  };

  // ==========================================================
  // 5. TAMPILAN HALAMAN PINJAMAN
  // ==========================================================

  return (
    <>

      {/* -----------------------------------------------------
          5.1 HEADER HALAMAN
          ----------------------------------------------------- */}

      <View style={s.hero}>

        <Ionicons
          name="cash"
          size={32}
          color="#fff"
        />

        <View>
          <Text style={s.title}>
            Pengajuan Pinjaman
          </Text>

          <Text style={s.sub}>
            Pinjaman sederhana tanpa integrasi perbankan.
          </Text>
        </View>

      </View>

      {/* -----------------------------------------------------
          5.2 CARD FORM PINJAMAN BARU
          ----------------------------------------------------- */}

      <Card>

        <SectionTitle>
          Pinjaman Baru
        </SectionTitle>

        <View style={{ gap: 13 }}>

          {/* -------------------------------------------------
              5.3 PEMILIHAN ANGGOTA
              ------------------------------------------------- */}

          {/*
            MemberPicker hanya menampilkan anggota
            koperasi yang memiliki status ACTIVE.

            member_id yang dipilih disimpan
            melalui fungsi setMember().
          */}

          <MemberPicker
            members={members}
            value={member}
            onChange={setMember}
          />

          {/* -------------------------------------------------
              5.4 INPUT POKOK PINJAMAN
              ------------------------------------------------- */}

          {/*
            Field menerima nominal pokok pinjaman.
            keyboardType numeric menampilkan
            keyboard angka pada perangkat.
          */}

          <Field
            label="Pokok pinjaman *"
            value={principal}
            onChangeText={setPrincipal}
            keyboardType="numeric"
            placeholder="Contoh: 2000000"
          />

          {/* -------------------------------------------------
              5.5 DROPDOWN TENOR PINJAMAN
              ------------------------------------------------- */}

          {/*
            Pengguna dapat memilih tenor:
            3, 6, 9, atau 12 bulan.

            Nilai yang dipilih disimpan
            ke dalam state tenor.
          */}

          <Dropdown
            label="Tenor pinjaman *"
            value={tenor}
            onChange={setTenor}
            options={
              ['3', '6', '9', '12'].map(x => ({
                value: x,
                label: `${x} bulan`,
              }))
            }
          />

          {/* -------------------------------------------------
              5.6 DROPDOWN JASA SEDERHANA
              ------------------------------------------------- */}

          {/*
            Pengguna memilih persentase jasa:
            0%, 1%, 2%, atau 3% dari pokok.

            Perhitungan pinjaman dilakukan
            berdasarkan aturan bisnis server.
          */}

          <Dropdown
            label="Jasa sederhana"
            value={rate}
            onChange={setRate}
            options={
              ['0', '1', '2', '3'].map(x => ({
                value: x,
                label: `${x}% dari pokok`,
              }))
            }
          />

          {/* -------------------------------------------------
              5.7 TOMBOL SIMPAN PINJAMAN
              ------------------------------------------------- */}

          {/*
            Tombol menjalankan fungsi save().

            Ketika busy = true:
            - Teks tombol berubah.
            - Tombol dinonaktifkan.
          */}

          <Btn
            title={
              busy
                ? 'Menyimpan pinjaman...'
                : 'Simpan Pinjaman'
            }
            icon="save"
            disabled={busy}
            onPress={save}
          />

          {/* -------------------------------------------------
              5.8 INFORMASI ATURAN PINJAMAN
              ------------------------------------------------- */}

          <InfoNote>
            Satu anggota hanya dapat memiliki satu
            pinjaman aktif. Jasa dihitung sederhana
            dari pokok pinjaman.
          </InfoNote>

        </View>

      </Card>

      {/* -----------------------------------------------------
          5.9 JUDUL DAFTAR PEMINJAM
          ----------------------------------------------------- */}

      <SectionTitle>
        Daftar Peminjam
      </SectionTitle>

      {/* -----------------------------------------------------
          5.10 KONDISI DAFTAR PINJAMAN
          ----------------------------------------------------- */}

      {/*
        Jika belum ada pinjaman:
        Tampilkan komponen EmptyState.

        Jika tersedia:
        Tampilkan daftar pinjaman menggunakan map().

        slice().reverse() digunakan untuk
        menampilkan data dari urutan terakhir.
      */}

      {loans.length === 0 ? (

        <EmptyState />

      ) : (

        loans.slice().reverse().map(l => (

          // --------------------------------------------------
          // 5.11 CARD DATA PINJAMAN
          // --------------------------------------------------

          <Card key={l.loan_id}>

            {/* ID pinjaman dan nama anggota */}

            <Text style={s.loan}>
              {l.loan_id} • {
                members.find(
                  m => m.member_id === l.member_id
                )?.name || l.member_id
              }
            </Text>

            {/* Pokok pinjaman dan tenor */}

            <Text style={s.meta}>
              Pokok {rupiah(l.principal)} •
              Tenor {l.tenor_months} bulan
            </Text>

            {/* Sisa pinjaman */}

            <Text style={s.remaining}>
              Sisa {rupiah(l.remaining_amount)}
            </Text>

            {/* Status pinjaman: ACTIVE atau PAID */}

            <Badge>
              {l.status}
            </Badge>

          </Card>

        ))

      )}

    </>
  );
}

// ============================================================
// 6. STYLESHEET
// ============================================================

/**
 * StyleSheet mengatur tampilan halaman pinjaman.
 *
 * Warna utama:
 * Ungu (#7f56d9) untuk header.
 *
 * Komponen desain:
 * hero      : Header halaman.
 * title     : Judul halaman.
 * sub       : Deskripsi header.
 * loan      : Identitas pinjaman.
 * meta      : Informasi pokok dan tenor.
 * remaining : Sisa pinjaman.
 */
const s = StyleSheet.create({

  // ----------------------------------------------------------
  // 6.1 HEADER HALAMAN
  // ----------------------------------------------------------

  hero: {
    backgroundColor: '#7f56d9',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },

  // ----------------------------------------------------------
  // 6.2 JUDUL HALAMAN
  // ----------------------------------------------------------

  title: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '900',
  },

  // ----------------------------------------------------------
  // 6.3 DESKRIPSI HEADER
  // ----------------------------------------------------------

  sub: {
    color: '#eee5ff',
    marginTop: 3,
  },

  // ----------------------------------------------------------
  // 6.4 IDENTITAS PINJAMAN
  // ----------------------------------------------------------

  loan: {
    fontWeight: '900',
    fontSize: 16,
    color: '#1d2939',
  },

  // ----------------------------------------------------------
  // 6.5 INFORMASI POKOK DAN TENOR
  // ----------------------------------------------------------

  meta: {
    color: '#667085',
    marginTop: 5,
  },

  // ----------------------------------------------------------
  // 6.6 SISA PINJAMAN
  // ----------------------------------------------------------

  remaining: {
    fontWeight: '800',
    marginTop: 7,
    color: '#6941c6',
  },

});
