/**
 * ============================================================
 
 *
 * Fitur / konsep utama:
 * 1. Mengubah angka menjadi format mata uang Rupiah.
 * 2. Menghasilkan tanggal dengan format YYYY-MM-DD.
 * 3. Menyediakan fungsi yang dapat digunakan bersama
 *    oleh berbagai screen aplikasi.
 *
 * Tujuan:
 * Menjaga konsistensi penulisan nominal uang dan tanggal
 * tanpa mengulangi kode pada setiap screen.
 * ============================================================
 */

// ============================================================
// 1. FUNGSI FORMAT RUPIAH
// ============================================================

/**
 * Fungsi rupiah() digunakan untuk mengubah nilai angka
 * menjadi tampilan mata uang Rupiah.
 *
 * Parameter:
 * n : number
 *     Nilai angka yang akan diformat.
 *
 * Nilai default:
 * n = 0
 *
 * Proses:
 * 1. Menerima nilai angka.
 * 2. Menggunakan nilai 0 jika input bernilai falsy.
 * 3. Mengonversi nilai menjadi Number.
 * 4. Memformat angka menggunakan locale Indonesia.
 * 5. Menambahkan awalan "Rp ".
 *
 * Contoh:
 * rupiah(100000)  -> "Rp 100.000"
 * rupiah(2500000) -> "Rp 2.500.000"
 * rupiah(0)       -> "Rp 0"
 * rupiah()        -> "Rp 0"
 */
export const rupiah = (n: number = 0) => {

  // Mengubah angka ke format Indonesia.
  const formatted = Number(n || 0).toLocaleString('id-ID');

  // Menambahkan simbol mata uang Rupiah.
  return 'Rp ' + formatted;
};

// ============================================================
// 2. FUNGSI TANGGAL HARI INI
// ============================================================

/**
 * Fungsi today() digunakan untuk menghasilkan
 * tanggal saat ini dalam format YYYY-MM-DD.
 *
 * Fungsi ini digunakan ketika aplikasi mencatat:
 * - Tanggal pendaftaran anggota.
 * - Tanggal transaksi simpanan.
 * - Tanggal pengajuan pinjaman.
 * - Tanggal pembayaran angsuran.
 *
 * Proses:
 * 1. Membuat objek Date.
 * 2. Mengubah tanggal menjadi format ISO.
 * 3. Mengambil 10 karakter pertama.
 *
 * Contoh hasil:
 * "2026-10-11"
 *
 * Catatan:
 * toISOString() menggunakan waktu UTC,
 * bukan waktu lokal perangkat.
 */
export const today = () => {

  // Mengambil tanggal dan waktu saat ini.
  const currentDate = new Date();

  // Mengubah tanggal menjadi format ISO.
  const isoDate = currentDate.toISOString();

  // Mengambil bagian YYYY-MM-DD.
  return isoDate.slice(0, 10);
};
