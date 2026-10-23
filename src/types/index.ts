/**
 * ============================================================
 *
 *
 * Fitur / konsep utama:
 * 1. ScreenName dan Role.
 * 2. User, Member, Saving, Loan, dan Installment.
 * 3. Transaction dan Summary.
 * 4. Generic ApiResponse<T>.
 *
 * Tujuan:
 * Menjaga konsistensi struktur data antara aplikasi
 * React Native, REST API, dan Google Sheets.
 * ============================================================
 */
  
// ============================================================
// 1. TYPE SCREEN NAME
// ============================================================

/**
 * ScreenName menentukan nama halaman yang dapat
 * ditampilkan melalui navigasi aplikasi.
 *
 * Digunakan oleh App.tsx dan berbagai screen
 * untuk berpindah halaman.
 *
 * Contoh:
 * navigate('dashboard');
 * navigate('members');
 * navigate('history');
 */
export type ScreenName =
  | 'dashboard'
  | 'members'
  | 'memberForm'
  | 'savings'
  | 'loans'
  | 'installment'
  | 'history'
  | 'reports'
  | 'users';

// ============================================================
// 2. TYPE ROLE PENGGUNA
// ============================================================

/**
 * Role menentukan kelompok hak akses pengguna.
 *
 * ADMIN:
 * Mengelola data dan fitur administrasi koperasi.
 *
 * PETUGAS:
 * Menjalankan kegiatan operasional dan transaksi.
 *
 * PIMPINAN:
 * Melihat informasi dashboard, riwayat,
 * dan laporan sesuai hak akses.
 *
 * Pembatasan akses diterapkan oleh logika aplikasi
 * dan harus divalidasi kembali pada sisi server.
 */
export type Role =
  | 'ADMIN'
  | 'PETUGAS'
  | 'PIMPINAN';

// ============================================================
// 3. INTERFACE USER
// ============================================================

/**
 * User mendefinisikan struktur data akun pengguna.
 *
 * Data digunakan pada:
 * - LoginScreen.tsx
 * - UserManagementScreen.tsx
 * - DashboardScreen.tsx
 * - App.tsx
 *
 * Tanda ? menunjukkan properti opsional.
 */
export interface User {

  // ID unik akun pengguna.
  user_id: string;

  // Username untuk login.
  username: string;

  // Nama lengkap pengguna.
  full_name: string;

  // Hak akses pengguna.
  role: Role;

  // Status akun pengguna.
  status: string;

  // Waktu login terakhir (opsional).
  last_login?: string;

  // Waktu pembuatan akun (opsional).
  created_at?: string;
}

// ============================================================
// 4. INTERFACE MEMBER
// ============================================================

/**
 * Member mendefinisikan struktur data anggota koperasi.
 *
 * Data digunakan pada:
 * - MembersScreen.tsx
 * - MemberFormScreen.tsx
 * - MemberPicker.tsx
 * - SavingsScreen.tsx
 * - LoansScreen.tsx
 *
 * Setiap anggota memiliki member_id sebagai
 * identitas unik untuk menghubungkan transaksi.
 */
export interface Member {

  // ID unik anggota.
  member_id: string;

  // Nomor keanggotaan koperasi.
  member_no: string;

  // Nama lengkap anggota.
  name: string;

  // Nomor identitas anggota (NIM/NIP/identitas lain).
  identity_no: string;

  // Nomor telepon anggota.
  phone: string;

  // Alamat anggota.
  address: string;

  // Tanggal bergabung menjadi anggota.
  join_date: string;

  // Status keanggotaan, misalnya ACTIVE/INACTIVE.
  status: string;

  // Waktu pencatatan data (opsional).
  created_at?: string;
}

// ============================================================
// 5. INTERFACE SAVING
// ============================================================

/**
 * Saving mendefinisikan struktur transaksi simpanan.
 *
 * Digunakan oleh SavingsScreen.tsx untuk
 * mencatat setoran dan penarikan simpanan.
 *
 * Contoh type transaksi:
 * - DEPOSIT    : Setoran simpanan.
 * - WITHDRAWAL : Penarikan simpanan.
 */
export interface Saving {

  // ID unik transaksi simpanan.
  saving_id: string;

  // ID anggota yang melakukan transaksi.
  member_id: string;

  // Tanggal transaksi simpanan.
  date: string;

  // Jenis transaksi DEPOSIT/WITHDRAWAL.
  type: string;

  // Nominal transaksi.
  amount: number;

  // Keterangan tambahan transaksi.
  note: string;

  // Waktu pencatatan transaksi (opsional).
  created_at?: string;
}

// ============================================================
// 6. INTERFACE LOAN
// ============================================================

/**
 * Loan mendefinisikan struktur data pinjaman.
 *
 * Digunakan oleh:
 * - LoansScreen.tsx
 * - InstallmentScreen.tsx
 *
 * Informasi pinjaman mencakup:
 * - Pokok pinjaman.
 * - Tenor atau jangka waktu.
 * - Persentase jasa.
 * - Total kewajiban.
 * - Total pembayaran.
 * - Sisa pinjaman.
 * - Status pinjaman.
 */
export interface Loan {

  // ID unik pinjaman.
  loan_id: string;

  // ID anggota peminjam.
  member_id: string;

  // Tanggal pengajuan/pencatatan pinjaman.
  date: string;

  // Nominal pokok pinjaman.
  principal: number;

  // Lama pinjaman dalam bulan.
  tenor_months: number;

  // Persentase jasa pinjaman.
  service_rate: number;

  // Total kewajiban pembayaran.
  total_due: number;

  // Total angsuran yang sudah dibayarkan.
  paid_amount: number;

  // Sisa kewajiban pinjaman.
  remaining_amount: number;

  // Status pinjaman, misalnya ACTIVE/PAID.
  status: string;

  // Catatan atau keterangan pinjaman.
  note: string;

  // Waktu pencatatan pinjaman (opsional).
  created_at?: string;
}

// ============================================================
// 7. INTERFACE INSTALLMENT
// ============================================================

/**
 * Installment mendefinisikan struktur pembayaran
 * angsuran terhadap pinjaman anggota.
 *
 * Digunakan oleh InstallmentScreen.tsx.
 *
 * Setiap angsuran terhubung dengan:
 * - loan_id   : Pinjaman yang dibayar.
 * - member_id : Anggota pemilik pinjaman.
 */
export interface Installment {

  // ID unik transaksi angsuran.
  installment_id: string;

  // ID pinjaman yang dibayar.
  loan_id: string;

  // ID anggota yang membayar angsuran.
  member_id: string;

  // Tanggal pembayaran angsuran.
  date: string;

  // Nominal pembayaran angsuran.
  amount: number;

  // Keterangan pembayaran.
  note: string;

  // Waktu pencatatan pembayaran (opsional).
  created_at?: string;
}

// ============================================================
// 8. INTERFACE TRANSACTION
// ============================================================

/**
 * Transaction mendefinisikan struktur riwayat
 * transaksi keuangan koperasi.
 *
 * Digunakan oleh:
 * - TransactionHistoryScreen.tsx
 * - DashboardScreen.tsx
 *
 * Data ini digunakan sebagai audit trail
 * untuk menelusuri aktivitas transaksi.
 *
 * Contoh kategori:
 * - SAVING_DEPOSIT
 * - SAVING_WITHDRAWAL
 * - LOAN_DISBURSEMENT
 * - INSTALLMENT
 */
export interface Transaction {

  // ID unik transaksi.
  transaction_id: string;

  // ID anggota terkait transaksi.
  member_id: string;

  // Tanggal transaksi.
  date: string;

  // Kategori transaksi.
  category: string;

  // ID referensi transaksi asal.
  reference_id: string;

  // Nilai transaksi pada kolom debit.
  debit: number;

  // Nilai transaksi pada kolom kredit.
  credit: number;

  // Deskripsi atau keterangan transaksi.
  description: string;

  // Waktu pencatatan transaksi (opsional).
  created_at?: string;
}

// ============================================================
// 9. INTERFACE SUMMARY
// ============================================================

/**
 * Summary mendefinisikan struktur ringkasan
 * statistik operasional dan keuangan koperasi.
 *
 * Digunakan oleh:
 * - DashboardScreen.tsx
 * - ReportScreen.tsx
 *
 * Data ringkasan diperoleh melalui REST API
 * Google Apps Script.
 */
export interface Summary {

  // Jumlah seluruh anggota terdaftar.
  total_members: number;

  // Jumlah anggota berstatus aktif.
  active_members: number;

  // Total simpanan bersih anggota.
  total_savings: number;

  // Total pokok pinjaman yang telah dicatat.
  total_loan_principal: number;

  // Total sisa kewajiban pinjaman.
  total_loan_remaining: number;

  // Total pembayaran angsuran yang diterima.
  total_installments: number;

  // Jumlah pinjaman yang masih aktif.
  active_loans: number;
}

// ============================================================
// 10. GENERIC INTERFACE API RESPONSE
// ============================================================

/**
 * ApiResponse<T> mendefinisikan format standar
 * response dari Google Apps Script REST API.
 *
 * Huruf T merupakan generic type.
 *
 * Artinya, properti data dapat berisi berbagai
 * tipe sesuai endpoint yang dipanggil.
 *
 * Contoh:
 *
 * ApiResponse<User>
 * ApiResponse<Member[]>
 * ApiResponse<Loan[]>
 * ApiResponse<Summary>
 *
 * Struktur response:
 *
 * {
 *   success: true,
 *   message: "Berhasil",
 *   data: ...
 * }
 */
export interface ApiResponse<T> {

  // Menunjukkan keberhasilan operasi API.
  success: boolean;

  // Pesan hasil pemrosesan request.
  message: string;

  // Data response sesuai tipe generic T.
  data: T;
}
