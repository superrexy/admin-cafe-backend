const express = require("express");
const authController = require("../controllers/auth.controller");
const roomController = require("../controllers/room.controller");
const bookingController = require("../controllers/booking.controller");
const foodndrinkController = require("../controllers/foodndrink.controller");
const dashboardController = require("../controllers/dashboard.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// / Index Route
router.get("/", (req, res) => {
  res.status(200).send("Service Admin Cafe API v1.0");
});

// Dashboard Statistic
router.get("/api/dashboard", dashboardController.statistic);

// Auth Route
router.post("/api/auth/register", authController.register);
router.post("/api/auth/login", authController.login);
router.post(
  "/api/auth/image-update",
  authMiddleware,
  authController.uploadProfile
);
router.post(
  "/api/auth/reset-password/request",
  authController.requestTokenResetPassword
);
router.post("/api/auth/reset-password", authController.resetPassword);
router.get("/api/auth/profile", authMiddleware, authController.profile);
router.post(
  "/api/auth/profile/update",
  authMiddleware,
  authController.updateProfile
);

// Rooms Route
router.get("/api/rooms", authMiddleware, roomController.index);
router.get("/api/rooms/:id", authMiddleware, roomController.show);
router.post("/api/rooms/create", authMiddleware, roomController.create);
router.put("/api/rooms/:id/update", authMiddleware, roomController.update);
router.delete("/api/rooms/:id/delete", authMiddleware, roomController.destroy);

// Rooms Route
router.get("/api/foods-drinks", authMiddleware, foodndrinkController.index);
router.get("/api/foods-drinks/:id", authMiddleware, foodndrinkController.show);
router.post(
  "/api/foods-drinks/create",
  authMiddleware,
  foodndrinkController.create
);
router.put(
  "/api/foods-drinks/:id/update",
  authMiddleware,
  foodndrinkController.update
);
router.delete(
  "/api/foods-drinks/:id/delete",
  authMiddleware,
  foodndrinkController.destroy
);

// Bookings Route
router.get("/api/bookings", authMiddleware, bookingController.index);
router.get("/api/bookings/:id", authMiddleware, bookingController.show);
router.post("/api/bookings/create", authMiddleware, bookingController.create);
router.put(
  "/api/bookings/:id/update",
  authMiddleware,
  bookingController.update
);
router.delete(
  "/api/bookings/:id/delete",
  authMiddleware,
  bookingController.destroy
);

module.exports = router;