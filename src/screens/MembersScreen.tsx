/**
 * ============================================================
 
 *
 * Fitur / konsep utama:
 * 1. Menampilkan daftar dan identitas anggota.
 * 2. Menampilkan status ACTIVE/INACTIVE.
 * 3. Melakukan pencarian data anggota.
 * 4. Menyediakan aksi tambah/edit khusus ADMIN.
 * 5. Menonaktifkan anggota melalui REST API.
 * 6. Memperbarui data setelah perubahan berhasil.
 * ============================================================
 */

// ============================================================
// 1. IMPORT LIBRARY DAN KOMPONEN
// ============================================================

import React, { useMemo, useState } from 'react';

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

// Mengakses REST API Google Apps Script.
import { api } from '../api/api';

// Komponen antarmuka yang digunakan bersama.
import {
  Badge,
  Btn,
  Card,
  EmptyState,
} from '../components/UI';

// Tipe data aplikasi.
import {
  Member,
  Role,
  ScreenName,
} from '../types';

// ============================================================
// 2. DEFINISI PROPS
// ============================================================

/**
 * Props yang diterima MembersScreen.
 *
 * members:
 *   Daftar anggota dari server.
 *
 * navigate:
 *   Berpindah ke halaman aplikasi.
 *
 * role:
 *   Menentukan hak akses pengguna.
 *
 * onEdit:
 *   Mengirim anggota yang akan diedit.
 *
 * reload:
 *   Mengambil ulang data setelah perubahan.
 */

type MembersScreenProps = {
  members: Member[];
  navigate: (s: ScreenName) => void;
  role: Role;
  onEdit: (m: Member) => void;
  reload: () => Promise<void> | void;
};

// ============================================================
// 3. KOMPONEN UTAMA
// ============================================================

export default function MembersScreen({
  members,
  navigate,
  role,
  onEdit,
  reload,
}: MembersScreenProps) {

  // ----------------------------------------------------------
  // 3.1 STATE PENCARIAN
  // ----------------------------------------------------------

  /**
   * Menyimpan kata kunci pencarian.
   *
   * Nilai awal kosong berarti seluruh anggota
   * ditampilkan.
   */

  const [q, setQ] = useState('');

  // ----------------------------------------------------------
  // 3.2 FILTER DAN PENCARIAN ANGGOTA
  // ----------------------------------------------------------

  /**
   * useMemo digunakan agar proses filter
   * hanya dihitung ulang ketika members
   * atau kata kunci q berubah.
   *
   * Pencarian berdasarkan:
   * - Nama anggota.
   * - Nomor anggota.
   * - Nomor identitas.
   * - Nomor HP.
   *
   * Pencarian tidak membedakan huruf
   * besar dan huruf kecil.
   */

  const list = useMemo(
    () =>
      members.filter(m =>
        `${m.name} ${m.member_no} ${m.identity_no} ${m.phone}`
          .toLowerCase()
          .includes(q.toLowerCase())
      ),
    [members, q]
  );

  // ----------------------------------------------------------
  // 3.3 PROSES NONAKTIFKAN ANGGOTA
  // ----------------------------------------------------------

  /**
   * Menampilkan konfirmasi sebelum
   * menonaktifkan anggota.
   *
   * Anggota tidak dihapus permanen.
   * Riwayat transaksi tetap tersimpan.
   */

  const deactivate = (m: Member) => {
    Alert.alert(
      'Nonaktifkan anggota',

      `Nonaktifkan ${m.name}? Riwayat transaksi tetap tersimpan.`,

      [
        // Tombol membatalkan proses.
        {
          text: 'Batal',
          style: 'cancel',
        },

        // Tombol konfirmasi penonaktifan.
        {
          text: 'Nonaktifkan',
          style: 'destructive',

          onPress: async () => {
            try {

              // Mengirim permintaan ke REST API.
              await api.deactivateMember(m.member_id);

              // Memuat ulang data anggota.
              await reload();

              // Menampilkan informasi berhasil.
              Alert.alert(
                'Berhasil',
                'Anggota dinonaktifkan.'
              );

            } catch (e: any) {

              // Menampilkan pesan jika API gagal.
              Alert.alert(
                'Gagal',
                e.message
              );
            }
          },
        },
      ]
    );
  };

  // ==========================================================
  // 4. TAMPILAN HALAMAN
  // ==========================================================

  return (
    <>

      {/* ====================================================
          4.1 HEADER HALAMAN DATA ANGGOTA
          ==================================================== */}

      <View style={s.top}>

        <View>

          <Text style={s.heading}>
            Data Anggota
          </Text>

          {/* Statistik anggota aktif */}

          <Text style={s.muted}>
            {members.filter(
              x => x.status === 'ACTIVE'
            ).length}{' '}
            anggota aktif dari {members.length} data
          </Text>

        </View>

        {/* Tombol tambah hanya untuk ADMIN */}

        {role === 'ADMIN' && (
          <Pressable
            style={s.add}
            onPress={() => navigate('memberForm')}
          >
            <Ionicons
              name="person-add"
              size={20}
              color="#fff"
            />
          </Pressable>
        )}

      </View>

      {/* ====================================================
          4.2 FORM PENCARIAN ANGGOTA
          ==================================================== */}

      <View style={s.search}>

        <Ionicons
          name="search"
          size={20}
          color="#667085"
        />

        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Cari nama, nomor anggota, NIM/NIP..."
          style={{ flex: 1 }}
        />

      </View>

      {/* ====================================================
          4.3 DAFTAR ANGGOTA
          ==================================================== */}

      {list.length === 0 ? (

        // Ditampilkan jika data tidak ditemukan.
        <EmptyState
          text="Data anggota tidak ditemukan."
        />

      ) : (

        // Menampilkan setiap anggota dalam Card.
        list.map(m => (

          <Card key={m.member_id}>

            <View style={s.row}>

              {/* Ikon/avatar anggota */}

              <View style={s.avatar}>
                <Ionicons
                  name="person"
                  size={22}
                  color="#087f5b"
                />
              </View>

              {/* Informasi anggota */}

              <View style={{ flex: 1 }}>

                <Text style={s.title}>
                  {m.name}
                </Text>

                {/* Nomor anggota dan identitas */}

                <Text style={s.meta}>
                  {m.member_no} • {m.identity_no}
                </Text>

                {/* Nomor telepon dan alamat */}

                <Text style={s.meta}>

                  <Ionicons name="call-outline" />
                  {' '}{m.phone || '-'}

                  {'  •  '}

                  <Ionicons name="location-outline" />
                  {' '}{m.address || '-'}

                </Text>

                {/* Status ACTIVE / INACTIVE */}

                <Badge>
                  {m.status}
                </Badge>

              </View>

            </View>

            {/* ==============================================
                4.4 TOMBOL EDIT DAN NONAKTIFKAN
                ============================================== */}

            {role === 'ADMIN' &&
              m.status === 'ACTIVE' && (

              <View style={s.actions}>

                {/* Tombol edit anggota */}

                <View style={{ flex: 1 }}>
                  <Btn
                    title="Edit"
                    icon="create"
                    variant="secondary"
                    onPress={() => onEdit(m)}
                  />
                </View>

                {/* Tombol nonaktifkan anggota */}

                <View style={{ flex: 1 }}>
                  <Btn
                    title="Nonaktifkan"
                    icon="trash"
                    variant="danger"
                    onPress={() => deactivate(m)}
                  />
                </View>

              </View>

            )}

          </Card>

        ))

      )}

    </>
  );
}

// ============================================================
// 5. STYLESHEET
// ============================================================

/**
 * StyleSheet digunakan untuk memisahkan
 * pengaturan desain dari logika program.
 *
 * Warna utama menggunakan emerald green
 * sesuai tema Project 05.
 */

const s = StyleSheet.create({

  // ----------------------------------------------------------
  // 5.1 HEADER HALAMAN
  // ----------------------------------------------------------

  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  heading: {
    fontSize: 22,
    fontWeight: '900',
    color: '#101828',
  },

  muted: {
    color: '#667085',
    marginTop: 2,
  },

  // ----------------------------------------------------------
  // 5.2 TOMBOL TAMBAH ANGGOTA
  // ----------------------------------------------------------

  add: {
    backgroundColor: '#087f5b',
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ----------------------------------------------------------
  // 5.3 KOLOM PENCARIAN
  // ----------------------------------------------------------

  search: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 13,
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eaecf0',
  },

  // ----------------------------------------------------------
  // 5.4 KARTU DATA ANGGOTA
  // ----------------------------------------------------------

  row: {
    flexDirection: 'row',
    gap: 12,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#ecfdf3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontWeight: '900',
    fontSize: 16,
    color: '#1d2939',
  },

  meta: {
    color: '#667085',
    marginTop: 4,
    fontSize: 12,
  },

  // ----------------------------------------------------------
  // 5.5 TOMBOL AKSI ANGGOTA
  // ----------------------------------------------------------

  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 13,
  },

});
