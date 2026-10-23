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
 * 1. Menyimpan alamat REST API Google Apps Script.
 * 2. Menyimpan nama aplikasi.
 * 3. Memusatkan konfigurasi agar mudah dikelola.
 * 4. Memudahkan komunikasi aplikasi dengan server.
 *
 * ============================================================
 */

/**
 * ============================================================
 * 1. KONFIGURASI REST API
 * ============================================================
 *
 * API_URL merupakan alamat Web App Google Apps Script
 * yang digunakan sebagai backend aplikasi koperasi.
 *
 * Alur komunikasi:
 *
 * React Native
 *      |
 *      v
 * API_URL
 *      |
 *      v
 * Google Apps Script REST API
 *      |
 *      v
 * Google Sheets
 *
 * URL diperoleh setelah Google Apps Script
 * berhasil di-deploy sebagai Web App.
 *
 * CATATAN:
 * Jika deployment menggunakan URL baru,
 * sesuaikan nilai API_URL berikut.
 *
 * Jangan mengubah URL yang sudah berjalan
 * apabila tidak ada perubahan deployment.
 * ============================================================
 */

export const API_URL =
  'https://URL Appscript';

/**
 * ============================================================
 * 2. KONFIGURASI NAMA APLIKASI
 * ============================================================
 *
 * APP_NAME menyimpan identitas aplikasi.
 *
 * Konstanta ini dapat digunakan oleh
 * komponen atau halaman aplikasi untuk
 * menampilkan nama aplikasi secara konsisten.
 *
 * Keuntungan:
 *
 * 1. Nama aplikasi dikelola dari satu file.
 * 2. Mengurangi penulisan nama berulang.
 * 3. Memudahkan perubahan nama aplikasi.
 *
 * ============================================================
 */

export const APP_NAME = 'PPNP Koperasi';
