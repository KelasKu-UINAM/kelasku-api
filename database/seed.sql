INSERT INTO users (name, email, password_hash, phone)
VALUES
  ('Admin Kelas', 'admin@kelasku-uinam.test', '$2b$10$UHJ87L4rLjYLJvYqL2jhtuHinwkeIVBh01A1JN8.8t1ffXGdLyvUS', '6281111111111'),
  ('Bendahara Kelas', 'bendahara@kelasku-uinam.test', '$2b$10$UHJ87L4rLjYLJvYqL2jhtuHinwkeIVBh01A1JN8.8t1ffXGdLyvUS', '6281222222222'),
  ('Mahasiswa Kelas', 'mahasiswa@kelasku-uinam.test', '$2b$10$UHJ87L4rLjYLJvYqL2jhtuHinwkeIVBh01A1JN8.8t1ffXGdLyvUS', '6281333333333')
ON CONFLICT (email) DO NOTHING;

INSERT INTO classes (name, faculty, department, semester, academic_year, class_code, created_by)
VALUES (
  'Sistem Informasi 4A',
  'Sains dan Teknologi',
  'Sistem Informasi',
  4,
  '2025/2026',
  'UINAM4A',
  (SELECT id FROM users WHERE email = 'admin@kelasku-uinam.test')
)
ON CONFLICT (class_code) DO NOTHING;

INSERT INTO class_members (class_id, user_id, role_in_class)
VALUES
  ((SELECT id FROM classes WHERE class_code = 'UINAM4A'), (SELECT id FROM users WHERE email = 'admin@kelasku-uinam.test'), 'admin_komting'),
  ((SELECT id FROM classes WHERE class_code = 'UINAM4A'), (SELECT id FROM users WHERE email = 'bendahara@kelasku-uinam.test'), 'bendahara'),
  ((SELECT id FROM classes WHERE class_code = 'UINAM4A'), (SELECT id FROM users WHERE email = 'mahasiswa@kelasku-uinam.test'), 'mahasiswa')
ON CONFLICT (class_id, user_id) DO NOTHING;

INSERT INTO subjects (class_id, name, lecturer, code)
VALUES
  ((SELECT id FROM classes WHERE class_code = 'UINAM4A'), 'Pemrograman Mobile', 'Dr. Ahmad Rahman, M.Kom.', 'SI401'),
  ((SELECT id FROM classes WHERE class_code = 'UINAM4A'), 'Basis Data Lanjut', 'Nur Aisyah, S.Kom., M.T.', 'SI402'),
  ((SELECT id FROM classes WHERE class_code = 'UINAM4A'), 'Rekayasa Perangkat Lunak', 'Muhammad Fadli, M.Kom.', 'SI403');

INSERT INTO schedules (subject_id, day, start_time, end_time, room, reminder_minutes_before)
VALUES
  ((SELECT id FROM subjects WHERE code = 'SI401' LIMIT 1), 'Senin', '08:00', '10:30', 'Lab Komputer 1', 15),
  ((SELECT id FROM subjects WHERE code = 'SI402' LIMIT 1), 'Rabu', '10:30', '12:00', 'Ruang 203', 30),
  ((SELECT id FROM subjects WHERE code = 'SI403' LIMIT 1), 'Jumat', '13:30', '15:30', 'Ruang 301', 15);

INSERT INTO announcements (class_id, subject_id, title, content, created_by)
VALUES
  (
    (SELECT id FROM classes WHERE class_code = 'UINAM4A'),
    NULL,
    'Selamat Datang di KelasKu UINAM',
    'Gunakan aplikasi ini untuk memantau jadwal, tugas, forum, dan iuran kelas.',
    (SELECT id FROM users WHERE email = 'admin@kelasku-uinam.test')
  ),
  (
    (SELECT id FROM classes WHERE class_code = 'UINAM4A'),
    (SELECT id FROM subjects WHERE code = 'SI401' LIMIT 1),
    'Persiapan Praktikum Mobile',
    'Bawa laptop dan pastikan Android Studio sudah terpasang.',
    (SELECT id FROM users WHERE email = 'admin@kelasku-uinam.test')
  );

INSERT INTO tasks (subject_id, title, description, deadline, attachment_url, created_by)
VALUES
  ((SELECT id FROM subjects WHERE code = 'SI401' LIMIT 1), 'Tugas UI Flutter', 'Buat wireframe halaman dashboard mobile.', NOW() + INTERVAL '7 days', NULL, (SELECT id FROM users WHERE email = 'admin@kelasku-uinam.test')),
  ((SELECT id FROM subjects WHERE code = 'SI402' LIMIT 1), 'Normalisasi Database', 'Kumpulkan hasil normalisasi sampai 3NF.', NOW() + INTERVAL '10 days', NULL, (SELECT id FROM users WHERE email = 'admin@kelasku-uinam.test'));

INSERT INTO payments (class_id, user_id, amount, payment_week, status, paid_at, note)
VALUES
  ((SELECT id FROM classes WHERE class_code = 'UINAM4A'), (SELECT id FROM users WHERE email = 'admin@kelasku-uinam.test'), 10000, 1, 'paid', NOW(), 'Iuran kas minggu pertama'),
  ((SELECT id FROM classes WHERE class_code = 'UINAM4A'), (SELECT id FROM users WHERE email = 'bendahara@kelasku-uinam.test'), 10000, 1, 'paid', NOW(), 'Iuran kas minggu pertama'),
  ((SELECT id FROM classes WHERE class_code = 'UINAM4A'), (SELECT id FROM users WHERE email = 'mahasiswa@kelasku-uinam.test'), 10000, 1, 'unpaid', NULL, 'Iuran kas minggu pertama')
ON CONFLICT (class_id, user_id, payment_week) DO NOTHING;

INSERT INTO forums (class_id, subject_id, type, name)
VALUES
  ((SELECT id FROM classes WHERE class_code = 'UINAM4A'), NULL, 'class', 'Forum Kelas SI 4A'),
  ((SELECT id FROM classes WHERE class_code = 'UINAM4A'), (SELECT id FROM subjects WHERE code = 'SI401' LIMIT 1), 'subject', 'Diskusi Pemrograman Mobile');

INSERT INTO messages (forum_id, sender_id, message)
VALUES
  ((SELECT id FROM forums WHERE name = 'Forum Kelas SI 4A' LIMIT 1), (SELECT id FROM users WHERE email = 'admin@kelasku-uinam.test'), 'Assalamu alaikum, selamat datang di forum kelas.'),
  ((SELECT id FROM forums WHERE name = 'Forum Kelas SI 4A' LIMIT 1), (SELECT id FROM users WHERE email = 'mahasiswa@kelasku-uinam.test'), 'Waalaikum salam, siap kak.');

INSERT INTO whatsapp_configs (class_id, admin_phone, treasurer_phone, notification_template)
VALUES (
  (SELECT id FROM classes WHERE class_code = 'UINAM4A'),
  '6281111111111',
  '6281222222222',
  'Assalamu alaikum {name}, mohon membayar iuran minggu ke-{payment_week} sebesar Rp{amount}. Terima kasih.'
)
ON CONFLICT (class_id) DO NOTHING;
