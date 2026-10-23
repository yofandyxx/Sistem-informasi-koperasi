/**
 * ============================================================
 * PROJECT 05 - SISTEM INFORMASI KOPERASI
 * ============================================================
 
 *
 * FITUR / KONSEP UTAMA:
 * 1. Card         : Kontainer tampilan berbentuk kartu.
 * 2. Btn          : Tombol aksi dengan ikon dan variasi warna.
 * 3. Field        : Input teks dengan label.
 * 4. Loading      : Indikator proses pemuatan data.
 * 5. EmptyState   : Informasi ketika data kosong.
 * 6. SectionTitle : Judul bagian pada halaman.
 * 7. Badge        : Label atau penanda informasi.
 * 8. InfoNote     : Kotak informasi dengan ikon.
 *
 * TUJUAN:
 * Menjaga konsistensi UI dan mengurangi pengulangan
 * kode antarscreen pada aplikasi koperasi.
 * ============================================================
 */

// ============================================================
// 1. IMPORT LIBRARY
// ============================================================

// React digunakan untuk membuat komponen antarmuka.
import React from 'react';

// Komponen dasar antarmuka React Native.
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// Ionicons digunakan untuk menampilkan ikon.
import { Ionicons } from '@expo/vector-icons';

// ============================================================
// 2. KOMPONEN CARD
// ============================================================

/**
 * Card berfungsi sebagai kontainer untuk membungkus
 * informasi dalam bentuk kartu dengan sudut membulat,
 * padding, dan efek bayangan.
 *
 * Props:
 * children : Konten yang ditampilkan di dalam kartu.
 */
export const Card = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <View style={s.card}>
    {children}
  </View>
);

// ============================================================
// 3. KOMPONEN BUTTON (Btn)
// ============================================================

/**
 * Btn merupakan tombol reusable untuk menjalankan aksi.
 *
 * Props:
 * title    : Teks pada tombol.
 * onPress  : Fungsi ketika tombol ditekan.
 * icon     : Nama ikon Ionicons.
 * disabled : Menonaktifkan tombol.
 * variant  : Jenis tampilan tombol.
 *
 * Variasi tombol:
 * primary   : Hijau (default).
 * danger    : Merah.
 * secondary : Hijau muda dengan border.
 */
export const Btn = ({
  title,
  onPress,
  icon = 'arrow-forward',
  disabled = false,
  variant = 'primary',
}: {
  title: string;
  onPress: () => void;
  icon?: any;
  disabled?: boolean;
  variant?: 'primary' | 'danger' | 'secondary';
}) => (
  <Pressable
    disabled={disabled}
    onPress={onPress}
    style={[
      s.btn,
      variant === 'danger' && s.danger,
      variant === 'secondary' && s.secondary,
      disabled && { opacity: .55 },
    ]}
  >
    {/* Ikon tombol menyesuaikan jenis variant. */}
    <Ionicons
      name={icon}
      size={18}
      color={variant === 'secondary' ? '#087f5b' : '#fff'}
    />

    {/* Teks tombol. */}
    <Text
      style={[
        s.btnText,
        variant === 'secondary' && { color: '#087f5b' },
      ]}
    >
      {title}
    </Text>
  </Pressable>
);

// ============================================================
// 4. KOMPONEN FIELD
// ============================================================

/**
 * Field menyediakan input teks dengan label.
 *
 * Props:
 * label           : Judul input.
 * value           : Nilai input saat ini.
 * onChangeText    : Callback perubahan teks.
 * placeholder     : Petunjuk pengisian.
 * keyboardType    : Jenis keyboard.
 * multiline       : Mengaktifkan input beberapa baris.
 * secureTextEntry : Menyembunyikan karakter password.
 *
 * Props input diteruskan ke TextInput menggunakan
 * spread operator (...p).
 */
export const Field = ({
  label,
  ...p
}: {
  label: string;
  value: string;
  onChangeText: (x: string) => void;
  placeholder?: string;
  keyboardType?: any;
  multiline?: boolean;
  secureTextEntry?: boolean;
}) => (
  <View style={{ gap: 6 }}>
    {/* Label input. */}
    <Text style={s.label}>
      {label}
    </Text>

    {/* Input yang menerima data dari pengguna. */}
    <TextInput
      {...p}
      placeholderTextColor="#98a2b3"
      style={[
        s.input,
        p.multiline && {
          height: 88,
          textAlignVertical: 'top',
        },
      ]}
    />
  </View>
);

// ============================================================
// 5. KOMPONEN LOADING
// ============================================================

/**
 * Loading menampilkan indikator ketika aplikasi
 * sedang mengambil atau memproses data.
 *
 * Contoh:
 * - Memuat daftar anggota.
 * - Mengambil dashboard dari REST API.
 * - Menunggu response server.
 *
 * Props:
 * text : Pesan loading, default "Memuat data...".
 */
export const Loading = ({
  text = 'Memuat data...',
}: {
  text?: string;
}) => (
  <View style={s.loading}>
    <ActivityIndicator
      size="large"
      color="#087f5b"
    />
    <Text style={{ marginTop: 8, color: '#667085' }}>
      {text}
    </Text>
  </View>
);

// ============================================================
// 6. KOMPONEN EMPTY STATE
// ============================================================

/**
 * EmptyState menampilkan pesan ketika daftar data kosong.
 *
 * Komponen menggunakan Card agar tampilan pesan
 * konsisten dengan kartu lain pada aplikasi.
 *
 * Props:
 * text : Pesan ketika data belum tersedia.
 */
export const EmptyState = ({
  text = 'Belum ada data.',
}: {
  text?: string;
}) => (
  <Card>
    <Text style={s.empty}>
      {text}
    </Text>
  </Card>
);

// ============================================================
// 7. KOMPONEN SECTION TITLE
// ============================================================

/**
 * SectionTitle digunakan untuk menampilkan judul
 * bagian atau kelompok informasi pada screen.
 *
 * Props:
 * children : Teks atau konten judul.
 */
export const SectionTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Text style={s.section}>
    {children}
  </Text>
);

// ============================================================
// 8. KOMPONEN BADGE
// ============================================================

/**
 * Badge menampilkan label singkat berbentuk penanda.
 *
 * Contoh penggunaan:
 * - Status anggota.
 * - Kategori informasi.
 * - Label aktivitas.
 *
 * Props:
 * children : Isi label yang ditampilkan.
 */
export const Badge = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Text style={s.badge}>
    {children}
  </Text>
);

// ============================================================
// 9. KOMPONEN INFO NOTE
// ============================================================

/**
 * InfoNote digunakan untuk menampilkan pesan informasi
 * dalam kotak berwarna biru muda.
 *
 * Komponen terdiri atas:
 * - Ikon information-circle.
 * - Teks informasi.
 *
 * Props:
 * children : Isi pesan informasi.
 */
export const InfoNote = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <View style={s.note}>
    <Ionicons
      name="information-circle"
      size={20}
      color="#175cd3"
    />
    <Text style={s.noteText}>
      {children}
    </Text>
  </View>
);

// ============================================================
// 10. STYLESHEET / PENGATURAN TAMPILAN
// ============================================================

/**
 * StyleSheet menyimpan konfigurasi tampilan
 * seluruh komponen UI pada file ini.
 *
 * Warna utama aplikasi:
 * Hijau emerald : #087f5b
 * Merah bahaya  : #d92d20
 * Biru informasi: #175cd3
 *
 * Pengaturan asli dipertahankan agar desain
 * aplikasi Project 05 tidak berubah.
 */
const s = StyleSheet.create({
  // Kontainer kartu dengan bayangan.
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#101828',
    shadowOpacity: .07,
    shadowRadius: 10,
    elevation: 2,
  },

  // Tombol utama berwarna hijau.
  btn: {
    backgroundColor: '#087f5b',
    padding: 14,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  // Variasi tombol untuk aksi berbahaya.
  danger: {
    backgroundColor: '#d92d20',
  },

  // Variasi tombol sekunder.
  secondary: {
    backgroundColor: '#ecfdf3',
    borderWidth: 1,
    borderColor: '#a6f4c5',
  },

  // Teks pada tombol.
  btnText: {
    color: '#fff',
    fontWeight: '800',
  },

  // Label pada komponen input.
  label: {
    fontWeight: '800',
    color: '#344054',
  },

  // Tampilan input teks.
  input: {
    borderWidth: 1,
    borderColor: '#d0d5dd',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 13,
    fontSize: 15,
    color: '#101828',
  },

  // Kontainer indikator loading.
  loading: {
    padding: 30,
    alignItems: 'center',
  },

  // Pesan ketika data kosong.
  empty: {
    color: '#667085',
    textAlign: 'center',
  },

  // Judul bagian halaman.
  section: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
    color: '#1d2939',
  },

  // Label badge.
  badge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: '#d3f9e8',
    color: '#087f5b',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    fontWeight: '800',
  },

  // Kotak catatan informasi.
  note: {
    backgroundColor: '#eff8ff',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    gap: 9,
    alignItems: 'flex-start',
  },

  // Teks dalam kotak informasi.
  noteText: {
    flex: 1,
    color: '#1849a9',
    fontSize: 12,
    lineHeight: 18,
  },
});

// ============================================================
// AKHIR FILE UI.tsx
// ============================================================
