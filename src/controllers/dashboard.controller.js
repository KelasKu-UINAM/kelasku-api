const dashboardService = require('../services/dashboard.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await dashboardService.getDashboard(req.params.classId, req.user.id);
  return successResponse(res, 'Dashboard retrieved', dashboard);
});

module.exports = {
  getDashboard
};
