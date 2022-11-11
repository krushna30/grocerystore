const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controller/userController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// register new user
router.route("/register").post(registerUser);
// login for user
router.route("/login").post(loginUser);

// forgot password
router.route("/password/forgot").post(forgotPassword);
// logout
router.route("/logout").get(logout);
//reset password routes
router.route("/password/reset/:token").put(resetPassword);
// get user details
router.route("/me").get(isAuthenticatedUser, getUserDetails);

// update password
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

// update details
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

// get all users details --- admin only
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);

// get single user details --- admin only
router
  .route("/admin/users/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser);

  // update user role --admin only
  router
  .route("/admin/user/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole);

// delete user --- admin only
router
  .route("/admin/user/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
