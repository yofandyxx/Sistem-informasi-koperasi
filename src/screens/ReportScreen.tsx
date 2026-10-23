/**
 * ============================================================
 
 *
 * Fitur / konsep utama:
 * 1. Menampilkan jumlah anggota koperasi.
 * 2. Menampilkan jumlah pinjaman aktif.
 * 3. Menampilkan total simpanan bersih.
 * 4. Menampilkan total pokok pinjaman.
 * 5. Menampilkan total angsuran diterima.
 * 6. Menampilkan sisa pinjaman berjalan.
 * 7. Menampilkan informasi sumber data laporan.
 *
 * Konsep pembelajaran:
 * - React Functional Component.
 * - Props dan TypeScript Interface.
 * - Reusable Component.
 * - Data Formatting.
 * - Dashboard dan Reporting.
 * - REST API dan Google Sheets.
 * ============================================================
 */

// ============================================================
// 1. IMPORT LIBRARY DAN KOMPONEN
// ============================================================

import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

// Komponen UI yang digunakan bersama.
import {
  Card,
  InfoNote,
  SectionTitle,
} from '../components/UI';

// Tipe data ringkasan koperasi.
import { Summary } from '../types';

// Fungsi format angka menjadi mata uang Rupiah.
import { rupiah } from '../utils/format';

// ============================================================
// 2. DEFINISI PROPS
// ============================================================

/**
 * ReportScreen menerima data summary
 * dari komponen induk (App.tsx).
 *
 * Data summary berisi ringkasan:
 * - Jumlah anggota.
 * - Jumlah pinjaman aktif.
 * - Total simpanan.
 * - Total pokok pinjaman.
 * - Total angsuran.
 * - Total sisa pinjaman.
 *
 * Data tersebut berasal dari REST API
 * Google Apps Script yang terhubung
 * dengan Google Sheets.
 */

type ReportScreenProps = {
  summary: Summary;
};

// ============================================================
// 3. KOMPONEN UTAMA REPORT SCREEN
// ============================================================

export default function ReportScreen({
  summary,
}: ReportScreenProps) {

  return (
    <>

      {/* ====================================================
          3.1 HEADER HALAMAN LAPORAN
          ==================================================== */}

      <View style={s.hero}>

        {/* Ikon laporan */}

        <Ionicons
          name="bar-chart"
          size={30}
          color="#fff"
        />

        {/* Judul dan deskripsi halaman */}

        <View>

          <Text style={s.title}>
            Laporan Koperasi
          </Text>

          <Text style={s.sub}>
            Ringkasan kondisi keuangan dan
            keanggotaan terkini.
          </Text>

        </View>

      </View>

      {/* ====================================================
          3.2 KARTU STATISTIK UTAMA
          ==================================================== */}

      {/*
        Menampilkan dua statistik:

        1. Jumlah seluruh anggota koperasi.
        2. Jumlah pinjaman yang masih aktif.

        Komponen Mini digunakan agar desain
        kedua kartu tetap konsisten.
      */}

      <View style={s.grid}>

        {/* Statistik jumlah anggota */}

        <Mini
          label="Anggota"
          value={String(summary.total_members)}
          icon="people"
        />

        {/* Statistik pinjaman aktif */}

        <Mini
          label="Pinjaman Aktif"
          value={String(summary.active_loans)}
          icon="cash"
        />

      </View>

      {/* ====================================================
          3.3 RINGKASAN KEUANGAN KOPERASI
          ==================================================== */}

      <Card>

        <SectionTitle>
          Ringkasan Keuangan
        </SectionTitle>

        {/* Total saldo simpanan bersih */}

        <Row
          a="Total simpanan bersih"
          b={rupiah(summary.total_savings)}
        />

        {/* Total pokok pinjaman */}

        <Row
          a="Total pokok pinjaman"
          b={rupiah(summary.total_loan_principal)}
        />

        {/* Total pembayaran angsuran */}

        <Row
          a="Total angsuran diterima"
          b={rupiah(summary.total_installments)}
        />

        {/* Sisa pinjaman yang belum lunas */}

        <Row
          a="Sisa pinjaman berjalan"
          b={rupiah(summary.total_loan_remaining)}
        />

      </Card>

      {/* ====================================================
          3.4 INFORMASI SUMBER DATA
          ==================================================== */}

      {/*
        Memberikan informasi bahwa laporan
        berasal dari database Google Sheets
        melalui REST API Google Apps Script.

        Pembaruan data dilakukan melalui
        mekanisme refresh pada aplikasi.
      */}

      <InfoNote>
        Laporan mengambil data langsung dari
        Google Sheets melalui REST API Apps Script.
        Tarik layar ke bawah untuk memperbarui
        data terbaru.
      </InfoNote>

    </>
  );
}

// ============================================================
// 4. KOMPONEN MINI STATISTIK
// ============================================================

/**
 * Mini merupakan komponen reusable
 * untuk menampilkan statistik ringkas.
 *
 * Props:
 *
 * label:
 *   Nama statistik.
 *
 * value:
 *   Nilai statistik yang ditampilkan.
 *
 * icon:
 *   Nama ikon dari Ionicons.
 *
 * Komponen ini digunakan untuk:
 * - Jumlah anggota.
 * - Jumlah pinjaman aktif.
 */

type MiniProps = {
  label: string;
  value: string;
  icon: any;
};

function Mini({
  label,
  value,
  icon,
}: MiniProps) {

  return (
    <View style={s.mini}>

      {/* Ikon statistik */}

      <Ionicons
        name={icon}
        size={22}
        color="#175cd3"
      />

      {/* Nilai statistik */}

      <Text style={s.miniValue}>
        {value}
      </Text>

      {/* Nama statistik */}

      <Text style={s.muted}>
        {label}
      </Text>

    </View>
  );
}

// ============================================================
// 5. KOMPONEN BARIS LAPORAN
// ============================================================

/**
 * Row digunakan untuk menampilkan
 * pasangan label dan nilai laporan.
 *
 * Props:
 *
 * a:
 *   Nama informasi keuangan.
 *
 * b:
 *   Nilai informasi keuangan.
 *
 * Contoh:
 *
 * Total simpanan bersih    Rp 3.250.000
 *
 * Dengan komponen Row, seluruh baris
 * laporan memiliki desain yang sama.
 */

type RowProps = {
  a: string;
  b: string;
};

function Row({
  a,
  b,
}: RowProps) {

  return (
    <View style={s.row}>

      {/* Nama informasi */}

      <Text style={s.muted}>
        {a}
      </Text>

      {/* Nilai laporan */}

      <Text style={s.bold}>
        {b}
      </Text>

    </View>
  );
}

// ============================================================
// 6. STYLESHEET
// ============================================================

/**
 * StyleSheet menyimpan pengaturan desain
 * untuk halaman laporan koperasi.
 *
 * Warna biru digunakan pada halaman
 * laporan sesuai desain aplikasi FINAL.
 *
 * Pengaturan style dipisahkan dari JSX
 * agar lebih mudah dipelajari dan dirawat.
 */

const s = StyleSheet.create({

  // ----------------------------------------------------------
  // 6.1 HEADER LAPORAN
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

  title: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '900',
  },

  sub: {
    color: '#d1e9ff',
    marginTop: 3,
  },

  // ----------------------------------------------------------
  // 6.2 GRID STATISTIK
  // ----------------------------------------------------------

  grid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },

  // ----------------------------------------------------------
  // 6.3 KARTU MINI STATISTIK
  // ----------------------------------------------------------

  mini: {
    flex: 1,
    backgroundColor: '#eff8ff',
    borderRadius: 18,
    padding: 15,
  },

  miniValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#175cd3',
    marginTop: 5,
  },

  // ----------------------------------------------------------
  // 6.4 TEKS INFORMASI
  // ----------------------------------------------------------

  muted: {
    color: '#667085',
  },

  // ----------------------------------------------------------
  // 6.5 BARIS LAPORAN KEUANGAN
  // ----------------------------------------------------------

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderColor: '#eaecf0',
  },

  // ----------------------------------------------------------
  // 6.6 NILAI LAPORAN
  // ----------------------------------------------------------

  bold: {
    fontWeight: '900',
    color: '#101828',
  },

});
