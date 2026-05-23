const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn('DATABASE_URL is not set. Set it in .env before running the API.');
}

const shouldUseSsl = () => {
  if (!databaseUrl) return false;
  return process.env.NODE_ENV === 'production' || databaseUrl.includes('railway.app') || databaseUrl.includes('proxy.rlwy.net');
};

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: shouldUseSsl()
    ? {
        rejectUnauthorized: false
      }
    : false
});

const query = (text, params) => pool.query(text, params);

const testConnection = async () => {
  const result = await query('SELECT NOW() AS now');
  console.log(`Database connected at ${result.rows[0].now}`);
};

module.exports = {
  pool,
  query,
  testConnection
};
