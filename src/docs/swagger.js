const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'KelasKu UINAM REST API',
    version: '1.0.1',
    description: 'Dokumentasi REST API backend KelasKu UINAM untuk Flutter Mobile App.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development'
    }
  ],
  tags: [
    { name: 'Health' },
    { name: 'Auth' },
    { name: 'Classes' },
    { name: 'Subjects' },
    { name: 'Schedules' },
    { name: 'Announcements' },
    { name: 'Tasks' },
    { name: 'Payments' },
    { name: 'Forums' },
    { name: 'WhatsApp' },
    { name: 'Dashboard' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Success' },
          data: { type: 'object' }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed' },
          errors: { type: 'array', items: { type: 'object' } }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Admin Kelas' },
          email: { type: 'string', format: 'email', example: 'admin@kelasku-uinam.test' },
          password: { type: 'string', minLength: 6, example: 'password123' },
          phone: { type: 'string', example: '6281111111111' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@kelasku-uinam.test' },
          password: { type: 'string', example: 'password123' }
        }
      },
      ClassRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Sistem Informasi 4A' },
          faculty: { type: 'string', example: 'Sains dan Teknologi' },
          department: { type: 'string', example: 'Sistem Informasi' },
          semester: { type: 'integer', example: 4 },
          academic_year: { type: 'string', example: '2025/2026' }
        }
      },
      JoinClassRequest: {
        type: 'object',
        required: ['class_code'],
        properties: {
          class_code: { type: 'string', example: 'UINAM4A' }
        }
      },
      AddMemberRequest: {
        type: 'object',
        required: ['user_id', 'role_in_class'],
        properties: {
          user_id: { type: 'integer', example: 3 },
          role_in_class: {
            type: 'string',
            enum: ['admin_komting', 'bendahara', 'mahasiswa'],
            example: 'mahasiswa'
          }
        }
      },
      SubjectRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Pemrograman Mobile' },
          lecturer: { type: 'string', example: 'Dr. Ahmad Rahman, M.Kom.' },
          code: { type: 'string', example: 'SI401' }
        }
      },
      ScheduleRequest: {
        type: 'object',
        required: ['day', 'start_time', 'end_time'],
        properties: {
          day: { type: 'string', example: 'Senin' },
          start_time: { type: 'string', example: '08:00' },
          end_time: { type: 'string', example: '10:30' },
          room: { type: 'string', example: 'Lab Komputer 1' },
          reminder_minutes_before: { type: 'integer', example: 15 }
        }
      },
      AnnouncementRequest: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
          title: { type: 'string', example: 'Info Perkuliahan' },
          content: { type: 'string', example: 'Kuliah hari ini pindah ke ruang 203.' },
          subject_id: { type: 'integer', nullable: true, example: 1 }
        }
      },
      TaskRequest: {
        type: 'object',
        required: ['title', 'deadline'],
        properties: {
          title: { type: 'string', example: 'Tugas UI Flutter' },
          description: { type: 'string', example: 'Buat wireframe halaman dashboard mobile.' },
          deadline: { type: 'string', format: 'date-time', example: '2026-06-01T08:00:00.000Z' },
          attachment_url: { type: 'string', nullable: true, example: 'https://example.com/file.pdf' }
        }
      },
      PaymentRequest: {
        type: 'object',
        required: ['amount', 'payment_week'],
        properties: {
          amount: { type: 'number', example: 10000 },
          payment_week: { type: 'integer', example: 1 },
          note: { type: 'string', example: 'Iuran kas minggu pertama' }
        }
      },
      ForumRequest: {
        type: 'object',
        required: ['type', 'name'],
        properties: {
          type: { type: 'string', enum: ['class', 'subject'], example: 'class' },
          name: { type: 'string', example: 'Forum Kelas SI 4A' },
          subject_id: { type: 'integer', nullable: true, example: null }
        }
      },
      MessageRequest: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string', example: 'Assalamu alaikum, teman-teman.' }
        }
      },
      WhatsappConfigRequest: {
        type: 'object',
        properties: {
          admin_phone: { type: 'string', example: '6281111111111' },
          treasurer_phone: { type: 'string', example: '6281222222222' },
          notification_template: {
            type: 'string',
            example: 'Assalamu alaikum {name}, mohon membayar iuran minggu ke-{payment_week} sebesar Rp{amount}.'
          }
        }
      },
      PaymentReminderRequest: {
        type: 'object',
        properties: {
          user_id: { type: 'integer', example: 3 },
          payment_id: { type: 'integer', example: 1 }
        }
      }
    },
    responses: {
      Unauthorized: {
        description: 'Token tidak ada atau tidak valid',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' }
          }
        }
      },
      Forbidden: {
        description: 'User bukan anggota kelas atau role tidak sesuai',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' }
          }
        }
      },
      ValidationError: {
        description: 'Validasi request gagal',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' }
          }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {}
};

const jsonBody = (schemaRef) => ({
  required: true,
  content: {
    'application/json': {
      schema: { $ref: schemaRef }
    }
  }
});

const ok = (description = 'Success') => ({
  description,
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/SuccessResponse' }
    }
  }
});

const idParam = (name, description) => ({
  name,
  in: 'path',
  required: true,
  description,
  schema: { type: 'integer' }
});

swaggerDocument.paths = {
  '/': {
    get: {
      tags: ['Health'],
      summary: 'API root',
      security: [],
      responses: { 200: ok('API berjalan') }
    }
  },
  '/health': {
    get: {
      tags: ['Health'],
      summary: 'Health check',
      security: [],
      responses: { 200: ok('API sehat') }
    }
  },
  '/api/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Register user baru',
      security: [],
      requestBody: jsonBody('#/components/schemas/RegisterRequest'),
      responses: { 201: ok('Register success'), 409: ok('Email sudah dipakai'), 422: { $ref: '#/components/responses/ValidationError' } }
    }
  },
  '/api/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Login dan mendapatkan JWT token',
      security: [],
      requestBody: jsonBody('#/components/schemas/LoginRequest'),
      responses: { 200: ok('Login success'), 401: { $ref: '#/components/responses/Unauthorized' }, 422: { $ref: '#/components/responses/ValidationError' } }
    }
  },
  '/api/auth/profile': {
    get: {
      tags: ['Auth'],
      summary: 'Profil user login',
      responses: { 200: ok('Profile retrieved'), 401: { $ref: '#/components/responses/Unauthorized' } }
    }
  },
  '/api/classes': {
    get: {
      tags: ['Classes'],
      summary: 'Daftar kelas yang diikuti user login',
      responses: { 200: ok('Classes retrieved'), 401: { $ref: '#/components/responses/Unauthorized' } }
    },
    post: {
      tags: ['Classes'],
      summary: 'Buat kelas baru dan jadikan user sebagai admin_komting',
      requestBody: jsonBody('#/components/schemas/ClassRequest'),
      responses: { 201: ok('Class created'), 422: { $ref: '#/components/responses/ValidationError' } }
    }
  },
  '/api/classes/join': {
    post: {
      tags: ['Classes'],
      summary: 'Join kelas menggunakan class_code',
      requestBody: jsonBody('#/components/schemas/JoinClassRequest'),
      responses: { 201: ok('Joined class successfully'), 404: ok('Class not found'), 409: ok('Already member') }
    }
  },
  '/api/classes/{id}': {
    get: {
      tags: ['Classes'],
      summary: 'Detail kelas',
      parameters: [idParam('id', 'Class id')],
      responses: { 200: ok('Class retrieved'), 403: { $ref: '#/components/responses/Forbidden' } }
    },
    put: {
      tags: ['Classes'],
      summary: 'Update kelas, hanya admin_komting',
      parameters: [idParam('id', 'Class id')],
      requestBody: jsonBody('#/components/schemas/ClassRequest'),
      responses: { 200: ok('Class updated'), 403: { $ref: '#/components/responses/Forbidden' } }
    },
    delete: {
      tags: ['Classes'],
      summary: 'Hapus kelas, hanya admin_komting',
      parameters: [idParam('id', 'Class id')],
      responses: { 200: ok('Class deleted'), 403: { $ref: '#/components/responses/Forbidden' } }
    }
  },
  '/api/classes/{classId}/members': {
    get: {
      tags: ['Classes'],
      summary: 'Daftar anggota kelas, hanya admin_komting',
      parameters: [idParam('classId', 'Class id')],
      responses: { 200: ok('Class members retrieved'), 403: { $ref: '#/components/responses/Forbidden' } }
    },
    post: {
      tags: ['Classes'],
      summary: 'Tambah atau update role anggota kelas, hanya admin_komting',
      parameters: [idParam('classId', 'Class id')],
      requestBody: jsonBody('#/components/schemas/AddMemberRequest'),
      responses: { 201: ok('Class member saved'), 403: { $ref: '#/components/responses/Forbidden' } }
    }
  },
  '/api/classes/{classId}/members/{userId}': {
    delete: {
      tags: ['Classes'],
      summary: 'Hapus anggota kelas, hanya admin_komting',
      parameters: [idParam('classId', 'Class id'), idParam('userId', 'User id')],
      responses: { 200: ok('Class member removed'), 403: { $ref: '#/components/responses/Forbidden' } }
    }
  },
  '/api/classes/{classId}/subjects': {
    get: {
      tags: ['Subjects'],
      summary: 'Daftar mata kuliah kelas',
      parameters: [idParam('classId', 'Class id')],
      responses: { 200: ok('Subjects retrieved') }
    },
    post: {
      tags: ['Subjects'],
      summary: 'Tambah mata kuliah, hanya admin_komting',
      parameters: [idParam('classId', 'Class id')],
      requestBody: jsonBody('#/components/schemas/SubjectRequest'),
      responses: { 201: ok('Subject created'), 403: { $ref: '#/components/responses/Forbidden' } }
    }
  },
  '/api/subjects/{id}': {
    put: {
      tags: ['Subjects'],
      summary: 'Update mata kuliah, hanya admin_komting',
      parameters: [idParam('id', 'Subject id')],
      requestBody: jsonBody('#/components/schemas/SubjectRequest'),
      responses: { 200: ok('Subject updated') }
    },
    delete: {
      tags: ['Subjects'],
      summary: 'Hapus mata kuliah, hanya admin_komting',
      parameters: [idParam('id', 'Subject id')],
      responses: { 200: ok('Subject deleted') }
    }
  },
  '/api/classes/{classId}/schedules': {
    get: {
      tags: ['Schedules'],
      summary: 'Daftar jadwal kelas, join dengan subjects',
      parameters: [idParam('classId', 'Class id')],
      responses: { 200: ok('Schedules retrieved') }
    }
  },
  '/api/subjects/{subjectId}/schedules': {
    post: {
      tags: ['Schedules'],
      summary: 'Tambah jadwal mata kuliah, hanya admin_komting',
      parameters: [idParam('subjectId', 'Subject id')],
      requestBody: jsonBody('#/components/schemas/ScheduleRequest'),
      responses: { 201: ok('Schedule created') }
    }
  },
  '/api/schedules/{id}': {
    put: {
      tags: ['Schedules'],
      summary: 'Update jadwal, hanya admin_komting',
      parameters: [idParam('id', 'Schedule id')],
      requestBody: jsonBody('#/components/schemas/ScheduleRequest'),
      responses: { 200: ok('Schedule updated') }
    },
    delete: {
      tags: ['Schedules'],
      summary: 'Hapus jadwal, hanya admin_komting',
      parameters: [idParam('id', 'Schedule id')],
      responses: { 200: ok('Schedule deleted') }
    }
  },
  '/api/classes/{classId}/announcements': {
    get: {
      tags: ['Announcements'],
      summary: 'Daftar pengumuman kelas',
      parameters: [idParam('classId', 'Class id')],
      responses: { 200: ok('Announcements retrieved') }
    },
    post: {
      tags: ['Announcements'],
      summary: 'Buat pengumuman, admin_komting atau bendahara',
      parameters: [idParam('classId', 'Class id')],
      requestBody: jsonBody('#/components/schemas/AnnouncementRequest'),
      responses: { 201: ok('Announcement created') }
    }
  },
  '/api/announcements/{id}': {
    put: {
      tags: ['Announcements'],
      summary: 'Update pengumuman oleh pembuat atau admin_komting',
      parameters: [idParam('id', 'Announcement id')],
      requestBody: jsonBody('#/components/schemas/AnnouncementRequest'),
      responses: { 200: ok('Announcement updated') }
    },
    delete: {
      tags: ['Announcements'],
      summary: 'Hapus pengumuman oleh pembuat atau admin_komting',
      parameters: [idParam('id', 'Announcement id')],
      responses: { 200: ok('Announcement deleted') }
    }
  },
  '/api/classes/{classId}/tasks': {
    get: {
      tags: ['Tasks'],
      summary: 'Daftar tugas kelas, join dengan subjects',
      parameters: [idParam('classId', 'Class id')],
      responses: { 200: ok('Tasks retrieved') }
    }
  },
  '/api/subjects/{subjectId}/tasks': {
    get: {
      tags: ['Tasks'],
      summary: 'Daftar tugas berdasarkan mata kuliah',
      parameters: [idParam('subjectId', 'Subject id')],
      responses: { 200: ok('Subject tasks retrieved') }
    },
    post: {
      tags: ['Tasks'],
      summary: 'Tambah tugas, hanya admin_komting',
      parameters: [idParam('subjectId', 'Subject id')],
      requestBody: jsonBody('#/components/schemas/TaskRequest'),
      responses: { 201: ok('Task created') }
    }
  },
  '/api/tasks/{id}': {
    put: {
      tags: ['Tasks'],
      summary: 'Update tugas, hanya admin_komting',
      parameters: [idParam('id', 'Task id')],
      requestBody: jsonBody('#/components/schemas/TaskRequest'),
      responses: { 200: ok('Task updated') }
    },
    delete: {
      tags: ['Tasks'],
      summary: 'Hapus tugas, hanya admin_komting',
      parameters: [idParam('id', 'Task id')],
      responses: { 200: ok('Task deleted') }
    }
  },
  '/api/classes/{classId}/payments': {
    get: {
      tags: ['Payments'],
      summary: 'Daftar iuran kelas; mahasiswa hanya melihat miliknya',
      parameters: [idParam('classId', 'Class id')],
      responses: { 200: ok('Payments retrieved') }
    },
    post: {
      tags: ['Payments'],
      summary: 'Buat tagihan iuran untuk semua anggota kelas',
      parameters: [idParam('classId', 'Class id')],
      requestBody: jsonBody('#/components/schemas/PaymentRequest'),
      responses: { 201: ok('Payments created') }
    }
  },
  '/api/payments/{id}/pay': {
    put: {
      tags: ['Payments'],
      summary: 'Tandai iuran sebagai paid, admin_komting atau bendahara',
      parameters: [idParam('id', 'Payment id')],
      responses: { 200: ok('Payment marked as paid') }
    }
  },
  '/api/classes/{classId}/payments/summary': {
    get: {
      tags: ['Payments'],
      summary: 'Ringkasan iuran kelas',
      parameters: [idParam('classId', 'Class id')],
      responses: { 200: ok('Payment summary retrieved') }
    }
  },
  '/api/classes/{classId}/payments/me': {
    get: {
      tags: ['Payments'],
      summary: 'Status iuran user login',
      parameters: [idParam('classId', 'Class id')],
      responses: { 200: ok('My payments retrieved') }
    }
  },
  '/api/classes/{classId}/forums': {
    get: {
      tags: ['Forums'],
      summary: 'Daftar forum kelas',
      parameters: [idParam('classId', 'Class id')],
      responses: { 200: ok('Forums retrieved') }
    },
    post: {
      tags: ['Forums'],
      summary: 'Buat forum kelas atau mata kuliah, hanya admin_komting',
      parameters: [idParam('classId', 'Class id')],
      requestBody: jsonBody('#/components/schemas/ForumRequest'),
      responses: { 201: ok('Forum created') }
    }
  },
  '/api/forums/{forumId}/messages': {
    get: {
      tags: ['Forums'],
      summary: 'Daftar pesan forum, join users untuk sender_name',
      parameters: [idParam('forumId', 'Forum id')],
      responses: { 200: ok('Messages retrieved') }
    },
    post: {
      tags: ['Forums'],
      summary: 'Kirim pesan forum',
      parameters: [idParam('forumId', 'Forum id')],
      requestBody: jsonBody('#/components/schemas/MessageRequest'),
      responses: { 201: ok('Message sent') }
    }
  },
  '/api/classes/{classId}/whatsapp-config': {
    get: {
      tags: ['WhatsApp'],
      summary: 'Lihat konfigurasi WhatsApp, admin_komting atau bendahara',
      parameters: [idParam('classId', 'Class id')],
      responses: { 200: ok('WhatsApp config retrieved') }
    },
    put: {
      tags: ['WhatsApp'],
      summary: 'Update konfigurasi WhatsApp, admin_komting atau bendahara',
      parameters: [idParam('classId', 'Class id')],
      requestBody: jsonBody('#/components/schemas/WhatsappConfigRequest'),
      responses: { 200: ok('WhatsApp config saved') }
    }
  },
  '/api/classes/{classId}/send-payment-reminder': {
    post: {
      tags: ['WhatsApp'],
      summary: 'Generate link WhatsApp reminder iuran',
      parameters: [idParam('classId', 'Class id')],
      requestBody: jsonBody('#/components/schemas/PaymentReminderRequest'),
      responses: { 200: ok('WhatsApp payment reminder generated') }
    }
  },
  '/api/classes/{classId}/dashboard': {
    get: {
      tags: ['Dashboard'],
      summary: 'Data dashboard kelas',
      parameters: [idParam('classId', 'Class id')],
      responses: { 200: ok('Dashboard retrieved') }
    }
  }
};

module.exports = swaggerDocument;
