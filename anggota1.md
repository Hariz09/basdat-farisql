Tentu, berikut adalah keseluruhan spesifikasi dan arsitektur dalam format murni Markdown. Anda dapat langsung menyalin isi di dalam kotak ini dan menyimpannya sebagai file `README.md` atau `REQUIREMENTS.md`.

```markdown
# Spesifikasi Kebutuhan & Arsitektur Frontend: Modul Pengguna, Dashboard & Navigasi

Dokumen ini merangkum kebutuhan sistem untuk manajemen pengguna (autentikasi, profil), struktur navigasi (Navbar), dan tampilan dashboard berbasis peran (*role-based*), beserta panduan arsitektur implementasinya menggunakan Next.js App Router.

---

## 1. Spesifikasi Kebutuhan Sistem (SRS)

### A. Kebutuhan Navigasi (Navbar)
Navbar digunakan oleh pengguna untuk mengakses berbagai modul dan fitur di dalam sistem. Tampilan dan menu Navbar menyesuaikan dengan status autentikasi dan *role* pengguna:

1. **Navbar Guest (Belum Login):**
   * Login
   * Registrasi
2. **Navbar Admin (Login):**
   * Dashboard
   * Manajemen Venue
   * Manajemen Kursi
   * Kategori Tiket
   * Manajemen Tiket
   * Semua Order
   * Tiket (Aset)
   * Order (Aset)
   * Profile (Termasuk akses Logout)
3. **Navbar Organizer (Login):**
   * Dashboard
   * Event Saya
   * Manajemen Venue
   * Manajemen Kursi
   * Kategori Tiket
   * Manajemen Tiket
   * Semua Order
   * Tiket (Aset)
   * Order (Aset)
   * Profile (Termasuk akses Logout)
4. **Navbar Customer (Login):**
   * Dashboard
   * Tiket Saya
   * Pesanan
   * Cari Event
   * Promosi
   * Venue
   * Artis
   * Logout

### B. Autentikasi Publik (Login & Registrasi)
Sistem memisahkan area publik (tanpa sesi) dan area privat (wajib sesi).
* **Registrasi:** Pendaftaran tersedia untuk **Organizer** dan **Customer**. (Akun *Admin* dibuat secara internal, tidak melalui form publik).
  * **Form Organizer:** Wajib mengisi Nama Lengkap, Email, Nomor Telepon, Username, Password (min. 6 karakter), Konfirmasi Password, dan Setuju Syarat & Ketentuan.
  * **Form Customer:** Mengisi field data diri pelanggan standar.
  * *Validasi:* Seluruh form wajib diisi. Jika sukses, arahkan pengguna ke halaman Login.
* **Login:** Menggunakan Email dan Password.
  * *Aksi:* Validasi kredensial -> Simpan *session* -> Redirect ke *route* Dashboard sesuai dengan *role* pengguna.

### C. Dashboard Pengguna (Role-Based)
Setiap peran memiliki metrik dan tampilan informasi yang berbeda pada halaman utama mereka.
1. **Admin Dashboard:**
   * Menampilkan *System Console*.
   * **Metrik Utama:** Total Pengguna, Total Acara, Omzet Platform, Promosi Aktif.
   * **Tabel/List:** Ringkasan Infrastruktur Venue & Ringkasan Marketing & Promosi.
2. **Organizer Dashboard:**
   * Menampilkan Nama Organizer dan tombol aksi cepat (Kelola Acara, Venue).
   * **Metrik Utama:** Acara Aktif, Tiket Terjual, Revenue Bulan Ini, Venue Mitra.
   * **Tabel/List:** Performa Acara (Status, % terjual, lokasi).
3. **Customer Dashboard:**
   * Menampilkan Nama Pelanggan dan ucapan selamat datang.
   * **Metrik Utama:** Tiket Aktif, Acara Diikuti, Kode Promo, Total Belanja.
   * **Tabel/List:** Tiket Mendatang.

### D. Manajemen Profil & Kata Sandi
Akses melalui menu **Profile** pada Navbar. Pengguna dapat keluar sistem via tombol **Logout**.
* **Edit Profil:**
  * **Aturan Global:** *Username* bersifat *read-only* (tidak dapat diubah oleh siapapun).
  * **Customer:** Hanya diizinkan mengubah *Nama Lengkap* dan *Nomor Telepon*.
  * **Organizer:** Hanya diizinkan mengubah *Nama Organizer* dan *Contact Email*.
* **Update Password:**
  * Tersedia untuk semua peran.
  * Membutuhkan: Password Lama, Password Baru, Konfirmasi Password Baru.
  * Jika berhasil, tampilkan pesan sukses (tidak perlu relogin).

---

UNTUK POIN 2 dan 3 ini hanya contoh, jika kamu bisa memikirkan yang lebih baik silakan diubah

## 2. Arsitektur Routing (Next.js App Router)

Sistem menggunakan segmentasi URL berdasarkan *role* pengguna dengan proteksi *Middleware*.

```text
app/
├── (auth)/                          # Area Publik (Navbar Guest)
│   ├── layout.tsx                   # Layout Auth polos dengan Guest Navbar
│   ├── login/page.tsx               # URL: /login
│   └── register/
│       ├── page.tsx                 # URL: /register (Pilih Role)
│       ├── organizer/page.tsx       # URL: /register/organizer
│       └── customer/page.tsx        # URL: /register/customer
│
├── admin/                           # Area Privat: Admin
│   ├── layout.tsx                   # Memanggil Admin Navbar
│   └── dashboard/page.tsx           # URL: /admin/dashboard
│
├── organizer/                       # Area Privat: Organizer
│   ├── layout.tsx                   # Memanggil Organizer Navbar
│   ├── dashboard/page.tsx           # URL: /organizer/dashboard
│   └── profile/page.tsx             # URL: /organizer/profile
│
├── customer/                        # Area Privat: Customer
│   ├── layout.tsx                   # Memanggil Customer Navbar
│   ├── dashboard/page.tsx           # URL: /customer/dashboard
│   └── profile/page.tsx             # URL: /customer/profile
│
└── middleware.ts                    # Proteksi sesi dan validasi cross-role access
```

---

## 3. Struktur Direktori & Penempatan Komponen

Untuk menangani Navbar yang berbeda-beda dan menjaga agar komponen tidak terlalu kompleks, disarankan membuat file komponen Navbar terpisah untuk masing-masing *role*.

```text
src/ (atau root)
├── app/                  # Routing App Router
├── components/           # UI Components (Presentational)
│   ├── layout/
│   │   ├── GuestNavbar.tsx              # Menu: Login, Registrasi
│   │   ├── AdminNavbar.tsx              # Menu Manajemen Venue, Semua Order, dll.
│   │   ├── OrganizerNavbar.tsx          # Menu Event Saya, Manajemen Venue, dll.
│   │   └── CustomerNavbar.tsx           # Menu Tiket Saya, Pesanan, Cari Event, dll.
│   │
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterOrganizerForm.tsx
│   │   └── RegisterCustomerForm.tsx
│   │
│   ├── dashboard/
│   │   ├── admin/       (AdminStatsCard, SystemConsolePanel)
│   │   ├── organizer/   (OrganizerStatsCard, EventPerformanceList)
│   │   └── customer/    (CustomerStatsCard, UpcomingTicketsList)
│   │
│   └── profile/
│       ├── UpdatePasswordForm.tsx       # Reusable untuk semua role
│       ├── EditCustomerProfileForm.tsx  
│       └── EditOrganizerProfileForm.tsx 
│
├── hooks/                # Custom React Hooks (Client-side state)
│   ├── useUpdatePassword.ts
│   └── useProfileEdit.ts
│
└── services/             # Next.js Server Actions (Database & API Layer)
    ├── authService.ts
    ├── profileService.ts
    └── dashboardService.ts
```

---

## 4. Panduan Implementasi State & Data Fetching

Alur data (*Data Flow*) mengikuti standar pola Server Actions Next.js tanpa pustaka pihak ketiga:

1. **Services (Server Actions):** Berisi logika `use server` untuk query database, validasi kredensial, dan revalidasi cache (`revalidatePath`).
2. **Hooks (Client Logic):** Menggunakan `useState` dan `useTransition` untuk mengelola *loading state*, menangkap *error*, dan mengeksekusi Server Actions.
3. **Components (UI):** Hanya menerima *state* dari Hooks dan merender elemen visual. Terutama untuk **Navbar**, pertimbangkan membuat komponen pendukung seperti `NavLinks.tsx` agar penandaan URL aktif (*active state*) lebih rapi menggunakan `usePathname()` dari Next.js.
```