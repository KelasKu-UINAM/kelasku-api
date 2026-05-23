const bcrypt = require('bcrypt');
const { query } = require('../config/db');
const generateToken = require('../utils/generateToken');

const createError = (message, statusCode = 400, errors = []) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
};

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password_hash: passwordHash, ...safeUser } = user;
  return safeUser;
};

const register = async ({ name, email, password, phone }) => {
  const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rowCount > 0) {
    throw createError('Email is already registered', 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await query(
    `INSERT INTO users (name, email, password_hash, phone)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, phone, created_at, updated_at`,
    [name, email, passwordHash, phone || null]
  );

  return result.rows[0];
};

const login = async ({ email, password }) => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rowCount === 0) {
    throw createError('Invalid email or password', 401);
  }

  const user = result.rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw createError('Invalid email or password', 401);
  }

  const safeUser = sanitizeUser(user);
  const token = generateToken({
    id: user.id,
    email: user.email,
    name: user.name
  });

  return {
    token,
    user: safeUser
  };
};

const getProfile = async (userId) => {
  const result = await query(
    'SELECT id, name, email, phone, created_at, updated_at FROM users WHERE id = $1',
    [userId]
  );

  if (result.rowCount === 0) {
    throw createError('User not found', 404);
  }

  return result.rows[0];
};

module.exports = {
  register,
  login,
  getProfile,
  sanitizeUser
};
