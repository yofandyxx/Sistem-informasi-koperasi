/**
 * ============================================================
 * 
 * Fitur / konsep utama:
 * 1. Menampilkan daftar pinjaman aktif.
 * 2. Memilih pinjaman yang akan dibayar.
 * 3. Menampilkan sisa tagihan pinjaman.
 * 4. Memvalidasi nominal pembayaran angsuran.
 * 5. Mengirim pembayaran ke Google Apps Script.
 * 6. Memperbarui data setelah transaksi berhasil.
 * 7. Menampilkan pesan keberhasilan atau kegagalan.
 * 8. Mengarahkan pengguna ke riwayat transaksi.
 *
 * Alur program:
 * Pilih Pinjaman → Input Nominal → Validasi
 * → REST API → Google Sheets → Reload
 * → Riwayat Transaksi
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

// Komponen dropdown pemilihan pinjaman.
import Dropdown from '../components/Dropdown';

// Komponen UI yang digunakan bersama.
import {
  Btn,
  Card,
  Field,
  InfoNote,
} from '../components/UI';

// Definisi tipe data TypeScript.
import {
  Loan,
  Member,
  ScreenName,
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
 * InstallmentScreen dari komponen induk.
 *
 * members  : Daftar anggota koperasi.
 * loans    : Daftar pinjaman anggota.
 * reload   : Memuat ulang data setelah transaksi.
 * navigate : Berpindah ke halaman aplikasi.
 */
type InstallmentScreenProps = {
  members: Member[];
  loans: Loan[];
  reload: () => Promise<void> | void;
  navigate: (s: ScreenName) => void;
};

// ============================================================
// 3. KOMPONEN UTAMA INSTALLMENT SCREEN
// ============================================================

export default function InstallmentScreen({
  members,
  loans,
  reload,
  navigate,
}: InstallmentScreenProps) {

  // ----------------------------------------------------------
  // 3.1 STATE FORM PEMBAYARAN
  // ----------------------------------------------------------

  /**
   * loanId:
   * Menyimpan ID pinjaman yang dipilih pengguna.
   */
  const [loanId, setLoanId] = useState('');

  /**
   * amount:
   * Menyimpan nominal pembayaran angsuran.
   */
  const [amount, setAmount] = useState('');

  /**
   * busy:
   * Menandai proses penyimpanan sedang berlangsung.
   *
   * true  = Proses pembayaran berlangsung.
   * false = Tidak sedang memproses pembayaran.
   */
  const [busy, setBusy] = useState(false);

  // ----------------------------------------------------------
  // 3.2 FILTER PINJAMAN AKTIF
  // ----------------------------------------------------------

  /**
   * Hanya pinjaman berstatus ACTIVE yang dapat
   * dipilih untuk pembayaran angsuran.
   *
   * Pinjaman dengan status PAID tidak ditampilkan.
   */
  const active = loans.filter(
    x => x.status === 'ACTIVE'
  );

  // ----------------------------------------------------------
  // 3.3 MENCARI PINJAMAN TERPILIH
  // ----------------------------------------------------------

  /**
   * Mencari objek pinjaman berdasarkan loanId.
   *
   * Hasil digunakan untuk:
   * - Menampilkan sisa pinjaman.
   * - Memvalidasi nominal pembayaran.
   * - Mengambil loan_id dan member_id.
   */
  const selected = active.find(
    x => x.loan_id === loanId
  );

  // ----------------------------------------------------------
  // 3.4 MEMBENTUK PILIHAN DROPDOWN
  // ----------------------------------------------------------

  /**
   * Mengubah daftar pinjaman aktif menjadi
   * format yang digunakan komponen Dropdown.
   *
   * value       : ID pinjaman.
   * label       : Nama anggota dan ID pinjaman.
   * description : Sisa tagihan dalam format Rupiah.
   */
  const options = active.map(l => ({
    value: l.loan_id,

    label: `${
      members.find(
        m => m.member_id === l.member_id
      )?.name || l.member_id
    } • ${l.loan_id}`,

    description: `Sisa ${rupiah(l.remaining_amount)}`,
  }));

  // ==========================================================
  // 4. FUNGSI MENYIMPAN PEMBAYARAN ANGSURAN
  // ==========================================================

  /**
   * Fungsi save() dijalankan ketika pengguna
   * menekan tombol Bayar Angsuran.
   *
   * Tahapan:
   * 1. Validasi pinjaman dan nominal.
   * 2. Validasi nominal terhadap sisa pinjaman.
   * 3. Mengaktifkan status busy.
   * 4. Mengirim transaksi ke REST API.
   * 5. Memuat ulang data aplikasi.
   * 6. Menampilkan pesan berhasil.
   * 7. Membuka halaman riwayat transaksi.
   * 8. Menangani error jika transaksi gagal.
   */
  const save = async () => {

    // --------------------------------------------------------
    // 4.1 VALIDASI PINJAMAN DAN NOMINAL
    // --------------------------------------------------------

    /**
     * Pembayaran tidak boleh dilanjutkan jika:
     * - Belum memilih pinjaman aktif.
     * - Nominal pembayaran nol atau negatif.
     */
    if (!selected || Number(amount) <= 0) {
      return Alert.alert(
        'Validasi',
        'Pilih pinjaman dan isi nominal.'
      );
    }

    // --------------------------------------------------------
    // 4.2 VALIDASI SISA PINJAMAN
    // --------------------------------------------------------

    /**
     * Nominal angsuran tidak boleh lebih besar
     * daripada sisa pinjaman.
     *
     * Contoh:
     * Sisa pinjaman = Rp 500.000
     * Pembayaran    = Rp 600.000
     *
     * Hasil: Pembayaran ditolak.
     */
    if (Number(amount) > selected.remaining_amount) {
      return Alert.alert(
        'Validasi',
        'Angsuran melebihi sisa pinjaman.'
      );
    }

    // --------------------------------------------------------
    // 4.3 PROSES PEMBAYARAN
    // --------------------------------------------------------

    try {

      /**
       * Mengaktifkan indikator proses.
       *
       * Tombol pembayaran akan dinonaktifkan
       * selama request berlangsung.
       */
      setBusy(true);

      // ------------------------------------------------------
      // 4.4 MENGIRIM DATA KE REST API
      // ------------------------------------------------------

      /**
       * Memanggil endpoint pembayaran angsuran.
       *
       * Data yang dikirim:
       * loan_id   : ID pinjaman.
       * member_id : ID anggota.
       * date      : Tanggal pembayaran.
       * amount    : Nominal angsuran.
       * note      : Keterangan transaksi.
       *
       * Google Apps Script memproses pembayaran
       * dan memperbarui data di Google Sheets.
       */
      await api.addInstallment({
        loan_id: selected.loan_id,
        member_id: selected.member_id,
        date: today(),
        amount: Number(amount),
        note: 'Pembayaran angsuran',
      });

      // ------------------------------------------------------
      // 4.5 MEMPERBARUI DATA APLIKASI
      // ------------------------------------------------------

      /**
       * Memuat ulang data setelah pembayaran
       * berhasil diproses oleh REST API.
       *
       * Data pinjaman dan ringkasan aplikasi
       * dapat menampilkan nilai terbaru.
       */
      await reload();

      // ------------------------------------------------------
      // 4.6 MENAMPILKAN PESAN BERHASIL
      // ------------------------------------------------------

      Alert.alert(
        'Berhasil',
        'Angsuran tersimpan.'
      );

      // ------------------------------------------------------
      // 4.7 MEMBUKA RIWAYAT TRANSAKSI
      // ------------------------------------------------------

      /**
       * Mengarahkan pengguna ke halaman riwayat
       * setelah pembayaran berhasil.
       */
      navigate('history');

    } catch (e: any) {

      // ------------------------------------------------------
      // 4.8 MENANGANI KESALAHAN
      // ------------------------------------------------------

      /**
       * Menampilkan pesan kesalahan apabila:
       * - REST API gagal diakses.
       * - Server menolak transaksi.
       * - Terjadi kesalahan proses lainnya.
       */
      Alert.alert(
        'Gagal',
        e.message
      );

    } finally {

      // ------------------------------------------------------
      // 4.9 MENGAKHIRI STATUS PROSES
      // ------------------------------------------------------

      /**
       * Status busy dikembalikan menjadi false,
       * baik ketika transaksi berhasil maupun gagal.
       */
      setBusy(false);
    }
  };

  // ==========================================================
  // 5. TAMPILAN HALAMAN PEMBAYARAN ANGSURAN
  // ==========================================================

  return (
    <>

      {/* -----------------------------------------------------
          5.1 HEADER HALAMAN
          ----------------------------------------------------- */}

      <View style={s.hero}>

        <Ionicons
          name="card"
          size={32}
          color="#fff"
        />

        <View>
          <Text style={s.title}>
            Pembayaran Angsuran
          </Text>

          <Text style={s.sub}>
            Pilih pinjaman aktif dan catat pembayaran.
          </Text>
        </View>

      </View>

      {/* -----------------------------------------------------
          5.2 CARD FORM PEMBAYARAN
          ----------------------------------------------------- */}

      <Card>

        <View style={{ gap: 13 }}>

          {/* -------------------------------------------------
              5.3 DROPDOWN PINJAMAN AKTIF
              ------------------------------------------------- */}

          <Dropdown
            label="Pilih pinjaman aktif *"
            value={loanId}
            options={options}
            onChange={setLoanId}
            placeholder="Pilih pinjaman"
          />

          {/* -------------------------------------------------
              5.4 INFORMASI JIKA TIDAK ADA PINJAMAN
              ------------------------------------------------- */}

          {active.length === 0 && (
            <Text style={s.muted}>
              Tidak ada pinjaman aktif.
            </Text>
          )}

          {/* -------------------------------------------------
              5.5 INFORMASI SISA TAGIHAN
              ------------------------------------------------- */}

          {selected && (
            <View style={s.info}>

              <Text style={s.muted}>
                Sisa tagihan
              </Text>

              <Text style={s.amount}>
                {rupiah(selected.remaining_amount)}
              </Text>

            </View>
          )}

          {/* -------------------------------------------------
              5.6 INPUT NOMINAL ANGSURAN
              ------------------------------------------------- */}

          <Field
            label="Nominal angsuran *"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Nominal pembayaran"
          />

          {/* -------------------------------------------------
              5.7 TOMBOL BAYAR ANGSURAN
              ------------------------------------------------- */}

          /**
           * Tombol dinonaktifkan ketika:
           * - Belum ada pinjaman terpilih.
           * - Proses pembayaran sedang berlangsung.
           *
           * Saat ditekan, fungsi save() dijalankan.
           */

          <Btn
            title={
              busy
                ? 'Memproses pembayaran...'
                : 'Bayar Angsuran'
            }
            icon="card"
            disabled={!selected || busy}
            onPress={save}
          />

          {/* -------------------------------------------------
              5.8 INFORMASI ATURAN PEMBAYARAN
              ------------------------------------------------- */}

          <InfoNote>
            Setelah pembayaran berhasil, sisa pinjaman
            diperbarui otomatis. Status menjadi PAID
            saat sisa mencapai Rp 0.
          </InfoNote>

        </View>

      </Card>

    </>
  );
}

// ============================================================
// 6. STYLESHEET
// ============================================================

/**
 * StyleSheet mengatur desain halaman pembayaran.
 *
 * Warna utama:
 * Biru (#175cd3) untuk header dan nilai tagihan.
 *
 * Komponen desain:
 * hero   : Header halaman.
 * title  : Judul halaman.
 * sub    : Deskripsi header.
 * muted  : Teks informasi sekunder.
 * info   : Card informasi sisa tagihan.
 * amount : Nominal sisa pinjaman.
 */
const s = StyleSheet.create({

  // ----------------------------------------------------------
  // 6.1 HEADER HALAMAN
  // ----------------------------------------------------------

  hero: {
    backgroundColor: '#175cd3',
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
    color: '#d1e9ff',
    marginTop: 3,
  },

  // ----------------------------------------------------------
  // 6.4 TEKS INFORMASI
  // ----------------------------------------------------------

  muted: {
    color: '#667085',
  },

  // ----------------------------------------------------------
  // 6.5 CARD SISA TAGIHAN
  // ----------------------------------------------------------

  info: {
    backgroundColor: '#f2f4f7',
    borderRadius: 14,
    padding: 13,
  },

  // ----------------------------------------------------------
  // 6.6 NOMINAL SISA TAGIHAN
  // ----------------------------------------------------------

  amount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#175cd3',
    marginTop: 3,
  },

});
