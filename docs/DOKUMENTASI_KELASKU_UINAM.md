# KelasKu UINAM - Aplikasi Manajemen Kelas UIN Alauddin Makassar

KelasKu UINAM adalah aplikasi manajemen kelas berbasis **Flutter**, **Express.js**, dan **PostgreSQL Railway** yang dirancang untuk membantu mahasiswa dan pengurus kelas dalam mengelola aktivitas akademik dan administrasi kelas.

Aplikasi ini menyediakan fitur pengelolaan jadwal mata kuliah, tugas, pengumuman, iuran kelas, forum diskusi, serta konfigurasi notifikasi WhatsApp.

Project ini dikembangkan sebagai Final Project dengan target awal penggunaan dalam lingkup kelas, dan dapat dikembangkan lebih lanjut untuk digunakan oleh fakultas dan jurusan lain di UIN Alauddin Makassar.

---

## Daftar Isi

- [Tentang Aplikasi](#tentang-aplikasi)
- [Tujuan Aplikasi](#tujuan-aplikasi)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Fitur Aplikasi](#fitur-aplikasi)
- [Role Pengguna](#role-pengguna)
- [Struktur Project](#struktur-project)
- [Struktur Backend](#struktur-backend)
- [Struktur Flutter](#struktur-flutter)
- [Struktur Database](#struktur-database)
- [Endpoint API](#endpoint-api)
- [Format Response API](#format-response-api)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Cara Menjalankan Project](#cara-menjalankan-project)
- [Alur Penggunaan Aplikasi](#alur-penggunaan-aplikasi)
- [Roadmap Pengembangan](#roadmap-pengembangan)
- [Tim Pengembang](#tim-pengembang)

---

## Tentang Aplikasi

KelasKu UINAM adalah aplikasi mobile yang membantu mahasiswa dan pengurus kelas dalam mengelola kegiatan kelas secara terpusat.

Dengan aplikasi ini, pengguna dapat:

- Melihat jadwal mata kuliah
- Mengelola tugas dan deadline
- Melihat pengumuman kelas
- Mengelola iuran mingguan kelas
- Berdiskusi melalui forum umum kelas
- Berdiskusi melalui forum per mata kuliah
- Mengatur nomor WhatsApp untuk reminder iuran
- Membantu bendahara mengirim pengingat iuran melalui WhatsApp

---

## Tujuan Aplikasi

Tujuan utama dari KelasKu UINAM adalah menyediakan platform manajemen kelas yang sederhana, terintegrasi, dan mudah digunakan oleh mahasiswa.

Tujuan khusus aplikasi:

1. Mempermudah mahasiswa melihat jadwal mata kuliah.
2. Membantu komting/admin kelas dalam mengelola jadwal, mata kuliah, tugas, dan pengumuman.
3. Membantu bendahara dalam mengelola iuran kelas mingguan.
4. Menyediakan forum komunikasi umum dan forum per mata kuliah.
5. Menyediakan fitur reminder WhatsApp untuk iuran kelas.
6. Menjadi sistem yang dapat dikembangkan untuk lintas fakultas dan jurusan di UIN Alauddin Makassar.

---

## Arsitektur Sistem

Arsitektur aplikasi menggunakan pola client-server:

```text
Flutter Mobile App <----> Express REST API <----> PostgreSQL Railway
````

Penjelasan:

* **Flutter Mobile App** digunakan sebagai aplikasi frontend.
* **Express REST API** digunakan sebagai backend untuk mengelola request, validasi, autentikasi, authorization, dan business logic.
* **PostgreSQL Railway** digunakan sebagai database utama.
* Flutter tidak terhubung langsung ke database.
* Semua akses database dilakukan melalui backend Express API.

Diagram sederhana:

```text
+----------------------+
| Flutter Mobile App   |
|----------------------|
| UI                   |
| State Management     |
| API Service          |
| Secure Token Storage |
+----------+-----------+
           |
           | HTTPS / REST API
           |
+----------v-----------+
| Express REST API     |
|----------------------|
| Auth JWT             |
| Role Middleware      |
| Controllers          |
| Services             |
| Validation           |
+----------+-----------+
           |
           | SQL Query
           |
+----------v-----------+
| PostgreSQL Railway   |
|----------------------|
| users                |
| classes              |
| class_members        |
| subjects             |
| schedules            |
| announcements        |
| tasks                |
| payments             |
| forums               |
| messages             |
| whatsapp_configs     |
+----------------------+
```

---

## Teknologi yang Digunakan

### Frontend

* Flutter
* Dart
* Material 3
* Dio
* Provider atau Riverpod
* Flutter Secure Storage
* Intl
* URL Launcher
* Flutter Local Notifications

### Backend

* Node.js
* Express.js
* PostgreSQL Driver `pg`
* Bcrypt
* JSON Web Token
* Dotenv
* CORS
* Helmet
* Morgan
* Express Validator atau Zod

### Database

* PostgreSQL
* Railway Database Hosting

---

## Fitur Aplikasi

### 1. Authentication

Fitur autentikasi digunakan untuk mengatur akses pengguna ke dalam aplikasi.

Fitur:

* Register user baru
* Login user
* Logout user
* JWT Authentication
* Simpan token di Flutter Secure Storage
* Ambil data profile user
* Password disimpan dalam bentuk hash menggunakan bcrypt

Endpoint utama:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

---

### 2. Class Management

Fitur ini digunakan untuk mengelola data kelas.

Fitur:

* Membuat kelas baru
* Melihat daftar kelas yang diikuti user
* Melihat detail kelas
* Update data kelas
* Hapus kelas
* Join kelas menggunakan class code
* Melihat daftar anggota kelas
* Menambahkan anggota ke kelas
* Menghapus anggota dari kelas

Data kelas meliputi:

* Nama kelas
* Fakultas
* Jurusan
* Semester
* Tahun akademik
* Kode kelas
* Pembuat kelas

---

### 3. Role Management

Aplikasi memiliki role pengguna berdasarkan kelas.

Role yang tersedia:

| Role            | Keterangan                        |
| --------------- | --------------------------------- |
| `admin_komting` | Pengurus utama kelas atau komting |
| `bendahara`     | Pengelola iuran kelas             |
| `mahasiswa`     | Anggota kelas biasa               |

Role disimpan pada tabel `class_members` melalui kolom `role_in_class`.

Dengan desain ini, satu user bisa memiliki role berbeda di kelas yang berbeda. Misalnya, user bisa menjadi bendahara di kelas A, tetapi menjadi mahasiswa biasa di kelas B.

---

### 4. Subject / Mata Kuliah

Fitur mata kuliah digunakan untuk mengelola daftar mata kuliah dalam kelas.

Fitur:

* Melihat daftar mata kuliah
* Menambahkan mata kuliah
* Mengubah data mata kuliah
* Menghapus mata kuliah
* Menyimpan nama dosen pengampu
* Menyimpan kode mata kuliah

Data disimpan pada tabel `subjects`.

---

### 5. Schedule / Jadwal Mata Kuliah

Fitur jadwal digunakan untuk mencatat jadwal perkuliahan.

Fitur:

* Melihat jadwal kelas
* Jadwal dikelompokkan berdasarkan hari
* Tambah jadwal
* Edit jadwal
* Hapus jadwal
* Menyimpan ruangan
* Menyimpan jam mulai
* Menyimpan jam selesai
* Menyimpan waktu reminder sebelum kelas dimulai

Data disimpan pada tabel `schedules`.

---

### 6. Announcement / Pengumuman

Fitur pengumuman digunakan untuk menyampaikan informasi penting kepada anggota kelas.

Fitur:

* Melihat pengumuman kelas
* Membuat pengumuman kelas
* Membuat pengumuman berdasarkan mata kuliah
* Edit pengumuman
* Hapus pengumuman

Contoh penggunaan:

* Info dosen tidak masuk
* Perubahan jadwal
* Info tugas
* Info iuran
* Informasi kegiatan kelas

Data disimpan pada tabel `announcements`.

---

### 7. Tasks / Tugas dan Deadline

Fitur tugas digunakan untuk mencatat tugas berdasarkan mata kuliah.

Fitur:

* Melihat daftar tugas kelas
* Melihat tugas berdasarkan mata kuliah
* Tambah tugas
* Edit tugas
* Hapus tugas
* Deadline tugas
* Attachment URL
* Badge status deadline

Status deadline:

* Aman
* Mendekati deadline
* Lewat deadline

Data disimpan pada tabel `tasks`.

---

### 8. Payments / Iuran Kelas

Fitur iuran digunakan untuk membantu bendahara mengelola iuran mingguan kelas.

Fitur:

* Membuat tagihan iuran mingguan
* Melihat daftar pembayaran semua anggota
* Menandai pembayaran sebagai lunas
* Melihat status iuran sendiri
* Melihat ringkasan iuran
* Mencatat catatan pembayaran
* Generate reminder WhatsApp untuk anggota yang belum bayar

Status pembayaran:

| Status   | Keterangan  |
| -------- | ----------- |
| `paid`   | Sudah bayar |
| `unpaid` | Belum bayar |

Data disimpan pada tabel `payments`.

---

### 9. Forum Chat

Fitur forum digunakan untuk komunikasi antar anggota kelas.

Jenis forum:

1. Forum umum kelas
2. Forum khusus per mata kuliah

Fitur:

* Melihat daftar forum
* Membuat forum
* Melihat pesan forum
* Mengirim pesan
* Forum chat sederhana berbasis database

Data disimpan pada tabel:

* `forums`
* `messages`

---

### 10. WhatsApp Configuration

Fitur ini digunakan untuk menyimpan konfigurasi nomor WhatsApp yang dipakai untuk reminder.

Fitur:

* Menyimpan nomor admin
* Menyimpan nomor bendahara
* Menyimpan template pesan reminder
* Generate link WhatsApp reminder
* Membuka WhatsApp melalui Flutter menggunakan `url_launcher`

Format link WhatsApp:

```text
https://wa.me/<nomor>?text=<pesan>
```

Data disimpan pada tabel `whatsapp_configs`.

---

### 11. Dashboard

Dashboard adalah halaman utama setelah user login.

Informasi yang ditampilkan:

* Nama user
* Kelas aktif
* Jadwal hari ini
* Pengumuman terbaru
* Tugas terdekat
* Ringkasan iuran
* Shortcut ke fitur utama

Menu shortcut:

* Jadwal
* Tugas
* Iuran
* Forum
* Pengumuman
* Settings

---

## Role Pengguna

### Admin / Komting

Hak akses:

* Membuat kelas
* Mengubah data kelas
* Menghapus kelas
* Mengelola anggota kelas
* Mengelola mata kuliah
* Mengelola jadwal
* Membuat pengumuman
* Mengelola tugas
* Membuat forum
* Melihat data iuran
* Mengatur konfigurasi WhatsApp

---

### Bendahara

Hak akses:

* Melihat data kelas
* Melihat jadwal
* Melihat pengumuman
* Mengelola iuran
* Menandai iuran sebagai lunas
* Melihat ringkasan iuran
* Mengatur konfigurasi WhatsApp
* Mengirim reminder iuran
* Menggunakan forum

---

### Mahasiswa

Hak akses:

* Melihat kelas
* Join kelas
* Melihat mata kuliah
* Melihat jadwal
* Melihat pengumuman
* Melihat tugas
* Melihat status iuran sendiri
* Menggunakan forum chat

---

## Struktur Project

Struktur utama project:

```text
KelasKu UINAM/
├── backend/
│   ├── src/
│   ├── database/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── mobile/
    ├── lib/
    ├── pubspec.yaml
    └── android/
```

---

## Struktur Backend

Struktur backend Express:

```text
backend/
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── class.controller.js
│   │   ├── subject.controller.js
│   │   ├── schedule.controller.js
│   │   ├── announcement.controller.js
│   │   ├── task.controller.js
│   │   ├── payment.controller.js
│   │   ├── forum.controller.js
│   │   └── whatsapp.controller.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── class.routes.js
│   │   ├── subject.routes.js
│   │   ├── schedule.routes.js
│   │   ├── announcement.routes.js
│   │   ├── task.routes.js
│   │   ├── payment.routes.js
│   │   ├── forum.routes.js
│   │   └── whatsapp.routes.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── class.service.js
│   │   ├── payment.service.js
│   │   ├── forum.service.js
│   │   └── whatsapp.service.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── response.js
│   │   └── generateClassCode.js
│   │
│   └── app.js
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── .env.example
├── package.json
└── server.js
```

---

## Penjelasan Struktur Backend

| Folder/File           | Fungsi                                   |
| --------------------- | ---------------------------------------- |
| `src/config/db.js`    | Konfigurasi koneksi PostgreSQL           |
| `src/controllers/`    | Mengatur request dan response API        |
| `src/routes/`         | Mendefinisikan endpoint API              |
| `src/middlewares/`    | Middleware auth, role, dan error handler |
| `src/services/`       | Business logic aplikasi                  |
| `src/utils/`          | Helper function                          |
| `database/schema.sql` | Struktur tabel database                  |
| `database/seed.sql`   | Data awal untuk testing                  |
| `.env.example`        | Contoh konfigurasi environment           |
| `server.js`           | Entry point backend                      |

---

## Struktur Flutter

Struktur aplikasi Flutter:

```text
mobile/
├── lib/
│   ├── core/
│   │   ├── constants/
│   │   │   └── api_constants.dart
│   │   │
│   │   ├── services/
│   │   │   └── api_client.dart
│   │   │
│   │   ├── storage/
│   │   │   └── secure_storage_service.dart
│   │   │
│   │   ├── utils/
│   │   │   ├── validators.dart
│   │   │   └── date_formatter.dart
│   │   │
│   │   └── widgets/
│   │       ├── custom_button.dart
│   │       ├── custom_text_field.dart
│   │       ├── loading_widget.dart
│   │       ├── empty_state_widget.dart
│   │       ├── error_state_widget.dart
│   │       ├── section_header.dart
│   │       └── dashboard_card.dart
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── models/
│   │   │   │   └── user_model.dart
│   │   │   ├── services/
│   │   │   │   └── auth_service.dart
│   │   │   ├── providers/
│   │   │   │   └── auth_provider.dart
│   │   │   └── screens/
│   │   │       ├── login_screen.dart
│   │   │       └── register_screen.dart
│   │   │
│   │   ├── dashboard/
│   │   │   ├── models/
│   │   │   │   └── dashboard_model.dart
│   │   │   ├── services/
│   │   │   │   └── dashboard_service.dart
│   │   │   ├── providers/
│   │   │   │   └── dashboard_provider.dart
│   │   │   └── screens/
│   │   │       └── dashboard_screen.dart
│   │   │
│   │   ├── classes/
│   │   │   ├── models/
│   │   │   │   ├── class_model.dart
│   │   │   │   └── class_member_model.dart
│   │   │   ├── services/
│   │   │   │   └── class_service.dart
│   │   │   ├── providers/
│   │   │   │   └── class_provider.dart
│   │   │   └── screens/
│   │   │       ├── class_list_screen.dart
│   │   │       ├── class_detail_screen.dart
│   │   │       ├── create_class_screen.dart
│   │   │       └── join_class_screen.dart
│   │   │
│   │   ├── subjects/
│   │   │   ├── models/
│   │   │   │   └── subject_model.dart
│   │   │   ├── services/
│   │   │   │   └── subject_service.dart
│   │   │   ├── providers/
│   │   │   │   └── subject_provider.dart
│   │   │   └── screens/
│   │   │       ├── subject_list_screen.dart
│   │   │       └── subject_form_screen.dart
│   │   │
│   │   ├── schedules/
│   │   │   ├── models/
│   │   │   │   └── schedule_model.dart
│   │   │   ├── services/
│   │   │   │   └── schedule_service.dart
│   │   │   ├── providers/
│   │   │   │   └── schedule_provider.dart
│   │   │   └── screens/
│   │   │       ├── schedule_screen.dart
│   │   │       └── schedule_form_screen.dart
│   │   │
│   │   ├── announcements/
│   │   │   ├── models/
│   │   │   │   └── announcement_model.dart
│   │   │   ├── services/
│   │   │   │   └── announcement_service.dart
│   │   │   ├── providers/
│   │   │   │   └── announcement_provider.dart
│   │   │   └── screens/
│   │   │       ├── announcement_screen.dart
│   │   │       └── announcement_form_screen.dart
│   │   │
│   │   ├── tasks/
│   │   │   ├── models/
│   │   │   │   └── task_model.dart
│   │   │   ├── services/
│   │   │   │   └── task_service.dart
│   │   │   ├── providers/
│   │   │   │   └── task_provider.dart
│   │   │   └── screens/
│   │   │       ├── task_screen.dart
│   │   │       └── task_form_screen.dart
│   │   │
│   │   ├── payments/
│   │   │   ├── models/
│   │   │   │   ├── payment_model.dart
│   │   │   │   └── payment_summary_model.dart
│   │   │   ├── services/
│   │   │   │   └── payment_service.dart
│   │   │   ├── providers/
│   │   │   │   └── payment_provider.dart
│   │   │   └── screens/
│   │   │       ├── payment_screen.dart
│   │   │       └── create_payment_screen.dart
│   │   │
│   │   ├── forums/
│   │   │   ├── models/
│   │   │   │   ├── forum_model.dart
│   │   │   │   └── message_model.dart
│   │   │   ├── services/
│   │   │   │   └── forum_service.dart
│   │   │   ├── providers/
│   │   │   │   └── forum_provider.dart
│   │   │   └── screens/
│   │   │       ├── forum_list_screen.dart
│   │   │       └── chat_screen.dart
│   │   │
│   │   └── settings/
│   │       ├── models/
│   │       │   └── whatsapp_config_model.dart
│   │       ├── services/
│   │       │   └── whatsapp_config_service.dart
│   │       └── screens/
│   │           ├── settings_screen.dart
│   │           └── whatsapp_config_screen.dart
│   │
│   ├── app.dart
│   └── main.dart
│
└── pubspec.yaml
```

---

## Penjelasan Struktur Flutter

| Folder/File       | Fungsi                                          |
| ----------------- | ----------------------------------------------- |
| `core/constants/` | Menyimpan konfigurasi umum seperti base URL API |
| `core/services/`  | API client global menggunakan Dio               |
| `core/storage/`   | Penyimpanan token JWT                           |
| `core/utils/`     | Helper seperti validasi dan format tanggal      |
| `core/widgets/`   | Widget reusable                                 |
| `features/`       | Modul fitur utama aplikasi                      |
| `models/`         | Representasi data dari API                      |
| `services/`       | Service untuk memanggil endpoint API            |
| `providers/`      | State management                                |
| `screens/`        | Tampilan UI aplikasi                            |

---

## Struktur Database

Database menggunakan PostgreSQL Railway.

### 1. Tabel `users`

Menyimpan data pengguna.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  phone VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### 2. Tabel `classes`

Menyimpan data kelas.

```sql
CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  faculty VARCHAR,
  department VARCHAR,
  semester INT,
  academic_year VARCHAR,
  class_code VARCHAR UNIQUE NOT NULL,
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### 3. Tabel `class_members`

Menyimpan anggota kelas dan role user dalam kelas.

```sql
CREATE TABLE class_members (
  id SERIAL PRIMARY KEY,
  class_id INT REFERENCES classes(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  role_in_class VARCHAR NOT NULL,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(class_id, user_id),
  CHECK (role_in_class IN ('admin_komting', 'bendahara', 'mahasiswa'))
);
```

---

### 4. Tabel `subjects`

Menyimpan data mata kuliah.

```sql
CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  class_id INT REFERENCES classes(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  lecturer VARCHAR,
  code VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### 5. Tabel `schedules`

Menyimpan jadwal mata kuliah.

```sql
CREATE TABLE schedules (
  id SERIAL PRIMARY KEY,
  subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
  day VARCHAR NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room VARCHAR,
  reminder_minutes_before INT DEFAULT 15,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### 6. Tabel `announcements`

Menyimpan data pengumuman.

```sql
CREATE TABLE announcements (
  id SERIAL PRIMARY KEY,
  class_id INT REFERENCES classes(id) ON DELETE CASCADE,
  subject_id INT REFERENCES subjects(id) ON DELETE SET NULL,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### 7. Tabel `tasks`

Menyimpan data tugas dan deadline.

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  deadline TIMESTAMP NOT NULL,
  attachment_url TEXT,
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### 8. Tabel `payments`

Menyimpan data iuran kelas.

```sql
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  class_id INT REFERENCES classes(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  payment_week INT NOT NULL,
  status VARCHAR DEFAULT 'unpaid',
  paid_at TIMESTAMP NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(class_id, user_id, payment_week),
  CHECK (status IN ('paid', 'unpaid'))
);
```

---

### 9. Tabel `forums`

Menyimpan forum kelas dan forum mata kuliah.

```sql
CREATE TABLE forums (
  id SERIAL PRIMARY KEY,
  class_id INT REFERENCES classes(id) ON DELETE CASCADE,
  subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
  type VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CHECK (type IN ('class', 'subject')),
  CHECK (
    (type = 'class' AND subject_id IS NULL)
    OR
    (type = 'subject' AND subject_id IS NOT NULL)
  )
);
```

---

### 10. Tabel `messages`

Menyimpan pesan forum.

```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  forum_id INT REFERENCES forums(id) ON DELETE CASCADE,
  sender_id INT REFERENCES users(id),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 11. Tabel `whatsapp_configs`

Menyimpan konfigurasi WhatsApp kelas.

```sql
CREATE TABLE whatsapp_configs (
  id SERIAL PRIMARY KEY,
  class_id INT UNIQUE REFERENCES classes(id) ON DELETE CASCADE,
  admin_phone VARCHAR,
  treasurer_phone VARCHAR,
  notification_template TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Endpoint API

Endpoint API mengikuti rancangan REST API yang sudah dibuat pada dokumentasi endpoint project. Endpoint tersebut mencakup modul Auth, Classes, Subjects, Schedules, Announcements, Tasks, Payments, Forum, dan WhatsApp Config. 

### Auth

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

---

### Classes

```text
GET    /api/classes
POST   /api/classes
GET    /api/classes/:id
PUT    /api/classes/:id
DELETE /api/classes/:id
POST   /api/classes/join
GET    /api/classes/:classId/members
POST   /api/classes/:classId/members
DELETE /api/classes/:classId/members/:userId
```

---

### Subjects

```text
GET    /api/classes/:classId/subjects
POST   /api/classes/:classId/subjects
PUT    /api/subjects/:id
DELETE /api/subjects/:id
```

---

### Schedules

```text
GET    /api/classes/:classId/schedules
POST   /api/subjects/:subjectId/schedules
PUT    /api/schedules/:id
DELETE /api/schedules/:id
```

---

### Announcements

```text
GET    /api/classes/:classId/announcements
POST   /api/classes/:classId/announcements
PUT    /api/announcements/:id
DELETE /api/announcements/:id
```

---

### Tasks

```text
GET    /api/classes/:classId/tasks
GET    /api/subjects/:subjectId/tasks
POST   /api/subjects/:subjectId/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

---

### Payments

```text
GET    /api/classes/:classId/payments
POST   /api/classes/:classId/payments
PUT    /api/payments/:id/pay
GET    /api/classes/:classId/payments/summary
GET    /api/classes/:classId/payments/me
```

---

### Forum

```text
GET  /api/classes/:classId/forums
POST /api/classes/:classId/forums
GET  /api/forums/:forumId/messages
POST /api/forums/:forumId/messages
```

---

### WhatsApp Config

```text
GET  /api/classes/:classId/whatsapp-config
PUT  /api/classes/:classId/whatsapp-config
POST /api/classes/:classId/send-payment-reminder
```

---

### Dashboard

```text
GET /api/classes/:classId/dashboard
```

---

## Format Response API

### Response Berhasil

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

### Response Gagal

```json
{
  "success": false,
  "message": "Validation error",
  "errors": []
}
```

---

## Header Authorization

Endpoint selain register dan login wajib menggunakan JWT token.

```http
Authorization: Bearer <token>
```

---

## Konfigurasi Environment

### Backend `.env.example`

```env
PORT=3000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:YOUR_PORT/railway
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Catatan:

* `DATABASE_URL` hanya disimpan di backend.
* Jangan menyimpan credential database di Flutter.
* Jangan commit file `.env` ke GitHub.
* Gunakan `.env.example` sebagai contoh konfigurasi.

---

### Flutter API Constants

File:

```text
mobile/lib/core/constants/api_constants.dart
```

Contoh isi:

```dart
class ApiConstants {
  static const String baseUrl = 'http://10.0.2.2:3000';
}
```

Catatan base URL:

| Environment      | Base URL                          |
| ---------------- | --------------------------------- |
| Android Emulator | `http://10.0.2.2:3000`            |
| iOS Simulator    | `http://localhost:3000`           |
| Device Fisik     | `http://IP-LAPTOP:3000`           |
| Production       | `https://domain-backend-kamu.com` |

---

## Package Backend

Install package backend:

```bash
npm install express pg bcrypt jsonwebtoken dotenv cors helmet morgan
```

Opsional untuk validasi:

```bash
npm install express-validator
```

Opsional untuk development:

```bash
npm install --save-dev nodemon
```

Contoh script `package.json`:

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

---

## Package Flutter

Contoh dependencies Flutter:

```yaml
dependencies:
  flutter:
    sdk: flutter

  dio: ^5.7.0
  provider: ^6.1.2
  flutter_secure_storage: ^9.2.2
  intl: ^0.19.0
  url_launcher: ^6.3.0
  flutter_local_notifications: ^17.2.2
```

---

## Cara Menjalankan Project

### 1. Clone Repository

```bash
git clone https://github.com/username/KelasKu UINAM.git
cd KelasKu UINAM
```

---

### 2. Setup Database PostgreSQL Railway

1. Buat database PostgreSQL di Railway.
2. Ambil connection string PostgreSQL.
3. Simpan connection string ke file `.env` backend.
4. Jalankan file `database/schema.sql`.
5. Jalankan file `database/seed.sql` jika tersedia.

---

### 3. Setup Backend

Masuk ke folder backend:

```bash
cd backend
```

Install dependency:

```bash
npm install
```

Buat file `.env`:

```bash
cp .env.example .env
```

Isi `.env` sesuai konfigurasi Railway:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:YOUR_PORT/railway
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Jalankan backend:

```bash
npm run dev
```

Backend akan berjalan di:

```text
http://localhost:3000
```

---

### 4. Setup Flutter Mobile

Masuk ke folder mobile:

```bash
cd mobile
```

Install dependency:

```bash
flutter pub get
```

Atur base URL API di:

```text
lib/core/constants/api_constants.dart
```

Untuk Android emulator:

```dart
class ApiConstants {
  static const String baseUrl = 'http://10.0.2.2:3000';
}
```

Jalankan aplikasi:

```bash
flutter run
```

---

## Alur Penggunaan Aplikasi

### 1. Register

User membuat akun dengan:

* Nama
* Email
* Password
* Nomor HP

Setelah berhasil register, user diarahkan ke halaman login.

---

### 2. Login

User login menggunakan email dan password.

Jika berhasil, backend mengirim JWT token.

Flutter menyimpan token menggunakan `flutter_secure_storage`.

---

### 3. Membuat Kelas

User yang membuat kelas otomatis menjadi `admin_komting`.

Admin mengisi data:

* Nama kelas
* Fakultas
* Jurusan
* Semester
* Tahun akademik

Sistem otomatis membuat `class_code`.

---

### 4. Join Kelas

Mahasiswa dapat join kelas menggunakan `class_code`.

Setelah join, user otomatis memiliki role `mahasiswa`.

---

### 5. Mengelola Mata Kuliah

Admin/komting dapat menambahkan mata kuliah.

Data yang diinput:

* Nama mata kuliah
* Kode mata kuliah
* Nama dosen

---

### 6. Mengelola Jadwal

Admin/komting dapat menambahkan jadwal mata kuliah.

Data yang diinput:

* Mata kuliah
* Hari
* Jam mulai
* Jam selesai
* Ruangan
* Reminder sebelum jadwal

---

### 7. Membuat Pengumuman

Admin/komting dapat membuat pengumuman kelas atau pengumuman per mata kuliah.

---

### 8. Membuat Tugas

Admin/komting dapat membuat tugas berdasarkan mata kuliah.

Data tugas:

* Judul
* Deskripsi
* Deadline
* Attachment URL

---

### 9. Mengelola Iuran

Bendahara dapat membuat iuran mingguan.

Sistem membuat data iuran untuk anggota kelas.

Bendahara dapat menandai anggota yang sudah membayar.

---

### 10. Menggunakan Forum

User dapat membuka forum umum atau forum per mata kuliah.

User dapat mengirim dan membaca pesan.

---

### 11. Mengatur WhatsApp Reminder

Admin/komting atau bendahara dapat mengatur nomor WhatsApp dan template pesan reminder.

Aplikasi akan membuat link WhatsApp untuk mengirim pengingat iuran.

---

## Validasi Data

Validasi yang diterapkan:

| Data              | Validasi                                             |
| ----------------- | ---------------------------------------------------- |
| Nama              | Wajib diisi                                          |
| Email             | Wajib valid                                          |
| Password          | Minimal 6 karakter                                   |
| Nomor HP          | Format nomor valid                                   |
| Nama kelas        | Wajib diisi                                          |
| Kode kelas        | Harus unik                                           |
| Amount iuran      | Harus angka                                          |
| Deadline          | Harus tanggal valid                                  |
| Role              | Harus `admin_komting`, `bendahara`, atau `mahasiswa` |
| Status pembayaran | Harus `paid` atau `unpaid`                           |
| Forum type        | Harus `class` atau `subject`                         |

---

## Middleware Backend

### Auth Middleware

Digunakan untuk:

* Membaca token dari header Authorization
* Validasi JWT token
* Mengambil data user dari token
* Menyimpan user login ke `req.user`

---

### Role Middleware

Digunakan untuk:

* Mengecek role user dalam kelas
* Membatasi akses endpoint tertentu
* Memastikan hanya role tertentu yang bisa melakukan aksi tertentu

Contoh akses:

| Endpoint                     | Role                         |
| ---------------------------- | ---------------------------- |
| Membuat kelas                | User login                   |
| Mengelola jadwal             | `admin_komting`              |
| Mengelola iuran              | `admin_komting`, `bendahara` |
| Mengirim pesan forum         | Anggota kelas                |
| Melihat status iuran sendiri | `mahasiswa`                  |

---

## Roadmap Pengembangan

### Versi MVP

* Register dan login
* JWT Authentication
* Membuat dan join kelas
* Manajemen mata kuliah
* Manajemen jadwal
* Manajemen tugas
* Manajemen iuran
* Forum chat sederhana
* Konfigurasi WhatsApp
* Reminder WhatsApp via link

---

### Versi Lanjutan

* Push notification
* Upload file materi
* Upload bukti pembayaran
* Export laporan iuran ke PDF
* Absensi QR Code
* Kalender akademik
* Polling kelas
* Role management lebih detail
* Dashboard admin fakultas/jurusan
* Web admin panel

---

### Versi Production

Untuk versi production, sistem dapat dikembangkan dengan tambahan:

* HTTPS wajib
* Rate limiting
* Refresh token
* Audit log
* Logging server
* Cloud storage
* Push notification server-side
* Email verification
* Password reset
* Backup database
* Monitoring backend

---

## Keunggulan Aplikasi

* Terintegrasi antara jadwal, tugas, iuran, pengumuman, dan forum.
* Mendukung role admin/komting, bendahara, dan mahasiswa.
* Menggunakan backend API sehingga lebih aman dibanding Flutter langsung ke database.
* Database PostgreSQL lebih rapi untuk relasi antar data.
* Dapat dikembangkan untuk fakultas dan jurusan lain.
* Cocok untuk kebutuhan Final Project dan pengembangan lanjutan.

---

## Kesimpulan

KelasKu UINAM adalah aplikasi manajemen kelas berbasis Flutter yang menggunakan Express.js sebagai REST API dan PostgreSQL Railway sebagai database utama.

Aplikasi ini dirancang untuk membantu mahasiswa dan pengurus kelas dalam mengelola jadwal, tugas, pengumuman, iuran, forum, dan reminder WhatsApp secara terintegrasi.

Arsitektur yang digunakan adalah:

```text
Flutter Mobile App <----> Express REST API <----> PostgreSQL Railway
```

Dengan arsitektur ini, aplikasi menjadi lebih aman, lebih mudah dikembangkan, dan lebih siap untuk digunakan secara lebih luas di lingkungan UIN Alauddin Makassar.

---

## Tim Pengembang

Project ini dikembangkan oleh kelompok Final Project Pemrograman Perangkat Bergerak Kelompok 7.

Anggota:

1. Muh. Zhafran Dzaky (Flutter + Front-end)
2. Hidayat Nur Said (Backend)

- Program Studi: Teknik Informatika<br>
- Fakultas: Sains dan Teknologi (Saintek)<br>
- Universitas: UIN Alauddin Makassar
