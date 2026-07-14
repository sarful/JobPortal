/**
 * Restrict access to users with approved roles.
 *
 * Example:
 * authorize("employer", "admin")
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Authentication required.");
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Access denied. Required role: ${allowedRoles.join(" or ")}.`
      );
    }

    next();
  };
};