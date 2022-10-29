const express = require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controller/orderController");
const router = express.Router();

const {
  isAuthenticatedUser,
 authorizeRoles
} = require("../middleware/auth");

// new Order created
router.route("/order/new").post(isAuthenticatedUser, newOrder);
// Get single order
router.route("/order/:id").get(isAuthenticatedUser,  getSingleOrder);
// Get logged in users orders
router.route("/orders/me").get(isAuthenticatedUser, myOrders);
// Admin routes for getting order details
     // getting all the orders
router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

  // updating the order status
router.route("/admin/order/:id").put(isAuthenticatedUser, authorizeRoles("admin"),updateOrder);

// deleting the order
router.route("/admin/order/:id").delete(isAuthenticatedUser, authorizeRoles("admin"),deleteOrder);

module.exports = router;
