# PPNP Koperasi

Aplikasi mobile Sistem Informasi Koperasi untuk membantu pengelolaan anggota, simpanan, pinjaman, angsuran, transaksi, laporan, dan pengguna koperasi.

Aplikasi dibangun menggunakan **Expo** dan **React Native**, dengan Google Apps Script sebagai REST API dan Google Sheets sebagai penyimpanan data.

## Fitur Utama

- Login pengguna berbasis role.
- Dashboard ringkasan operasional koperasi.
- Manajemen data anggota.
- Pencatatan simpanan masuk dan penarikan.
- Pengelolaan pinjaman anggota.
- Pencatatan pembayaran angsuran.
- Riwayat transaksi dan audit trail.
- Laporan ringkasan koperasi.
- Manajemen pengguna untuk administrator.
- Pull-to-refresh untuk memperbarui data dari server.
- Pembatasan akses berdasarkan role pengguna.

## Role Pengguna

| Role | Hak Akses |
| --- | --- |
| `ADMIN` | Akses seluruh fitur, termasuk manajemen anggota dan pengguna |
| `PETUGAS` | Mengelola transaksi operasional koperasi |
| `PIMPINAN` | Melihat dashboard, riwayat transaksi, dan laporan |

> Pembatasan pada aplikasi adalah lapisan antarmuka. Validasi role tetap harus diterapkan pada sisi Google Apps Script/API.

## Teknologi

- React Native `0.86`
- Expo SDK `57`
- TypeScript
- React Navigation
- Expo Vector Icons
- Google Apps Script Web App
- Google Sheets

## Instalasi

Persyaratan: Node.js, npm, serta Android Studio/emulator untuk Android atau Xcode untuk iOS.

```bash
cd PPNPCooperativeInformation
npm install
```

## Konfigurasi API

Alamat backend berada di `src/constants/config.ts`. Sesuaikan `API_URL` dengan URL deployment Google Apps Script Web App:

```ts
export const API_URL =
  'https://script.google.com/macros/s/DEPLOYMENT_ID/exec';
```

API diharapkan mengembalikan format JSON berikut:

```json
{
  "success": true,
  "message": "Berhasil",
  "data": {}
}
```

Resource yang digunakan: `summary`, `members`, `savings`, `loans`, `installments`, `transactions`, `users`, dan `auth`.

## Menjalankan Aplikasi

```bash
npm start
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

Setelah server berjalan, tekan tombol yang sesuai pada terminal Expo atau scan QR code menggunakan Expo Go.

## Struktur Direktori

```text
PPNPCooperativeInformation/
├── assets/                 # Ikon dan aset aplikasi
├── src/
│   ├── api/                # Komunikasi REST API
│   ├── components/         # Komponen UI reusable
│   ├── constants/          # Konfigurasi aplikasi dan API
│   ├── screens/            # Halaman aplikasi
│   ├── types/              # Definisi tipe TypeScript
│   └── utils/              # Fungsi utilitas
├── App.tsx                 # Root aplikasi dan navigasi utama
├── app.json                # Konfigurasi Expo
├── package.json            # Dependency dan script proyek
└── tsconfig.json           # Konfigurasi TypeScript
```

## Pemeriksaan Kode

```bash
npx tsc --noEmit
```

Jika tidak ada output error, kode TypeScript berhasil diperiksa.

## Troubleshooting

### API tidak dapat terhubung

1. Pastikan perangkat memiliki koneksi internet.
2. Pastikan `API_URL` benar dan berakhiran `/exec`.
3. Pastikan Google Apps Script telah di-deploy sebagai Web App.
4. Pastikan izin akses deployment sesuai kebutuhan.
5. Periksa log Metro untuk melihat response API.

### Response API bukan JSON

Pastikan URL mengarah ke endpoint `/exec`, bukan URL editor Google Apps Script. Response harus memiliki properti `success`, `message`, dan `data`.

### Ikon tidak tampil atau TypeScript error

Jalankan kembali `npm install`. Aplikasi menggunakan dependency `@expo/vector-icons`.

## Catatan Keamanan

- Jangan menyimpan password atau secret API di repository publik.
- Jangan mengandalkan pembatasan role di sisi aplikasi saja.
- Validasi input dan hak akses harus dilakukan kembali di Google Apps Script.
- Amankan deployment API sebelum digunakan di lingkungan produksi.

## Lisensi

Lihat file [LICENSE](LICENSE) untuk informasi lisensi proyek.
