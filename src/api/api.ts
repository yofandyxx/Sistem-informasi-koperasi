/**
 * ============================================================
 
 * Konsep penting:
 * 1. Client-Server dan REST API
 * 2. HTTP Request GET dan POST
 * 3. JSON Request dan Response
 * 4. Validasi konfigurasi API_URL
 * 5. Error Handling dan Logging
 * 6. Endpoint Anggota, Simpanan, Pinjaman, dan Angsuran
 * 7. Authentication dan User Management
 * ============================================================
 */

// ============================================================
// 1. IMPORT KONFIGURASI DAN TIPE DATA
// ============================================================

// URL deployment Google Apps Script yang digunakan aplikasi.
import { API_URL } from '../constants/config';

// Definisi tipe response dan data koperasi dari TypeScript.
import {
  ApiResponse,
  Installment,
  Loan,
  Member,
  Saving,
  Summary,
  Transaction,
  User,
} from '../types';

// ============================================================
// 2. VALIDASI KONFIGURASI URL REST API
// ============================================================

/**
 * Memastikan API_URL sudah menggunakan alamat Google Apps Script.
 * Jika belum dikonfigurasi, request dihentikan dengan error.
 */
const ensure = () => {
  // Memeriksa awalan URL sebelum melakukan komunikasi server.
  // Validasi bentuk URL saja. ID deployment dapat berubah setiap kali
  // Web App Apps Script dibuat/deploy ulang, sehingga tidak boleh di-hardcode
  // di sini dan berbeda dengan nilai pada config.ts.
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec(?:\?.*)?$/.test(API_URL)) {
    throw new Error(
      'API_URL belum dikonfigurasi. Buka src/constants/config.ts'
    );
  }
};

// ============================================================
// 3. FUNGSI UTAMA HTTP REQUEST KE REST API
// ============================================================

/**
 * Mengirim request ke Google Apps Script dan mengembalikan
 * response sesuai tipe data T yang diminta oleh screen.
 *
 * Parameter:
 * - resource : nama endpoint yang akan diakses.
 * - options  : konfigurasi fetch (method, headers, body).
 * - params   : parameter tambahan pada URL.
 *
 * Response dibaca sebagai text sebelum diproses menjadi JSON.
 * Cara ini membantu mendeteksi halaman HTML/error dari server.
 */
async function request<T>(
  resource: string,
  options?: RequestInit,
  params?: Record<string, string>
): Promise<ApiResponse<T>> {
  // 3.1 Memastikan URL REST API sudah dikonfigurasi.
  ensure();

  // 3.2 Menyusun query string berdasarkan resource dan params.
  // Contoh: ?resource=summary atau ?resource=members.
  const query = new URLSearchParams({
    resource,
    ...(params ?? {}),
  }).toString();

  // Menggabungkan alamat Apps Script dengan query parameter.
  const url = `${API_URL}?${query}`;

  // 3.3 Menampilkan informasi request di Metro Console.
  console.log('======================================');
  console.log('API REQUEST');
  console.log('======================================');
  console.log('Resource :', resource);
  console.log('URL      :', url);
  console.log('Method   :', options?.method ?? 'GET');

  try {
    // 3.4 Mengirim HTTP request menggunakan fetch().
    const response = await fetch(url, options);

    // 3.5 Membaca response sebagai text terlebih dahulu.
    // Jika server mengirim HTML, isi response dapat diperiksa.
    // Membaca response.json() langsung dapat memicu parse error
    // ketika karakter pertama halaman HTML adalah '<'.
    const responseText = await response.text();

    // Menampilkan status HTTP dan isi response dari server.
    console.log('======================================');
    console.log('API RESPONSE');
    console.log('======================================');
    console.log('HTTP Status :', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));
    console.log('Response Text:', responseText);

    // 3.6 Menyiapkan variabel untuk response bertipe ApiResponse<T>.
    let json: ApiResponse<T>;

    try {
      // Mengonversi string response menjadi objek JSON.
      json = JSON.parse(responseText) as ApiResponse<T>;
    } catch (parseError) {
      // Menampilkan response asli jika proses parsing gagal.
      console.log('======================================');
      console.log('RESPONSE BUKAN JSON');
      console.log('======================================');
      console.log(responseText);

      // Response dengan awalan '<' biasanya berupa halaman HTML.
      if (responseText.trim().startsWith('<')) {
        throw new Error(
          'Server mengembalikan halaman HTML, bukan JSON. ' +
          'Periksa Metro Console untuk melihat response server.'
        );
      }

      // Menangani response lain yang tidak dapat diparsing.
      throw new Error(
        'Response server tidak dapat dibaca sebagai JSON. ' +
        'Periksa Metro Console.'
      );
    }

    // 3.7 Memeriksa status keberhasilan dari isi JSON API.
    // Jika success bernilai false, tampilkan pesan dari server.
    if (!json.success) {
      throw new Error(json.message || 'Request gagal.');
    }

    // 3.8 Mengembalikan data response kepada screen pemanggil.
    return json;
  } catch (error: any) {
    // 3.9 Mencatat error jaringan, parsing, atau validasi API.
    console.log('======================================');
    console.log('API ERROR');
    console.log('======================================');
    console.log('Resource:', resource);
    console.log('Message :', error?.message);

    // Error diteruskan agar screen dapat menampilkan Alert.
    throw error;
  }
}

// ============================================================
// 4. HELPER UNTUK HTTP POST
// ============================================================

/**
 * Mengirim data transaksi atau autentikasi menggunakan POST.
 * Google Apps Script menerima body JSON sebagai text.
 */
const post = <T>(resource: string, body: any) => {
  // Memanggil request() dengan method POST dan body JSON.
  return request<T>(resource, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(body),
  });
};

// ============================================================
// 5. KUMPULAN ENDPOINT APLIKASI KOPERASI
// ============================================================

/**
 * Seluruh fungsi komunikasi API dikumpulkan dalam object api.
 * Dengan demikian screen tidak perlu membuat fetch sendiri.
 * Contoh: api.summary(), api.members(), atau api.login().
 */
export const api = {
  // ==========================================================
  // 5.1 DASHBOARD - RINGKASAN OPERASIONAL
  // ==========================================================

  // Mengambil statistik anggota, simpanan, dan pinjaman.
  summary: () => request<Summary>('summary'),

  // ==========================================================
  // 5.2 ANGGOTA - MASTER DATA KOPERASI
  // ==========================================================

  // Mengambil daftar seluruh anggota koperasi.
  members: () => request<Member[]>('members'),

  // Menambahkan anggota baru melalui aksi create.
  createMember: (data: Partial<Member>) =>
    post<Member>('members', {
      action: 'create',
      ...data,
    }),

  // Memperbarui informasi anggota melalui aksi update.
  updateMember: (data: Partial<Member>) =>
    post<Member>('members', {
      action: 'update',
      ...data,
    }),

  // Menonaktifkan anggota berdasarkan member_id.
  deactivateMember: (memberId: string) =>
    post<Member>('members', {
      action: 'deactivate',
      member_id: memberId,
    }),

  // ==========================================================
  // 5.3 TRANSAKSI - RIWAYAT DAN AUDIT TRAIL
  // ==========================================================

  // Mengambil riwayat transaksi yang dicatat oleh server.
  transactions: () => request<Transaction[]>('transactions'),

  // ==========================================================
  // 5.4 SIMPANAN - SETOR DAN TARIK
  // ==========================================================

  // Mengirim transaksi simpanan untuk diproses server.
  addSaving: (data: Partial<Saving>) =>
    post<Saving>('savings', {
      action: 'create',
      ...data,
    }),

  // ==========================================================
  // 5.5 PINJAMAN - DATA DAN PENGAJUAN
  // ==========================================================

  // Mengambil daftar pinjaman anggota koperasi.
  loans: () => request<Loan[]>('loans'),

  // Membuat transaksi pinjaman baru.
  createLoan: (data: Partial<Loan>) =>
    post<Loan>('loans', {
      action: 'create',
      ...data,
    }),

  // ==========================================================
  // 5.6 ANGSURAN - PEMBAYARAN PINJAMAN
  // ==========================================================

  // Mengirim pembayaran angsuran untuk diproses server.
  addInstallment: (data: Partial<Installment>) =>
    post<Installment>('installments', {
      action: 'create',
      ...data,
    }),

  // ==========================================================
  // 5.7 USER MANAGEMENT - DAFTAR PENGGUNA
  // ==========================================================

  // Mengambil daftar akun pengguna dari REST API.
  users: () => request<User[]>('users'),

  // ==========================================================
  // 5.8 AUTHENTICATION - LOGIN PENGGUNA
  // ==========================================================

  // Mengirim username dan password untuk divalidasi server.
  login: (username: string, password: string) =>
    post<User>('auth', {
      action: 'login',
      username,
      password,
    }),
};
