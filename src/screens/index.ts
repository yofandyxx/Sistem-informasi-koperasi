/**
 *
 *
 * Fitur / konsep utama:
 * 1. Mengumpulkan seluruh screen aplikasi.
 * 2. Menyederhanakan proses import pada App.tsx.
 * 3. Mendukung struktur program modular.
 * 4. Memudahkan pemeliharaan dan pengembangan aplikasi.
 *
 * Konsep pembelajaran:
 * - TypeScript Module
 * - Named Export
 * - Default Export
 * - Re-export
 * - Barrel File
 * - Modular Programming
 * ============================================================
 */

// ============================================================
// 1. DASHBOARD
// ============================================================

/**
 * DashboardScreen
 *
 * Menampilkan ringkasan operasional koperasi,
 * statistik anggota, simpanan, pinjaman,
 * aktivitas terbaru, dan akses cepat sesuai role.
 */
export { default as DashboardScreen } from './DashboardScreen';

// ============================================================
// 2. MANAJEMEN ANGGOTA
// ============================================================

/**
 * MembersScreen
 *
 * Menampilkan daftar anggota koperasi,
 * pencarian, dan pengelolaan anggota
 * berdasarkan hak akses pengguna.
 */
export { default as MembersScreen } from './MembersScreen';

/**
 * MemberFormScreen
 *
 * Menyediakan formulir tambah dan edit anggota
 * serta validasi data anggota koperasi.
 */
export { default as MemberFormScreen } from './MemberFormScreen';

// ============================================================
// 3. TRANSAKSI SIMPANAN
// ============================================================

/**
 * SavingsScreen
 *
 * Menangani transaksi setor dan tarik simpanan,
 * validasi transaksi, dan informasi saldo anggota.
 */
export { default as SavingsScreen } from './SavingsScreen';

// ============================================================
// 4. TRANSAKSI PINJAMAN
// ============================================================

/**
 * LoansScreen
 *
 * Menampilkan dan mengelola pinjaman anggota,
 * termasuk pembuatan pinjaman dan informasi
 * status pinjaman.
 */
export { default as LoansScreen } from './LoansScreen';

// ============================================================
// 5. TRANSAKSI ANGSURAN
// ============================================================

/**
 * InstallmentScreen
 *
 * Menangani pembayaran angsuran pinjaman
 * dan menampilkan informasi sisa pinjaman.
 */
export { default as InstallmentScreen } from './InstallmentScreen';

// ============================================================
// 6. RIWAYAT TRANSAKSI
// ============================================================

/**
 * TransactionHistoryScreen
 *
 * Menampilkan riwayat transaksi koperasi
 * dan mendukung pencarian atau filter transaksi.
 */
export { default as TransactionHistoryScreen } from './TransactionHistoryScreen';

// ============================================================
// 7. LAPORAN KOPERASI
// ============================================================

/**
 * ReportScreen
 *
 * Menampilkan laporan dan ringkasan
 * informasi operasional koperasi.
 */
export { default as ReportScreen } from './ReportScreen';

// ============================================================
// 8. AUTENTIKASI PENGGUNA
// ============================================================

/**
 * LoginScreen
 *
 * Menyediakan halaman login pengguna
 * melalui REST API Google Apps Script.
 *
 * Mendukung autentikasi berdasarkan
 * username, password, dan role pengguna.
 */
export { default as LoginScreen } from './LoginScreen';

// ============================================================
// 9. MANAJEMEN PENGGUNA
// ============================================================

/**
 * UserManagementScreen
 *
 * Menampilkan fitur pengelolaan akun pengguna
 * koperasi yang dibatasi untuk role ADMIN.
 */
export { default as UserManagementScreen } from './UserManagementScreen';

// ============================================================
// 10. KESIMPULAN
// ============================================================

/**
 * Seluruh screen di atas diekspor melalui index.ts.
 *
 * Dengan demikian, App.tsx dapat mengimpor
 * beberapa screen dari satu lokasi:
 *
 * import {
 *   DashboardScreen,
 *   MembersScreen,
 *   LoginScreen,
 * } from './src/screens';
 *
 * Keuntungan:
 * 1. Import lebih ringkas.
 * 2. Struktur program lebih rapi.
 * 3. Screen lebih mudah dikelola.
 * 4. Memudahkan penambahan screen baru.
 *
 * File ini tidak menjalankan proses bisnis.
 * File ini hanya mengatur ekspor modul.
 * ============================================================
 */
