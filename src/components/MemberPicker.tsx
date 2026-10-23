/**
 * ============================================================
 * PROJECT 05 - SISTEM INFORMASI KOPERASI
 * ============================================================
 *
 
 *
 * ============================================================
 * FITUR / KONSEP UTAMA
 * ============================================================
 *
 * 1. Menerima daftar anggota dari parent component.
 * 2. Memfilter anggota dengan status ACTIVE.
 * 3. Membentuk daftar pilihan untuk Dropdown.
 * 4. Menampilkan nama dan identitas anggota.
 * 5. Mengirim member_id anggota yang dipilih.
 * 6. Menggunakan kembali komponen Dropdown.
 *
 * ============================================================
 * ALUR PROGRAM
 * ============================================================
 *
 * Parent Component
 *        |
 *        v
 * MemberPicker
 *        |
 *        v
 * Menerima members
 *        |
 *        v
 * Filter status ACTIVE
 *        |
 *        v
 * Membentuk options
 *        |
 *        v
 * Menampilkan Dropdown
 *        |
 *        v
 * Pengguna memilih anggota
 *        |
 *        v
 * onChange(member_id)
 *        |
 *        v
 * Parent Component menerima member_id
 *
 * ============================================================
 */


// ============================================================
// 1. IMPORT LIBRARY DAN KOMPONEN
// ============================================================

/**
 * React digunakan untuk membuat komponen
 * antarmuka berbasis fungsi.
 */
import React from 'react';

/**
 * Member merupakan tipe data anggota koperasi
 * yang didefinisikan pada folder types.
 */
import { Member } from '../types';

/**
 * Dropdown merupakan komponen reusable
 * yang digunakan untuk menampilkan
 * daftar pilihan dalam bentuk Modal.
 */
import Dropdown from './Dropdown';


// ============================================================
// 2. DEFINISI PROPS KOMPONEN
// ============================================================

/**
 * Props merupakan data yang dikirim
 * dari parent component ke MemberPicker.
 *
 * members:
 *   Daftar seluruh anggota koperasi.
 *
 * value:
 *   member_id anggota yang sedang dipilih.
 *
 * onChange:
 *   Callback untuk mengirim member_id
 *   anggota terpilih ke parent component.
 */
type MemberPickerProps = {

    // Daftar anggota koperasi.
    members: Member[];

    // ID anggota yang sedang dipilih.
    value: string;

    // Callback ketika pilihan berubah.
    onChange: (id: string) => void;

};


// ============================================================
// 3. KOMPONEN UTAMA MEMBER PICKER
// ============================================================

/**
 * MemberPicker digunakan pada halaman
 * yang membutuhkan pemilihan anggota.
 *
 * Contoh penggunaan:
 *
 * - Transaksi Simpanan
 * - Pembuatan Pinjaman
 * - Pembayaran Angsuran
 *
 * Komponen ini hanya menampilkan
 * anggota yang berstatus ACTIVE.
 */
export default function MemberPicker({

    members,
    value,
    onChange,

}: MemberPickerProps) {


    // ========================================================
    // 4. FILTER ANGGOTA AKTIF
    // ========================================================

    /**
     * Mengambil anggota dengan status ACTIVE.
     *
     * Anggota yang berstatus INACTIVE
     * tidak dimasukkan ke daftar pilihan.
     *
     * Contoh:
     *
     * Ahmad Fauzan  -> ACTIVE
     * Putri Andriani -> ACTIVE
     * Fahira Zahra   -> INACTIVE
     *
     * Hasil:
     *
     * Ahmad Fauzan
     * Putri Andriani
     */
    const options = members

        .filter(
            (member) => member.status === 'ACTIVE'
        )


        // ====================================================
        // 5. MEMBENTUK DATA PILIHAN DROPDOWN
        // ====================================================

        /**
         * Mengubah setiap anggota aktif
         * menjadi format DropOption.
         *
         * Struktur pilihan:
         *
         * value:
         *   member_id
         *
         * label:
         *   name
         *
         * description:
         *   member_no dan identity_no
         *
         * Contoh tampilan:
         *
         * Ahmad Fauzan
         * AGT-001 • 2401001
         *
         * Nilai yang dikirim:
         *
         * MEM-001
         */
        .map((member) => ({

            // ID unik anggota.
            value: member.member_id,

            // Nama anggota.
            label: member.name,

            // Nomor anggota dan nomor identitas.
            description:
                `${member.member_no} • ${member.identity_no}`,

        }));


    // ========================================================
    // 6. MENAMPILKAN KOMPONEN DROPDOWN
    // ========================================================

    /**
     * Dropdown menerima:
     *
     * label:
     *   Judul field pemilihan anggota.
     *
     * value:
     *   ID anggota yang sedang dipilih.
     *
     * options:
     *   Daftar anggota aktif.
     *
     * onChange:
     *   Callback untuk mengirim ID anggota.
     *
     * placeholder:
     *   Teks ketika belum ada anggota dipilih.
     *
     * Tanda * pada label menunjukkan
     * bahwa field anggota wajib diisi.
     */
    return (

        <Dropdown

            label="Pilih anggota *"

            value={value}

            options={options}

            onChange={onChange}

            placeholder="Pilih anggota aktif"

        />

    );

}


// ============================================================
// AKHIR FILE MemberPicker.tsx
// ============================================================
