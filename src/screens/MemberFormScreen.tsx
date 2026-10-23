/**
 * ============================================================
 *
 *
 * Fitur / konsep utama:
 * 1. Mengisi data awal ketika mode edit.
 * 2. Validasi nama dan nomor identitas.
 * 3. Tambah atau update anggota melalui REST API.
 * 4. Mencegah pengiriman ganda saat proses berlangsung.
 * 5. Memperbarui daftar anggota setelah data disimpan.
 * ============================================================
 */

// ============================================================
// 1. IMPORT LIBRARY DAN KOMPONEN
// ============================================================

// React dan Hooks untuk mengelola state serta efek.
import React, { useEffect, useState } from 'react';

// Komponen dasar React Native.
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Library ikon untuk tampilan aplikasi.
import { Ionicons } from '@expo/vector-icons';

// Layanan komunikasi Google Apps Script REST API.
import { api } from '../api/api';

// Komponen UI yang digunakan bersama.
import {
  Btn,
  Card,
  Field,
  InfoNote,
} from '../components/UI';

// Definisi tipe data anggota dan nama screen.
import { Member, ScreenName } from '../types';

// Fungsi untuk mendapatkan tanggal saat ini.
import { today } from '../utils/format';

// ============================================================
// 2. KOMPONEN MEMBER FORM SCREEN
// ============================================================

/**
 * MemberFormScreen digunakan untuk:
 *
 * 1. Menambahkan anggota koperasi baru.
 * 2. Mengubah data anggota yang sudah terdaftar.
 *
 * Props:
 *
 * reload:
 * Memuat ulang data anggota setelah penyimpanan.
 *
 * navigate:
 * Mengatur perpindahan halaman aplikasi.
 *
 * editing:
 * Menyimpan data anggota yang akan diedit.
 * Jika kosong, form digunakan untuk tambah anggota.
 *
 * onDone:
 * Callback opsional setelah penyimpanan berhasil.
 */
export default function MemberFormScreen({
  reload,
  navigate,
  editing,
  onDone,
}: {
  reload: () => Promise<void> | void;
  navigate: (s: ScreenName) => void;
  editing?: Member | null;
  onDone?: () => void;
}) {

  // ==========================================================
  // 3. STATE FORM ANGGOTA
  // ==========================================================

  /**
   * Menyimpan nama lengkap anggota.
   */
  const [name, setName] = useState('');

  /**
   * Menyimpan nomor identitas anggota.
   *
   * Identitas dapat berupa:
   * - Nomor identitas umum.
   * - NIM mahasiswa.
   * - NIP pegawai.
   */
  const [id, setId] = useState('');

  /**
   * Menyimpan nomor HP anggota.
   */
  const [phone, setPhone] = useState('');

  /**
   * Menyimpan alamat anggota.
   */
  const [address, setAddress] = useState('');

  /**
   * Menandai proses penyimpanan.
   *
   * false : Tidak sedang menyimpan.
   * true  : Sedang mengirim data ke server.
   */
  const [busy, setBusy] = useState(false);

  // ==========================================================
  // 4. MENGISI DATA FORM SAAT MODE EDIT
  // ==========================================================

  /**
   * useEffect dijalankan ketika nilai editing berubah.
   *
   * Jika editing berisi data anggota:
   * Form akan menampilkan data anggota tersebut.
   *
   * Jika editing kosong:
   * Form akan dikosongkan untuk tambah anggota baru.
   */
  useEffect(() => {

    // Mengisi nama anggota.
    setName(editing?.name || '');

    // Mengisi nomor identitas.
    setId(editing?.identity_no || '');

    // Mengisi nomor HP.
    setPhone(editing?.phone || '');

    // Mengisi alamat.
    setAddress(editing?.address || '');

  }, [editing]);

  // ==========================================================
  // 5. FUNGSI SIMPAN DATA ANGGOTA
  // ==========================================================

  /**
   * Fungsi save dijalankan ketika pengguna
   * menekan tombol Simpan Anggota atau Simpan Perubahan.
   *
   * Alur:
   * 1. Validasi nama dan nomor identitas.
   * 2. Aktifkan indikator proses.
   * 3. Periksa mode tambah atau edit.
   * 4. Kirim data melalui REST API.
   * 5. Muat ulang data anggota.
   * 6. Tampilkan pesan keberhasilan.
   * 7. Jalankan callback onDone jika tersedia.
   * 8. Kembali ke halaman daftar anggota.
   */
  const save = async () => {

    // --------------------------------------------------------
    // 5.1 VALIDASI INPUT
    // --------------------------------------------------------

    /**
     * Nama dan nomor identitas wajib diisi.
     *
     * trim() menghapus spasi pada awal dan akhir teks.
     */
    if (!name.trim() || !id.trim()) {
      return Alert.alert(
        'Validasi',
        'Nama dan No. Identitas wajib diisi.'
      );
    }

    // --------------------------------------------------------
    // 5.2 MEMULAI PROSES PENYIMPANAN
    // --------------------------------------------------------

    try {

      /**
       * Mengaktifkan indikator proses.
       *
       * Tombol Simpan dinonaktifkan agar pengguna
       * tidak mengirim transaksi berulang kali.
       */
      setBusy(true);

      // ------------------------------------------------------
      // 5.3 MENENTUKAN MODE TAMBAH ATAU EDIT
      // ------------------------------------------------------

      if (editing) {

        // ====================================================
        // MODE EDIT ANGGOTA
        // ====================================================

        /**
         * Jika editing tersedia, program memanggil
         * endpoint updateMember().
         *
         * member_id digunakan sebagai identitas
         * anggota yang akan diperbarui.
         */
        await api.updateMember({
          member_id: editing.member_id,
          name: name.trim(),
          identity_no: id.trim(),
          phone,
          address,
        });

      } else {

        // ====================================================
        // MODE TAMBAH ANGGOTA
        // ====================================================

        /**
         * Jika editing kosong, program memanggil
         * endpoint createMember().
         *
         * Data anggota baru dilengkapi dengan:
         *
         * join_date : Tanggal pendaftaran.
         * status    : ACTIVE.
         */
        await api.createMember({
          name: name.trim(),
          identity_no: id.trim(),
          phone,
          address,
          join_date: today(),
          status: 'ACTIVE',
        });
      }

      // ------------------------------------------------------
      // 5.4 MEMPERBARUI DATA ANGGOTA
      // ------------------------------------------------------

      /**
       * Memuat ulang data setelah REST API
       * menyelesaikan proses penyimpanan.
       */
      await reload();

      // ------------------------------------------------------
      // 5.5 MENAMPILKAN PESAN BERHASIL
      // ------------------------------------------------------

      /**
       * Pesan disesuaikan dengan mode form.
       *
       * Edit:
       * "Data anggota diperbarui."
       *
       * Tambah:
       * "Anggota ditambahkan."
       */
      Alert.alert(
        'Berhasil',
        editing
          ? 'Data anggota diperbarui.'
          : 'Anggota ditambahkan.'
      );

      // ------------------------------------------------------
      // 5.6 MENJALANKAN CALLBACK
      // ------------------------------------------------------

      /**
       * Memanggil onDone jika callback tersedia.
       *
       * Optional chaining (?.) mencegah error
       * ketika onDone tidak diberikan.
       */
      onDone?.();

      // ------------------------------------------------------
      // 5.7 KEMBALI KE DAFTAR ANGGOTA
      // ------------------------------------------------------

      /**
       * Mengarahkan pengguna ke halaman Members.
       */
      navigate('members');

    } catch (e: any) {

      // ------------------------------------------------------
      // 5.8 MENANGANI KESALAHAN
      // ------------------------------------------------------

      /**
       * Menampilkan pesan error jika:
       *
       * - Request REST API gagal.
       * - Koneksi internet bermasalah.
       * - Server menolak data.
       * - Terjadi kesalahan saat memuat ulang data.
       */
      Alert.alert(
        'Gagal',
        e.message
      );

    } finally {

      // ------------------------------------------------------
      // 5.9 MENGAKHIRI PROSES
      // ------------------------------------------------------

      /**
       * Mengembalikan busy menjadi false.
       *
       * Tombol Simpan dapat digunakan kembali.
       */
      setBusy(false);
    }
  };

  // ==========================================================
  // 6. TAMPILAN FORM ANGGOTA
  // ==========================================================

  return (
    <>

      {/* =====================================================
          6.1 HEADER HALAMAN
          ===================================================== */}

      <View style={s.hero}>

        {/* Ikon berubah berdasarkan mode form */}
        <Ionicons
          name={editing ? 'create' : 'person-add'}
          size={30}
          color="#fff"
        />

        <View style={{ flex: 1 }}>

          {/* Judul dinamis tambah atau edit */}
          <Text style={s.title}>
            {editing
              ? 'Edit Data Anggota'
              : 'Registrasi Anggota Baru'}
          </Text>

          {/* Deskripsi halaman */}
          <Text style={s.sub}>
            Lengkapi identitas anggota koperasi
            dengan data yang benar.
          </Text>

        </View>
      </View>

      {/* =====================================================
          6.2 CARD FORM ANGGOTA
          ===================================================== */}

      <Card>
        <View style={{ gap: 13 }}>

          {/* =================================================
              6.3 INPUT NAMA ANGGOTA
              ================================================= */}

          <Field
            label="Nama anggota *"
            value={name}
            onChangeText={setName}
            placeholder="Nama lengkap"
          />

          {/* =================================================
              6.4 INPUT NOMOR IDENTITAS
              ================================================= */}

          <Field
            label="No. Identitas/NIM/NIP *"
            value={id}
            onChangeText={setId}
            placeholder="Nomor identitas"
          />

          {/* =================================================
              6.5 INPUT NOMOR HP
              ================================================= */}

          <Field
            label="No. HP"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="08xxxxxxxxxx"
          />

          {/* =================================================
              6.6 INPUT ALAMAT
              ================================================= */}

          <Field
            label="Alamat"
            value={address}
            onChangeText={setAddress}
            multiline
            placeholder="Alamat anggota"
          />

          {/* =================================================
              6.7 TOMBOL SIMPAN
              ================================================= */}

          {/*
            Teks tombol memiliki tiga kondisi:

            busy = true:
            "Menyimpan ke Google Sheets..."

            editing tersedia:
            "Simpan Perubahan"

            editing kosong:
            "Simpan Anggota"
          */}

          <Btn
            title={
              busy
                ? 'Menyimpan ke Google Sheets...'
                : editing
                  ? 'Simpan Perubahan'
                  : 'Simpan Anggota'
            }
            icon="save"
            disabled={busy}
            onPress={save}
          />

          {/* =================================================
              6.8 INFORMASI PENYIMPANAN DATA
              ================================================= */}

          <InfoNote>
            Data disimpan melalui Apps Script ke Google
            Sheets. Lama proses bergantung pada koneksi
            internet. Jangan menekan tombol Simpan
            berulang kali.
          </InfoNote>

        </View>
      </Card>

    </>
  );
}

// ============================================================
// 7. STYLESHEET HALAMAN ANGGOTA
// ============================================================

/**
 * StyleSheet digunakan untuk mengatur:
 *
 * 1. Header halaman.
 * 2. Judul form.
 * 3. Deskripsi form.
 *
 * Komponen Field, Card, Btn, dan InfoNote
 * menggunakan style dari src/components/UI.tsx.
 */
const s = StyleSheet.create({

  // ----------------------------------------------------------
  // 7.1 HEADER HALAMAN
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
  // 7.2 JUDUL HALAMAN
  // ----------------------------------------------------------

  title: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '900',
  },

  // ----------------------------------------------------------
  // 7.3 DESKRIPSI HALAMAN
  // ----------------------------------------------------------

  sub: {
    color: '#d1e9ff',
    marginTop: 3,
    lineHeight: 18,
  },
});
