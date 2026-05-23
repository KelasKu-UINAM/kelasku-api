DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS forums CASCADE;
DROP TABLE IF EXISTS whatsapp_configs CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS schedules CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS class_members CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  phone VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

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

CREATE TABLE class_members (
  id SERIAL PRIMARY KEY,
  class_id INT REFERENCES classes(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  role_in_class VARCHAR NOT NULL,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(class_id, user_id),
  CHECK (role_in_class IN ('admin_komting', 'bendahara', 'mahasiswa'))
);

CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  class_id INT REFERENCES classes(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  lecturer VARCHAR,
  code VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

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

CREATE TABLE forums (
  id SERIAL PRIMARY KEY,
  class_id INT REFERENCES classes(id) ON DELETE CASCADE,
  subject_id INT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  type VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CHECK (type IN ('class', 'subject')),
  CHECK (
    (type = 'class' AND subject_id IS NULL)
    OR (type = 'subject' AND subject_id IS NOT NULL)
  )
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  forum_id INT REFERENCES forums(id) ON DELETE CASCADE,
  sender_id INT REFERENCES users(id),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE whatsapp_configs (
  id SERIAL PRIMARY KEY,
  class_id INT UNIQUE REFERENCES classes(id) ON DELETE CASCADE,
  admin_phone VARCHAR,
  treasurer_phone VARCHAR,
  notification_template TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_classes_class_code ON classes(class_code);
CREATE INDEX idx_class_members_class_id ON class_members(class_id);
CREATE INDEX idx_class_members_user_id ON class_members(user_id);
CREATE INDEX idx_subjects_class_id ON subjects(class_id);
CREATE INDEX idx_schedules_subject_id ON schedules(subject_id);
CREATE INDEX idx_payments_class_id ON payments(class_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_forums_class_id ON forums(class_id);
CREATE INDEX idx_messages_forum_id ON messages(forum_id);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_classes_updated_at
BEFORE UPDATE ON classes
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_subjects_updated_at
BEFORE UPDATE ON subjects
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_schedules_updated_at
BEFORE UPDATE ON schedules
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_announcements_updated_at
BEFORE UPDATE ON announcements
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_forums_updated_at
BEFORE UPDATE ON forums
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_whatsapp_configs_updated_at
BEFORE UPDATE ON whatsapp_configs
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
