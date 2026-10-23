/**
 * ============================================================
 *
 * Fitur / konsep utama:
 * 1. Menampilkan daftar akun pengguna.
 * 2. Menampilkan role ADMIN/PETUGAS/PIMPINAN.
 * 3. Menampilkan status akun pengguna.
 * 4. Menampilkan informasi login terakhir.
 * 5. Menampilkan pesan jika data pengguna kosong.
 * ============================================================
 */

// ============================================================
// 1. IMPORT LIBRARY DAN KOMPONEN
// ============================================================

// Library utama React.
import React from 'react';

// Komponen tampilan React Native.
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Library ikon.
import { Ionicons } from '@expo/vector-icons';

// Komponen UI yang digunakan bersama.
import {
  Badge,
  Card,
  EmptyState,
  InfoNote,
} from '../components/UI';

// Tipe data pengguna.
import { User } from '../types';

// ============================================================
// 2. DEFINISI PROPS
// ============================================================

/**
 * Props berisi daftar pengguna yang diterima
 * dari komponen induk, yaitu App.tsx.
 */
type UserManagementScreenProps = {
  users: User[];
};

// ============================================================
// 3. KOMPONEN UTAMA USER MANAGEMENT
// ============================================================

export default function UserManagementScreen({
  users,
}: UserManagementScreenProps) {

  return (
    <>
      {/* ================================================== */}
      {/* 4. HEADER HALAMAN                                  */}
      {/* ================================================== */}

      <View style={s.hero}>

        {/* Ikon hak akses pengguna */}
        <Ionicons
          name="shield-checkmark"
          size={30}
          color="#fff"
        />

        {/* Judul dan informasi role */}
        <View>
          <Text style={s.title}>
            User & Hak Akses
          </Text>

          <Text style={s.sub}>
            ADMIN • PETUGAS • PIMPINAN
          </Text>
        </View>

      </View>

      {/* ================================================== */}
      {/* 5. INFORMASI HAK AKSES                              */}
      {/* ================================================== */}

      <InfoNote>
        ADMIN mengelola seluruh fitur;
        PETUGAS menjalankan transaksi;
        PIMPINAN memiliki akses baca dashboard,
        riwayat, dan laporan.
      </InfoNote>

      {/* Jarak antara informasi dan daftar pengguna */}
      <View style={{ height: 12 }} />

      {/* ================================================== */}
      {/* 6. PEMERIKSAAN DATA PENGGUNA                        */}
      {/* ================================================== */}

      {users.length === 0 ? (

        // Jika tidak terdapat data pengguna.
        <EmptyState />

      ) : (

        // Jika terdapat data, tampilkan seluruh akun.
        users.map(u => (

          <Card key={u.user_id}>

            <View style={s.row}>

              {/* ========================================== */}
              {/* 7. AVATAR PENGGUNA                         */}
              {/* ========================================== */}

              <View style={s.avatar}>
                <Ionicons
                  name="person"
                  size={22}
                  color="#6941c6"
                />
              </View>

              {/* ========================================== */}
              {/* 8. INFORMASI AKUN                          */}
              {/* ========================================== */}

              <View style={{ flex: 1 }}>

                {/* Nama lengkap pengguna */}
                <Text style={s.name}>
                  {u.full_name}
                </Text>

                {/* Username dan role */}
                <Text style={s.meta}>
                  @{u.username} • {u.role}
                </Text>

                {/* Informasi login terakhir */}
                <Text style={s.meta}>
                  Login terakhir:{' '}
                  {u.last_login || 'Belum pernah'}
                </Text>

                {/* Status akun pengguna */}
                <Badge>
                  {u.status}
                </Badge>

              </View>

            </View>

          </Card>

        ))

      )}

    </>
  );
}

// ============================================================
// 9. STYLESHEET
// ============================================================

/**
 * StyleSheet digunakan untuk memisahkan
 * pengaturan tampilan dari logika komponen.
 *
 * Warna utama halaman:
 * Ungu : #6941c6
 */

const s = StyleSheet.create({

  // ----------------------------------------------------------
  // HEADER
  // ----------------------------------------------------------

  hero: {
    backgroundColor: '#6941c6',
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

  // Subjudul role pengguna.
  sub: {
    color: '#eee5ff',
    marginTop: 3,
  },

  // ----------------------------------------------------------
  // DAFTAR PENGGUNA
  // ----------------------------------------------------------

  // Susunan avatar dan informasi pengguna.
  row: {
    flexDirection: 'row',
    gap: 12,
  },

  // Tampilan avatar pengguna.
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#f4f3ff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Nama lengkap pengguna.
  name: {
    fontWeight: '900',
    fontSize: 16,
  },

  // Informasi username, role, dan login.
  meta: {
    color: '#667085',
    marginTop: 3,
    fontSize: 12,
  },

});
