const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./routes/auth.routes');
const classRoutes = require('./routes/class.routes');
const subjectRoutes = require('./routes/subject.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const announcementRoutes = require('./routes/announcement.routes');
const taskRoutes = require('./routes/task.routes');
const paymentRoutes = require('./routes/payment.routes');
const forumRoutes = require('./routes/forum.routes');
const whatsappRoutes = require('./routes/whatsapp.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const errorMiddleware = require('./middlewares/error.middleware');
const { successResponse, errorResponse } = require('./utils/response');
const swaggerDocument = require('./docs/swagger');

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:']
      }
    }
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  successResponse(res, 'KelasKu UINAM API is running', {
    name: 'KelasKu UINAM Backend',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  successResponse(res, 'Healthy', { uptime: process.uptime() });
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: 'KelasKu UINAM API Docs',
    swaggerOptions: {
      persistAuthorization: true
    }
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api', subjectRoutes);
app.use('/api', scheduleRoutes);
app.use('/api', announcementRoutes);
app.use('/api', taskRoutes);
app.use('/api', paymentRoutes);
app.use('/api', forumRoutes);
app.use('/api', whatsappRoutes);
app.use('/api', dashboardRoutes);

app.use((req, res) => {
  errorResponse(res, 'Route not found', [], 404);
});

app.use(errorMiddleware);

module.exports = app;
