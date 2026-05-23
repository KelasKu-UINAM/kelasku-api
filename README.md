# KelasKu UINAM Backend

Backend REST API untuk aplikasi manajemen kelas mahasiswa UIN Alauddin Makassar.

Arsitektur:

```text
Flutter Mobile App <----> Express REST API <----> PostgreSQL Railway
```

Project ini hanya berisi backend. Tidak memakai Flutter, Firebase, atau Supabase.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL Railway
- pg
- bcrypt
- jsonwebtoken
- dotenv
- cors
- helmet
- morgan
- express-validator
- nodemon

## Struktur Folder

```text
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   └── app.js
├── database/
│   ├── schema.sql
│   └── seed.sql
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Setup

```bash
cp .env.example .env
npm install
```

Isi `.env`:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:YOUR_PORT/railway
# Optional untuk local development jika DATABASE_URL memakai *.railway.internal
# LOCAL_DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_PUBLIC_HOST:YOUR_PUBLIC_PORT/railway
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

`DATABASE_URL` hanya disimpan di `.env`. Jangan hardcode credential database di source code.

Jika menjalankan server dari laptop dan `DATABASE_URL` berisi host seperti `postgres.railway.internal`, koneksi akan gagal karena domain `railway.internal` hanya tersedia di private network Railway. Untuk local development, gunakan public TCP Proxy/Postgres public connection string dari Railway dan simpan di `LOCAL_DATABASE_URL`. Saat deploy backend ke Railway, gunakan `DATABASE_URL` internal seperti biasa.

## Menjalankan Server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Base URL lokal:

```text
http://localhost:3000
```

## Menjalankan Database

Jalankan schema:

```bash
psql "$DATABASE_URL" -f database/schema.sql
```

Jalankan seed:

```bash
psql "$DATABASE_URL" -f database/seed.sql
```

Di Railway, SQL juga bisa dijalankan melalui Query tab atau client PostgreSQL eksternal.

## Format Response

Success:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## Auth

Contoh login:

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "admin@kelasku-uinam.test",
  "password": "password123"
}
```

Gunakan token untuk endpoint protected:

```http
Authorization: Bearer <token>
```

## Endpoint

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

Classes:

- `GET /api/classes`
- `POST /api/classes`
- `GET /api/classes/:id`
- `PUT /api/classes/:id`
- `DELETE /api/classes/:id`
- `POST /api/classes/join`
- `GET /api/classes/:classId/members`
- `POST /api/classes/:classId/members`
- `DELETE /api/classes/:classId/members/:userId`

Subjects:

- `GET /api/classes/:classId/subjects`
- `POST /api/classes/:classId/subjects`
- `PUT /api/subjects/:id`
- `DELETE /api/subjects/:id`

Schedules:

- `GET /api/classes/:classId/schedules`
- `POST /api/subjects/:subjectId/schedules`
- `PUT /api/schedules/:id`
- `DELETE /api/schedules/:id`

Announcements:

- `GET /api/classes/:classId/announcements`
- `POST /api/classes/:classId/announcements`
- `PUT /api/announcements/:id`
- `DELETE /api/announcements/:id`

Tasks:

- `GET /api/classes/:classId/tasks`
- `GET /api/subjects/:subjectId/tasks`
- `POST /api/subjects/:subjectId/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

Payments:

- `GET /api/classes/:classId/payments`
- `POST /api/classes/:classId/payments`
- `PUT /api/payments/:id/pay`
- `GET /api/classes/:classId/payments/summary`
- `GET /api/classes/:classId/payments/me`

Forum:

- `GET /api/classes/:classId/forums`
- `POST /api/classes/:classId/forums`
- `GET /api/forums/:forumId/messages`
- `POST /api/forums/:forumId/messages`

WhatsApp Config:

- `GET /api/classes/:classId/whatsapp-config`
- `PUT /api/classes/:classId/whatsapp-config`
- `POST /api/classes/:classId/send-payment-reminder`

Dashboard:

- `GET /api/classes/:classId/dashboard`

## Catatan Railway PostgreSQL

- Gunakan `DATABASE_URL` dari Railway PostgreSQL.
- Untuk local development, gunakan URL publik/TCP Proxy di `LOCAL_DATABASE_URL` jika `DATABASE_URL` memakai `*.railway.internal`.
- Koneksi memakai `pg.Pool`.
- SSL akan aktif otomatis saat `NODE_ENV=production` atau URL database terdeteksi sebagai URL Railway.
- Semua query di service memakai parameterized query untuk mengurangi risiko SQL injection.
- Jalankan `schema.sql` sebelum `seed.sql`.
