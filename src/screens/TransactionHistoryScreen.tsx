/**

 *
 * Fitur / konsep utama:
 * 1. Menampilkan seluruh riwayat transaksi koperasi.
 * 2. Memfilter transaksi berdasarkan kategori.
 * 3. Menentukan transaksi masuk (credit) atau keluar (debit).
 * 4. Menampilkan nama anggota yang melakukan transaksi.
 * 5. Mengurutkan transaksi terbaru pada bagian atas.
 * 6. Menampilkan informasi ketika transaksi tidak ditemukan.
 *
 * Konsep pembelajaran:
 * - React Functional Component.
 * - React Hooks: useState dan useMemo.
 * - Props dan TypeScript.
 * - Array filter(), slice(), reverse(), map(), dan find().
 * - Conditional Rendering.
 * - Reusable UI Component.
 * - Audit Trail dan Riwayat Transaksi.
 * ============================================================
 */

// ============================================================
// 1. IMPORT LIBRARY DAN KOMPONEN
// ============================================================

// React dan Hooks untuk mengelola state serta optimasi data.
import React, { useMemo, useState } from 'react';

// Komponen antarmuka React Native.
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Library ikon Ionicons.
import { Ionicons } from '@expo/vector-icons';

// Komponen UI yang digunakan bersama.
import {
  Card,
  EmptyState,
} from '../components/UI';

// Definisi tipe data anggota dan transaksi.
import {
  Member,
  Transaction,
} from '../types';

// Fungsi untuk mengubah angka menjadi format Rupiah.
import { rupiah } from '../utils/format';

// ============================================================
// 2. KONFIGURASI FILTER TRANSAKSI
// ============================================================

/**
 * FILTERS berisi daftar kategori transaksi.
 *
 * Setiap item memiliki dua nilai:
 *
 * [kode_kategori, label_tampilan]
 *
 * Kategori:
 * ALL               = Semua transaksi.
 * SAVING_DEPOSIT    = Setoran simpanan.
 * SAVING_WITHDRAWAL = Penarikan simpanan.
 * LOAN_DISBURSEMENT = Pencairan pinjaman.
 * INSTALLMENT       = Pembayaran angsuran.
 *
 * Kode kategori digunakan untuk mencocokkan data
 * transaksi yang diterima dari REST API.
 *
 * Label digunakan sebagai teks tombol filter.
 */

const FILTERS = [
  ['ALL', 'SEMUA'],
  ['SAVING_DEPOSIT', 'SETOR'],
  ['SAVING_WITHDRAWAL', 'TARIK'],
  ['LOAN_DISBURSEMENT', 'PINJAM'],
  ['INSTALLMENT', 'ANGSUR'],
];

// ============================================================
// 3. KOMPONEN UTAMA TRANSACTION HISTORY SCREEN
// ============================================================

/**
 * TransactionHistoryScreen menampilkan daftar transaksi
 * yang telah dicatat oleh sistem koperasi.
 *
 * Props:
 *
 * transactions:
 *   Daftar transaksi yang diterima dari REST API.
 *
 * members:
 *   Daftar anggota koperasi untuk mencari nama anggota
 *   berdasarkan member_id pada transaksi.
 *
 * Komponen ini hanya menampilkan dan memfilter data.
 * Tidak melakukan perubahan data transaksi.
 */

export default function TransactionHistoryScreen({
  transactions,
  members,
}: {
  transactions: Transaction[];
  members: Member[];
}) {

  // ==========================================================
  // 4. STATE FILTER TRANSAKSI
  // ==========================================================

  /**
   * Menyimpan kategori transaksi yang sedang dipilih.
   *
   * Nilai awal ALL berarti seluruh transaksi ditampilkan.
   *
   * Ketika pengguna memilih tombol kategori lain,
   * nilai filter akan diperbarui melalui setFilter().
   */

  const [filter, setFilter] = useState('ALL');

  // ==========================================================
  // 5. MEMFILTER DAN MENGURUTKAN TRANSAKSI
  // ==========================================================

  /**
   * useMemo digunakan untuk menyimpan hasil pengolahan
   * daftar transaksi.
   *
   * Proses pengolahan:
   *
   * 1. Membaca seluruh transaksi.
   * 2. Memeriksa kategori filter.
   * 3. Menampilkan transaksi sesuai kategori.
   * 4. Membuat salinan array menggunakan slice().
   * 5. Membalik urutan menggunakan reverse().
   *
   * Jika filter = ALL:
   *   Seluruh transaksi ditampilkan.
   *
   * Jika filter bukan ALL:
   *   Hanya transaksi dengan kategori sesuai
   *   yang akan ditampilkan.
   *
   * slice() digunakan agar reverse() tidak mengubah
   * array transaksi asli.
   *
   * useMemo akan menghitung ulang hasil ketika
   * transactions atau filter berubah.
   */

  const list = useMemo(
    () =>
      transactions
        .filter(
          t =>
            filter === 'ALL' ||
            t.category === filter
        )
        .slice()
        .reverse(),
    [transactions, filter]
  );

  // ==========================================================
  // 6. TAMPILAN HALAMAN
  // ==========================================================

  return (
    <>

      {/* =================================================== */}
      {/* 6.1 HEADER RIWAYAT TRANSAKSI                        */}
      {/* =================================================== */}

      <View style={s.hero}>

        {/* Ikon riwayat transaksi */}
        <Ionicons
          name="receipt"
          size={28}
          color="#fff"
        />

        <View>

          <Text style={s.title}>
            Riwayat Transaksi
          </Text>

          {/* Menampilkan jumlah seluruh transaksi */}
          <Text style={s.sub}>
            {transactions.length} transaksi tercatat
            sebagai audit trail.
          </Text>

        </View>

      </View>

      {/* =================================================== */}
      {/* 6.2 TOMBOL FILTER KATEGORI TRANSAKSI                */}
      {/* =================================================== */}

      <View style={s.filters}>

        {/*
          map() digunakan untuk membuat tombol filter
          berdasarkan daftar FILTERS.

          v = kode kategori transaksi.
          l = label tombol yang ditampilkan.

          Tombol yang sedang dipilih akan menggunakan
          style active dan activeText.
        */}

        {FILTERS.map(([v, l]) => (

          <Pressable
            key={v}
            onPress={() => setFilter(v)}
            style={[
              s.filter,
              filter === v && s.active,
            ]}
          >

            <Text
              style={[
                s.filterText,
                filter === v && s.activeText,
              ]}
            >
              {l}
            </Text>

          </Pressable>

        ))}

      </View>

      {/* =================================================== */}
      {/* 6.3 MEMERIKSA HASIL FILTER                          */}
      {/* =================================================== */}

      {/*
        Jika daftar transaksi kosong:
          Tampilkan EmptyState.

        Jika daftar transaksi tersedia:
          Tampilkan setiap transaksi dalam Card.
      */}

      {list.length === 0 ? (

        <EmptyState
          text="Tidak ada transaksi pada kategori ini."
        />

      ) : (

        // ====================================================
        // 6.4 MENAMPILKAN DAFTAR TRANSAKSI
        // ====================================================

        list.map(t => {

          /**
           * Menentukan arah transaksi.
           *
           * credit > 0:
           *   Transaksi dianggap sebagai dana masuk.
           *
           * credit <= 0:
           *   Transaksi dianggap sebagai dana keluar.
           *
           * Nilai ini digunakan untuk menentukan:
           * - Warna ikon.
           * - Arah panah.
           * - Warna nominal.
           * - Simbol positif atau negatif.
           */

          const incoming = t.credit > 0;

          return (

            <Card key={t.transaction_id}>

              <View style={s.row}>

                {/* ========================================= */}
                {/* 6.5 IKON JENIS TRANSAKSI                 */}
                {/* ========================================= */}

                <View
                  style={[
                    s.icon,
                    {
                      backgroundColor: incoming
                        ? '#ecfdf3'
                        : '#fff6ed',
                    },
                  ]}
                >

                  <Ionicons
                    name={
                      incoming
                        ? 'arrow-down'
                        : 'arrow-up'
                    }
                    size={20}
                    color={
                      incoming
                        ? '#087f5b'
                        : '#b54708'
                    }
                  />

                </View>

                {/* ========================================= */}
                {/* 6.6 INFORMASI TRANSAKSI                  */}
                {/* ========================================= */}

                <View style={{ flex: 1 }}>

                  {/* Kategori transaksi */}
                  <Text style={s.itemTitle}>
                    {t.category.replaceAll('_', ' ')}
                  </Text>

                  {/* Nama anggota dan tanggal transaksi */}
                  <Text style={s.meta}>

                    {/*
                      Mencari nama anggota berdasarkan
                      member_id yang tercatat pada transaksi.

                      Jika anggota ditemukan:
                        Tampilkan nama anggota.

                      Jika tidak ditemukan:
                        Tampilkan member_id.
                    */}

                    {
                      members.find(
                        m => m.member_id === t.member_id
                      )?.name || t.member_id
                    }

                    {' • '}

                    {t.date}

                  </Text>

                  {/* Keterangan transaksi */}
                  <Text style={s.meta}>
                    {t.description}
                  </Text>

                </View>

                {/* ========================================= */}
                {/* 6.7 NOMINAL DEBIT / KREDIT               */}
                {/* ========================================= */}

                {/*
                  Transaksi masuk:
                    Warna hijau.
                    Simbol +.
                    Menggunakan nilai credit.

                  Transaksi keluar:
                    Warna oranye.
                    Simbol -.
                    Menggunakan nilai debit.

                  rupiah() digunakan untuk menampilkan
                  nominal dalam format mata uang Rupiah.
                */}

                <Text
                  style={[
                    s.amount,
                    {
                      color: incoming
                        ? '#087f5b'
                        : '#b54708',
                    },
                  ]}
                >

                  {incoming ? '+ ' : '- '}

                  {rupiah(t.credit || t.debit)}

                </Text>

              </View>

            </Card>

          );

        })

      )}

    </>
  );
}

// ============================================================
// 7. KONFIGURASI STYLE TAMPILAN
// ============================================================

/**
 * StyleSheet digunakan untuk mengatur tampilan
 * halaman riwayat transaksi.
 *
 * Desain menggunakan:
 * - Header abu-abu gelap.
 * - Filter aktif berwarna hijau.
 * - Warna hijau untuk transaksi masuk.
 * - Warna oranye untuk transaksi keluar.
 * - Card dengan tata letak horizontal.
 */

const s = StyleSheet.create({

  // ==========================================================
  // 7.1 HEADER
  // ==========================================================

  hero: {
    backgroundColor: '#344054',
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
    color: '#eaecf0',
    marginTop: 3,
  },

  // ==========================================================
  // 7.2 FILTER TRANSAKSI
  // ==========================================================

  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 12,
  },

  filter: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#eaecf0',
  },

  active: {
    backgroundColor: '#087f5b',
    borderColor: '#087f5b',
  },

  filterText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475467',
  },

  activeText: {
    color: '#fff',
  },

  // ==========================================================
  // 7.3 BARIS TRANSAKSI
  // ==========================================================

  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },

  // ==========================================================
  // 7.4 IKON TRANSAKSI
  // ==========================================================

  icon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ==========================================================
  // 7.5 TEKS INFORMASI TRANSAKSI
  // ==========================================================

  itemTitle: {
    fontWeight: '900',
    fontSize: 13,
    color: '#1d2939',
  },

  meta: {
    fontSize: 11,
    color: '#667085',
    marginTop: 3,
  },

  // ==========================================================
  // 7.6 NOMINAL TRANSAKSI
  // ==========================================================

  amount: {
    fontWeight: '900',
    fontSize: 12,
  },

});
