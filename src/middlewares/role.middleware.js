const { query } = require('../config/db');
const { errorResponse } = require('../utils/response');

const roleMiddleware = (allowedRoles = []) => async (req, res, next) => {
  const classId = req.params.classId || req.params.id || req.body.class_id || req.body.classId;

  if (!classId) {
    return errorResponse(res, 'Class id is required for role validation', [], 400);
  }

  try {
    const result = await query(
      `SELECT id, class_id, user_id, role_in_class
       FROM class_members
       WHERE class_id = $1 AND user_id = $2`,
      [classId, req.user.id]
    );

    if (result.rowCount === 0) {
      return errorResponse(res, 'You are not a member of this class', [], 403);
    }

    const membership = result.rows[0];

    if (allowedRoles.length > 0 && !allowedRoles.includes(membership.role_in_class)) {
      return errorResponse(res, 'You do not have permission to access this resource', [], 403);
    }

    req.classMember = membership;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = roleMiddleware;
