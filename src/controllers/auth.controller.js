const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  return successResponse(res, 'Register success', user, 201);
});

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  return successResponse(res, 'Login success', data);
});

const profile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  return successResponse(res, 'Profile retrieved', user);
});

module.exports = {
  register,
  login,
  profile
};
