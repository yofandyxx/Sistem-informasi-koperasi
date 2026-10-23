/**
 * ============================================================
 *c:\Users\User\Downloads\index.tsc:\Users\User\Downloads\index.ts
 * Fitur / konsep utama:
 * 1. Menampilkan informasi pengguna yang sedang login.
 * 2. Menampilkan statistik operasional koperasi.
 * 3. Menampilkan ringkasan data dan transaksi.
 * 4. Menyediakan akses cepat sesuai role pengguna.
 * 5. Menampilkan tiga aktivitas transaksi terbaru.
 * 6. Membatasi menu transaksi untuk role PIMPINAN.
 *
 * Konsep pembelajaran:
 * - React Functional Component
 * - TypeScript Props
 * - Conditional Rendering
 * - Role-Based Access Control (RBAC)
 * - Array map(), slice(), dan reverse()
 * - Reusable Component
 * - React Native StyleSheet
 * ============================================================
 */

// ============================================================
// 1. IMPORT LIBRARY DAN KOMPONEN
// ============================================================

// Library utama React.
import React from 'react';

// Komponen dasar React Native.
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Library ikon.
import { Ionicons } from '@expo/vector-icons';

// Komponen UI yang digunakan bersama.
import {
  Btn,
  Card,
  SectionTitle,
} from '../components/UI';

// Definisi tipe data aplikasi.
import {
  ScreenName,
  Summary,
  Transaction,
  User,
} from '../types';

// Fungsi untuk mengubah angka menjadi format Rupiah.
import { rupiah } from '../utils/format';

// ============================================================
// 2. DEFINISI PROPS DASHBOARD
// ============================================================

/**
 * Props merupakan data yang diterima DashboardScreen
 * dari komponen induk.
 *
 * summary:
 * Berisi ringkasan statistik koperasi dari server.
 *
 * navigate:
 * Fungsi untuk berpindah ke halaman aplikasi.
 *
 * user:
 * Informasi pengguna yang sedang login.
 *
 * transactions:
 * Daftar transaksi yang digunakan untuk
 * menampilkan aktivitas terbaru.
 */
type DashboardProps = {
  summary: Summary;
  navigate: (s: ScreenName) => void;
  user: User;
  transactions: Transaction[];
};

// ============================================================
// 3. KOMPONEN UTAMA DASHBOARD
// ============================================================

export default function DashboardScreen({
  summary,
  navigate,
  user,
  transactions,
}: DashboardProps) {

  // ==========================================================
  // 3.1. PEMERIKSAAN HAK AKSES
  // ==========================================================

  /**
   * ADMIN dan PETUGAS boleh melakukan transaksi.
   *
   * PIMPINAN hanya memiliki akses monitoring.
   *
   * Jika role adalah PIMPINAN:
   * canTransact = false
   *
   * Jika role ADMIN atau PETUGAS:
   * canTransact = true
   */
  const canTransact = user.role !== 'PIMPINAN';

  // ==========================================================
  // 3.2. TAMPILAN DASHBOARD
  // ==========================================================

  return (
    <>

      {/* =====================================================
          A. HEADER / INFORMASI PENGGUNA
          ===================================================== */}

      <View style={s.hero}>

        {/* Ikon koperasi */}
        <View style={s.heroIcon}>
          <Ionicons
            name="business"
            size={30}
            color="#fff"
          />
        </View>

        {/* Informasi pengguna */}
        <View style={{ flex: 1 }}>

          <Text style={s.welcome}>
            Selamat datang, {user.full_name}
          </Text>

          <Text style={s.title}>
            Koperasi Digital PPNP
          </Text>

          <Text style={s.sub}>
            {user.role} • Google Sheets + Apps Script
          </Text>

        </View>
      </View>

      {/* =====================================================
          B. KARTU STATISTIK KOPERASI
          ===================================================== */}

      {/*
        Komponen Stat digunakan berulang kali
        untuk menampilkan data statistik.

        Setiap kartu memiliki:
        - Ikon
        - Label
        - Nilai
        - Warna latar
        - Warna teks dan ikon
      */}

      <View style={s.grid}>

        {/* Statistik anggota aktif */}
        <Stat
          bg="#ecfdf3"
          fg="#087f5b"
          icon="people"
          label="Anggota Aktif"
          value={String(summary.active_members)}
        />

        {/* Statistik total simpanan */}
        <Stat
          bg="#eff8ff"
          fg="#175cd3"
          icon="wallet"
          label="Total Simpanan"
          value={rupiah(summary.total_savings)}
        />

        {/* Statistik pinjaman aktif */}
        <Stat
          bg="#f4f3ff"
          fg="#6941c6"
          icon="cash"
          label="Pinjaman Aktif"
          value={String(summary.active_loans)}
        />

        {/* Statistik sisa pinjaman */}
        <Stat
          bg="#fff6ed"
          fg="#b54708"
          icon="trending-down"
          label="Sisa Pinjaman"
          value={rupiah(summary.total_loan_remaining)}
        />

      </View>

      {/* =====================================================
          C. RINGKASAN OPERASIONAL
          ===================================================== */}

      <Card>

        <SectionTitle>
          Ringkasan Operasional
        </SectionTitle>

        {/* Jumlah seluruh anggota */}
        <View style={s.line}>

          <Text>
            Total anggota terdaftar
          </Text>

          <Text style={s.bold}>
            {summary.total_members}
          </Text>

        </View>

        {/* Total pokok pinjaman */}
        <View style={s.line}>

          <Text>
            Pokok pinjaman tersalurkan
          </Text>

          <Text style={s.bold}>
            {rupiah(summary.total_loan_principal)}
          </Text>

        </View>

        {/* Total pembayaran angsuran */}
        <View style={s.line}>

          <Text>
            Angsuran diterima
          </Text>

          <Text style={s.bold}>
            {rupiah(summary.total_installments)}
          </Text>

        </View>

        {/* Jumlah transaksi */}
        <View style={s.line}>

          <Text>
            Total transaksi tercatat
          </Text>

          <Text style={s.bold}>
            {transactions.length}
          </Text>

        </View>

      </Card>

      {/* =====================================================
          D. AKSES CEPAT BERDASARKAN ROLE
          ===================================================== */}

      {/*
        Conditional Rendering:

        Menu Akses Cepat hanya ditampilkan jika
        canTransact bernilai true.

        ADMIN:
        - Tambah Anggota
        - Setor / Tarik Simpanan
        - Buat Pinjaman
        - Bayar Angsuran

        PETUGAS:
        - Setor / Tarik Simpanan
        - Buat Pinjaman
        - Bayar Angsuran

        PIMPINAN:
        - Tidak menampilkan menu Akses Cepat
      */}

      {canTransact && (

        <Card>

          <SectionTitle>
            Akses Cepat
          </SectionTitle>

          <View style={{ gap: 9 }}>

            {/* Khusus ADMIN */}
            {user.role === 'ADMIN' && (

              <Btn
                title="Tambah Anggota"
                icon="person-add"
                onPress={() => navigate('memberForm')}
              />

            )}

            {/* ADMIN dan PETUGAS */}
            <Btn
              title="Setor / Tarik Simpanan"
              icon="wallet"
              onPress={() => navigate('savings')}
            />

            <Btn
              title="Buat Pinjaman"
              icon="cash"
              onPress={() => navigate('loans')}
            />

            <Btn
              title="Bayar Angsuran"
              icon="card"
              onPress={() => navigate('installment')}
            />

          </View>

        </Card>

      )}

      {/* =====================================================
          E. AKTIVITAS TRANSAKSI TERBARU
          ===================================================== */}

      <Card>

        <SectionTitle>
          Aktivitas Terbaru
        </SectionTitle>

        {/*
          transactions.slice(-3):
          Mengambil maksimal tiga data terakhir.

          reverse():
          Membalik urutan data yang diambil.

          map():
          Mengubah setiap data transaksi menjadi
          komponen tampilan React Native.
        */}

        {transactions
          .slice(-3)
          .reverse()
          .map(t => (

            <View
              key={t.transaction_id}
              style={s.activity}
            >

              {/* Ikon transaksi */}
              <Ionicons
                name="receipt-outline"
                size={19}
                color="#087f5b"
              />

              {/* Detail transaksi */}
              <View style={{ flex: 1 }}>

                <Text style={s.bold}>
                  {t.category.replaceAll('_', ' ')}
                </Text>

                <Text style={s.small}>
                  {t.date} • {t.description}
                </Text>

              </View>

            </View>

          ))}

        {/* Jika belum ada transaksi */}
        {transactions.length === 0 && (

          <Text style={s.small}>
            Belum ada transaksi.
          </Text>

        )}

      </Card>

    </>
  );
}

// ============================================================
// 4. KOMPONEN STATISTIK REUSABLE
// ============================================================

/**
 * Komponen Stat digunakan untuk menampilkan
 * satu kartu statistik pada Dashboard.
 *
 * Parameter:
 *
 * icon  : Nama ikon Ionicons.
 * label : Nama statistik.
 * value : Nilai statistik.
 * bg    : Warna latar kartu.
 * fg    : Warna ikon dan nilai.
 *
 * Komponen ini digunakan sebanyak empat kali
 * pada bagian statistik Dashboard.
 */
function Stat({
  icon,
  label,
  value,
  bg,
  fg,
}: {
  icon: any;
  label: string;
  value: string;
  bg: string;
  fg: string;
}) {

  return (

    <View
      style={[
        s.stat,
        { backgroundColor: bg },
      ]}
    >

      {/* Ikon statistik */}
      <Ionicons
        name={icon}
        size={25}
        color={fg}
      />

      {/* Nilai statistik */}
      <Text
        style={[
          s.value,
          { color: fg },
        ]}
      >
        {value}
      </Text>

      {/* Label statistik */}
      <Text style={s.muted}>
        {label}
      </Text>

    </View>

  );
}

// ============================================================
// 5. STYLESHEET / DESAIN TAMPILAN
// ============================================================

/**
 * StyleSheet digunakan untuk mengatur desain
 * Dashboard agar konsisten.
 *
 * Warna utama:
 * Dark Green : #064e3b
 * Emerald    : #087f5b
 *
 * Warna pendukung:
 * Biru       : #175cd3
 * Ungu       : #6941c6
 * Oranye     : #b54708
 */

const s = StyleSheet.create({

  // ----------------------------------------------------------
  // A. HEADER DASHBOARD
  // ----------------------------------------------------------

  hero: {
    backgroundColor: '#064e3b',
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
    flexDirection: 'row',
    gap: 13,
    alignItems: 'center',
  },

  heroIcon: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: '#0ca678',
    alignItems: 'center',
    justifyContent: 'center',
  },

  welcome: {
    color: '#a7f3d0',
    fontSize: 12,
    fontWeight: '800',
  },

  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
  },

  sub: {
    color: '#d1fae5',
    marginTop: 3,
  },

  // ----------------------------------------------------------
  // B. GRID STATISTIK
  // ----------------------------------------------------------

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },

  stat: {
    width: '48%',
    padding: 15,
    borderRadius: 18,
  },

  value: {
    fontWeight: '900',
    fontSize: 16,
    marginTop: 8,
  },

  muted: {
    color: '#667085',
    marginTop: 4,
    fontSize: 12,
  },

  // ----------------------------------------------------------
  // C. RINGKASAN OPERASIONAL
  // ----------------------------------------------------------

  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderColor: '#f2f4f7',
  },

  bold: {
    fontWeight: '800',
    color: '#344054',
  },

  // ----------------------------------------------------------
  // D. AKTIVITAS TERBARU
  // ----------------------------------------------------------

  activity: {
    flexDirection: 'row',
    gap: 9,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderColor: '#f2f4f7',
  },

  small: {
    color: '#667085',
    fontSize: 12,
    marginTop: 2,
  },

});
