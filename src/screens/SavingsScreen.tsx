/**
 * ============================================================
 *
 * Fitur / konsep utama:
 * 1. Memilih anggota koperasi yang masih aktif.
 * 2. Memilih jenis transaksi DEPOSIT atau WITHDRAWAL.
 * 3. Memvalidasi anggota dan nominal transaksi.
 * 4. Mengirim transaksi melalui Google Apps Script REST API.
 * 5. Memperbarui data setelah transaksi berhasil.
 * 6. Menampilkan pesan keberhasilan atau kegagalan.
 * 7. Mencegah pengiriman ganda selama proses berlangsung.
 * ============================================================
 */

// ============================================================
// 1. IMPORT LIBRARY DAN KOMPONEN
// ============================================================

// React dan Hook untuk mengelola state.
import React, { useState } from 'react';

// Komponen dasar React Native.
import {
  Alert,
  Pressable,
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

// Komponen UI yang digunakan bersama.
import {
  Btn,
  Card,
  Field,
  InfoNote,
} from '../components/UI';

// Definisi tipe data.
import {
  Member,
  ScreenName,
} from '../types';

// Fungsi mendapatkan tanggal hari ini.
import { today } from '../utils/format';

// ============================================================
// 2. DEFINISI PROPS
// ============================================================

/**
 * Props yang diterima SavingsScreen dari komponen induk.
 *
 * members:
 * Daftar anggota koperasi.
 *
 * reload:
 * Fungsi untuk memperbarui data setelah transaksi.
 *
 * navigate:
 * Fungsi untuk berpindah ke halaman lain.
 */
type SavingsScreenProps = {
  members: Member[];
  reload: () => Promise<void> | void;
  navigate: (s: ScreenName) => void;
};

// ============================================================
// 3. KOMPONEN UTAMA SAVINGS SCREEN
// ============================================================

export default function SavingsScreen({
  members,
  reload,
  navigate,
}: SavingsScreenProps) {

  // ==========================================================
  // 3.1 STATE FORM TRANSAKSI
  // ==========================================================

  // Menyimpan ID anggota yang dipilih.
  const [member, setMember] = useState('');

  // Jenis transaksi default adalah DEPOSIT (SETOR).
  const [type, setType] = useState('DEPOSIT');

  // Menyimpan nominal transaksi.
  const [amount, setAmount] = useState('');

  // Menyimpan keterangan tambahan transaksi.
  const [note, setNote] = useState('');

  // Menandai apakah transaksi sedang diproses.
  const [busy, setBusy] = useState(false);

  // ==========================================================
  // 3.2 FUNGSI MENYIMPAN TRANSAKSI
  // ==========================================================

  /**
   * Fungsi save:
   *
   * 1. Memvalidasi anggota dan nominal.
   * 2. Mengaktifkan status busy.
   * 3. Mengirim data transaksi melalui REST API.
   * 4. Memperbarui data aplikasi.
   * 5. Menampilkan pesan berhasil.
   * 6. Membuka halaman riwayat transaksi.
   * 7. Menangani error jika transaksi gagal.
   */

  const save = async () => {

    // --------------------------------------------------------
    // VALIDASI INPUT
    // --------------------------------------------------------

    /**
     * Transaksi tidak dapat dilanjutkan apabila:
     *
     * - Anggota belum dipilih.
     * - Nominal kosong, nol, atau bernilai negatif.
     * - Nominal tidak dapat dikonversi menjadi angka positif.
     */

    if (!member || Number(amount) <= 0) {
      return Alert.alert(
        'Validasi',
        'Pilih anggota dan isi nominal > 0.'
      );
    }

    try {

      // ------------------------------------------------------
      // AKTIFKAN STATUS PROSES
      // ------------------------------------------------------

      /**
       * Selama busy bernilai true, tombol Simpan
       * dinonaktifkan untuk mencegah pengiriman berulang.
       */
      setBusy(true);

      // ------------------------------------------------------
      // KIRIM TRANSAKSI KE REST API
      // ------------------------------------------------------

      /**
       * api.addSaving() mengirim data ke endpoint savings.
       *
       * Data yang dikirim:
       * - member_id : ID anggota.
       * - date      : Tanggal transaksi.
       * - type      : DEPOSIT atau WITHDRAWAL.
       * - amount    : Nominal transaksi.
       * - note      : Keterangan transaksi.
       *
       * Google Apps Script memproses request
       * dan menyimpan hasilnya ke Google Sheets.
       */

      await api.addSaving({
        member_id: member,
        date: today(),
        type,
        amount: Number(amount),
        note,
      });

      // ------------------------------------------------------
      // PERBARUI DATA APLIKASI
      // ------------------------------------------------------

      /**
       * Mengambil kembali data terbaru setelah transaksi
       * berhasil disimpan oleh REST API.
       */
      await reload();

      // ------------------------------------------------------
      // TAMPILKAN PESAN BERHASIL
      // ------------------------------------------------------

      Alert.alert(
        'Berhasil',
        'Transaksi simpanan tersimpan.'
      );

      // ------------------------------------------------------
      // PINDAH KE HALAMAN RIWAYAT
      // ------------------------------------------------------

      /**
       * Pengguna diarahkan ke halaman history
       * untuk melihat transaksi yang tercatat.
       */
      navigate('history');

    } catch (e: any) {

      // ------------------------------------------------------
      // PENANGANAN ERROR
      // ------------------------------------------------------

      /**
       * Error dapat berasal dari:
       * - Koneksi internet.
       * - Google Apps Script REST API.
       * - Validasi aturan bisnis pada server.
       * - Proses pembaruan data.
       *
       * Contoh:
       * Penarikan melebihi saldo anggota.
       */
      Alert.alert('Gagal', e.message);

    } finally {

      // ------------------------------------------------------
      // AKHIRI STATUS PROSES
      // ------------------------------------------------------

      /**
       * Status busy dikembalikan menjadi false,
       * baik ketika proses berhasil maupun gagal.
       */
      setBusy(false);
    }
  };

  // ==========================================================
  // 4. TAMPILAN ANTARMUKA
  // ==========================================================

  return (
    <>

      {/* =====================================================
          4.1 HEADER TRANSAKSI
          ===================================================== */}

      <View
        style={[
          s.hero,
          {
            backgroundColor:
              type === 'DEPOSIT'
                ? '#087f5b'
                : '#b54708',
          },
        ]}
      >

        {/* Ikon berubah sesuai jenis transaksi. */}
        <Ionicons
          name={
            type === 'DEPOSIT'
              ? 'arrow-down-circle'
              : 'arrow-up-circle'
          }
          size={32}
          color="#fff"
        />

        <View>

          <Text style={s.title}>
            Transaksi Simpanan
          </Text>

          <Text style={s.sub}>
            Setoran dan penarikan tercatat otomatis
            pada riwayat.
          </Text>

        </View>
      </View>

      {/* =====================================================
          4.2 FORM TRANSAKSI SIMPANAN
          ===================================================== */}

      <Card>

        <View style={{ gap: 13 }}>

          {/* -------------------------------------------------
              PILIH ANGGOTA
              ------------------------------------------------- */}

          {/*
            MemberPicker hanya menyediakan pilihan
            anggota dengan status ACTIVE.

            ID anggota yang dipilih disimpan
            pada state member.
          */}

          <MemberPicker
            members={members}
            value={member}
            onChange={setMember}
          />

          {/* -------------------------------------------------
              PILIH JENIS TRANSAKSI
              ------------------------------------------------- */}

          <Text style={s.label}>
            Jenis transaksi
          </Text>

          <View style={s.chips}>

            {/*
              Tersedia dua jenis transaksi:

              DEPOSIT    = SETOR
              WITHDRAWAL = TARIK

              Pilihan aktif memiliki latar hijau
              dan teks berwarna putih.
            */}

            {[
              ['DEPOSIT', 'SETOR', 'add-circle'],
              ['WITHDRAWAL', 'TARIK', 'remove-circle'],
            ].map(([x, l, i]) => (

              <Pressable
                key={x}
                onPress={() => setType(x)}
                style={[
                  s.chip,
                  type === x && s.on,
                ]}
              >

                <Ionicons
                  name={i as any}
                  size={18}
                  color={
                    type === x
                      ? '#fff'
                      : '#475467'
                  }
                />

                <Text
                  style={
                    type === x
                      ? s.white
                      : s.dark
                  }
                >
                  {l}
                </Text>

              </Pressable>
            ))}

          </View>

          {/* -------------------------------------------------
              INPUT NOMINAL
              ------------------------------------------------- */}

          {/*
            Keyboard numeric membantu pengguna
            memasukkan nilai transaksi.

            Nominal disimpan sebagai string,
            kemudian dikonversi dengan Number()
            ketika transaksi dikirim.
          */}

          <Field
            label="Nominal *"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Contoh: 100000"
          />

          {/* -------------------------------------------------
              INPUT KETERANGAN
              ------------------------------------------------- */}

          {/*
            Keterangan bersifat opsional.
            Pengguna dapat mengisi tujuan transaksi.
          */}

          <Field
            label="Keterangan"
            value={note}
            onChangeText={setNote}
            placeholder="Opsional"
          />

          {/* -------------------------------------------------
              TOMBOL SIMPAN TRANSAKSI
              ------------------------------------------------- */}

          {/*
            Ketika busy = true:
            - Tombol dinonaktifkan.
            - Teks berubah menjadi Memproses transaksi.

            Ketika busy = false:
            - Tombol dapat digunakan.
            - Fungsi save dipanggil saat ditekan.
          */}

          <Btn
            title={
              busy
                ? 'Memproses transaksi...'
                : 'Simpan Transaksi'
            }
            icon="save"
            disabled={busy}
            onPress={save}
          />

          {/* -------------------------------------------------
              INFORMASI TRANSAKSI
              ------------------------------------------------- */}

          <InfoNote>
            Transaksi dikirim ke Google Sheets
            melalui internet. Tunggu sampai pesan
            berhasil tampil agar transaksi tidak
            tercatat ganda.
          </InfoNote>

        </View>
      </Card>

    </>
  );
}

// ============================================================
// 5. STYLESHEET / DESAIN ANTARMUKA
// ============================================================

/**
 * StyleSheet digunakan untuk mengatur:
 *
 * 1. Header transaksi.
 * 2. Judul dan deskripsi.
 * 3. Label jenis transaksi.
 * 4. Tombol pilihan SETOR/TARIK.
 * 5. Warna teks dan pilihan aktif.
 *
 * Warna utama:
 * - Hijau  : #087f5b
 * - Oranye : #b54708
 */

const s = StyleSheet.create({

  // ----------------------------------------------------------
  // HEADER TRANSAKSI
  // ----------------------------------------------------------

  hero: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },

  // Judul halaman.
  title: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '900',
  },

  // Deskripsi halaman.
  sub: {
    color: '#fff',
    opacity: 0.85,
    marginTop: 3,
  },

  // ----------------------------------------------------------
  // LABEL FORM
  // ----------------------------------------------------------

  label: {
    fontWeight: '800',
    color: '#344054',
  },

  // ----------------------------------------------------------
  // PILIHAN JENIS TRANSAKSI
  // ----------------------------------------------------------

  // Kontainer tombol SETOR dan TARIK.
  chips: {
    flexDirection: 'row',
    gap: 8,
  },

  // Desain dasar tombol pilihan.
  chip: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    padding: 12,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 7,
  },

  // Warna tombol ketika dipilih.
  on: {
    backgroundColor: '#087f5b',
    borderColor: '#087f5b',
  },

  // Warna teks pilihan aktif.
  white: {
    color: '#fff',
    fontWeight: '800',
  },

  // Warna teks pilihan tidak aktif.
  dark: {
    color: '#475467',
    fontWeight: '800',
  },

});
