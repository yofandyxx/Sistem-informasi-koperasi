/**
 * ============================================================
 * 
 *
 * Fitur / konsep utama:
 * 1. Input username dan password.
 * 2. Validasi field wajib.
 * 3. Fitur lihat/sembunyikan password.
 * 4. Menonaktifkan tombol saat proses login.
 * 5. Mengirim user hasil login ke App.
 * ============================================================
 */

// ============================================================
// 1. IMPORT LIBRARY DAN KOMPONEN
// ============================================================

// React dan useState untuk mengelola state halaman login.
import React, { useState } from 'react';

// Komponen dasar React Native.
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// Library ikon.
import { Ionicons } from '@expo/vector-icons';

// Layanan komunikasi REST API.
import { api } from '../api/api';

// Komponen UI yang digunakan bersama.
import { Btn, Card, InfoNote } from '../components/UI';

// Tipe data pengguna.
import { User } from '../types';

// ============================================================
// 2. KOMPONEN LOGIN SCREEN
// ============================================================

/**
 * LoginScreen merupakan halaman autentikasi pengguna.
 *
 * Props:
 * onLogin : Callback untuk mengirim data pengguna
 *           yang berhasil login ke komponen induk.
 *
 * Setelah login berhasil, App.tsx akan menerima
 * informasi pengguna untuk menentukan tampilan
 * dan hak akses berdasarkan role.
 */
export default function LoginScreen({
  onLogin,
}: {
  onLogin: (u: User) => void;
}) {

  // ==========================================================
  // 3. STATE FORM LOGIN
  // ==========================================================

  /**
   * Username awal untuk kebutuhan praktikum.
   *
   * Nilai awal:
   * admin
   */
  const [username, setUsername] = useState('admin');

  /**
   * Password awal untuk kebutuhan praktikum.
   *
   * Nilai awal:
   * admin123
   */
  const [password, setPassword] = useState('admin123');

  /**
   * State busy digunakan untuk mengetahui
   * apakah proses login sedang berlangsung.
   *
   * false : Tidak sedang memproses login.
   * true  : Sedang mengirim request login.
   */
  const [busy, setBusy] = useState(false);

  /**
   * State showPassword mengatur tampilan password.
   *
   * false : Password disembunyikan.
   * true  : Password ditampilkan.
   */
  const [showPassword, setShowPassword] = useState(false);

  // ==========================================================
  // 4. FUNGSI PROSES LOGIN
  // ==========================================================

  /**
   * Fungsi submit dijalankan ketika pengguna
   * menekan tombol Masuk ke Dashboard.
   *
   * Urutan proses:
   * 1. Memeriksa username dan password.
   * 2. Menampilkan pesan jika input kosong.
   * 3. Mengaktifkan indikator proses.
   * 4. Mengirim data login melalui REST API.
   * 5. Menerima data pengguna dari server.
   * 6. Mengirim data pengguna ke App.
   * 7. Menangani error jika login gagal.
   * 8. Mengembalikan tombol ke kondisi normal.
   */
  const submit = async () => {

    // --------------------------------------------------------
    // 4.1 VALIDASI INPUT LOGIN
    // --------------------------------------------------------

    /**
     * Username tidak boleh kosong.
     * Password tidak boleh kosong.
     *
     * trim() menghapus spasi di awal dan akhir username.
     */
    if (!username.trim() || !password) {
      return Alert.alert(
        'Validasi',
        'Username dan password wajib diisi.'
      );
    }

    // --------------------------------------------------------
    // 4.2 MENGIRIM REQUEST LOGIN
    // --------------------------------------------------------

    try {

      /**
       * Mengaktifkan status proses.
       *
       * Tombol login akan dinonaktifkan
       * agar pengguna tidak mengirim request berulang.
       */
      setBusy(true);

      /**
       * Memanggil endpoint login pada api.ts.
       *
       * Username dan password dikirim ke
       * Google Apps Script REST API.
       */
      const r = await api.login(
        username.trim(),
        password
      );

      // ------------------------------------------------------
      // 4.3 LOGIN BERHASIL
      // ------------------------------------------------------

      /**
       * Data pengguna dikirim ke komponen induk.
       *
       * Informasi pengguna digunakan untuk
       * menentukan role dan menu aplikasi.
       */
      onLogin(r.data);

    } catch (e: any) {

      // ------------------------------------------------------
      // 4.4 LOGIN GAGAL
      // ------------------------------------------------------

      /**
       * Menampilkan pesan kesalahan.
       *
       * Contoh:
       * - Username atau password salah.
       * - Server tidak dapat diakses.
       * - REST API mengembalikan error.
       */
      Alert.alert(
        'Login gagal',
        e.message
      );

    } finally {

      // ------------------------------------------------------
      // 4.5 MENGAKHIRI PROSES LOGIN
      // ------------------------------------------------------

      /**
       * Mengembalikan busy menjadi false.
       *
       * Bagian finally dijalankan setelah
       * proses berhasil maupun gagal.
       */
      setBusy(false);
    }
  };

  // ==========================================================
  // 5. TAMPILAN HALAMAN LOGIN
  // ==========================================================

  return (
    <View style={s.page}>

      {/* =====================================================
          5.1 LOGO APLIKASI
          ===================================================== */}

      <View style={s.logo}>
        <Ionicons
          name="business"
          size={34}
          color="#fff"
        />
      </View>

      {/* Nama aplikasi */}
      <Text style={s.brand}>
        PPNP KOPERASI
      </Text>

      {/* Judul halaman login */}
      <Text style={s.heading}>
        Selamat Datang
      </Text>

      {/* Deskripsi halaman login */}
      <Text style={s.sub}>
        Masuk untuk mengelola layanan koperasi secara aman
        sesuai hak akses pengguna.
      </Text>

      {/* =====================================================
          5.2 CARD FORM LOGIN
          ===================================================== */}

      <Card>
        <View style={s.form}>

          {/* =================================================
              5.3 INPUT USERNAME
              ================================================= */}

          <View style={s.fieldGroup}>

            <Text style={s.label}>
              Username
            </Text>

            <View style={s.inputContainer}>

              {/* Ikon username */}
              <Ionicons
                name="person-outline"
                size={20}
                color="#667085"
              />

              {/* Input username */}
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Masukkan username"
                placeholderTextColor="#98a2b3"
                style={s.input}

                // Tidak menggunakan huruf kapital otomatis.
                autoCapitalize="none"

                // Menonaktifkan koreksi otomatis.
                autoCorrect={false}

                // Mengidentifikasi input sebagai username.
                textContentType="username"
              />

            </View>
          </View>

          {/* =================================================
              5.4 INPUT PASSWORD
              ================================================= */}

          <View style={s.fieldGroup}>

            <Text style={s.label}>
              Password
            </Text>

            <View style={s.inputContainer}>

              {/* Ikon password */}
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#667085"
              />

              {/* Input password */}
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Masukkan password"
                placeholderTextColor="#98a2b3"
                style={s.input}

                // Tidak menggunakan huruf kapital otomatis.
                autoCapitalize="none"

                // Menonaktifkan koreksi otomatis.
                autoCorrect={false}

                // Password disembunyikan secara default.
                secureTextEntry={!showPassword}

                // Mengidentifikasi input sebagai password.
                textContentType="password"
              />

              {/* =============================================
                  5.5 TOMBOL LIHAT / SEMBUNYIKAN PASSWORD
                  ============================================= */}

              <Pressable
                onPress={() =>
                  setShowPassword(!showPassword)
                }
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword
                    ? 'Sembunyikan password'
                    : 'Lihat password'
                }
              >

                {/* Ikon berubah sesuai kondisi password */}
                <Ionicons
                  name={
                    showPassword
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={22}
                  color="#667085"
                />

              </Pressable>

            </View>

            {/* Petunjuk penggunaan fitur password */}
            <Text style={s.helper}>
              Tekan ikon mata untuk melihat atau
              menyembunyikan password.
            </Text>

          </View>

          {/* =================================================
              5.6 TOMBOL LOGIN
              ================================================= */}

          {/*
            Tombol login memiliki dua kondisi:

            busy = false:
            Menampilkan "Masuk ke Dashboard".

            busy = true:
            Menampilkan "Memverifikasi..."
            dan tombol dinonaktifkan.
          */}

          <Btn
            title={
              busy
                ? 'Memverifikasi...'
                : 'Masuk ke Dashboard'
            }
            icon="log-in"
            disabled={busy}
            onPress={submit}
          />

          {/* =================================================
              5.7 INFORMASI AKUN PRAKTIKUM
              ================================================= */}

          {/*
            Akun berikut digunakan untuk pengujian
            tiga role pada aplikasi koperasi.

            ADMIN    : Hak pengelolaan penuh.
            PETUGAS  : Hak operasional transaksi.
            PIMPINAN : Hak monitoring dan laporan.
          */}

          <InfoNote>
            Akun awal praktikum: admin/admin123,
            petugas/petugas123, pimpinan/pimpinan123.
            Ganti akun untuk implementasi produksi.
          </InfoNote>

        </View>
      </Card>

    </View>
  );
}

// ============================================================
// 6. STYLESHEET HALAMAN LOGIN
// ============================================================

/**
 * StyleSheet digunakan untuk mengatur desain
 * dan tata letak halaman login.
 *
 * Tema utama:
 * Hijau emerald, putih, dan abu-abu lembut.
 */
const s = StyleSheet.create({

  // ----------------------------------------------------------
  // 6.1 HALAMAN UTAMA
  // ----------------------------------------------------------

  page: {
    flex: 1,
    justifyContent: 'center',
    padding: 22,
    backgroundColor: '#f0fdf4',
  },

  // ----------------------------------------------------------
  // 6.2 LOGO APLIKASI
  // ----------------------------------------------------------

  logo: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: '#087f5b',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },

  // ----------------------------------------------------------
  // 6.3 IDENTITAS APLIKASI
  // ----------------------------------------------------------

  brand: {
    textAlign: 'center',
    fontWeight: '900',
    letterSpacing: 2,
    color: '#087f5b',
  },

  heading: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '900',
    color: '#101828',
    marginTop: 6,
  },

  sub: {
    textAlign: 'center',
    color: '#667085',
    lineHeight: 20,
    marginVertical: 14,
  },

  // ----------------------------------------------------------
  // 6.4 FORM LOGIN
  // ----------------------------------------------------------

  form: {
    gap: 15,
  },

  fieldGroup: {
    gap: 6,
  },

  label: {
    fontWeight: '800',
    color: '#344054',
  },

  // ----------------------------------------------------------
  // 6.5 KONTAINER INPUT
  // ----------------------------------------------------------

  inputContainer: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: '#101828',
    paddingVertical: 12,
  },

  // ----------------------------------------------------------
  // 6.6 TEKS PETUNJUK
  // ----------------------------------------------------------

  helper: {
    color: '#667085',
    fontSize: 12,
    lineHeight: 17,
  },
});
