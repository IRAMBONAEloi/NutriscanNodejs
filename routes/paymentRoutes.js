const express = require("express");
const router = express.Router();

const {
  createPayment,
  getAllPayments,
  getPayment,
  paymentStatus,
  deletePayment,
} = require("../controllers/paymentController");


// CREATE PAYMENT
router.post("/create", createPayment);

// GET ALL PAYMENTS
router.get("/all", getAllPayments);

// GET SINGLE PAYMENT
router.get("/single/:id", getPayment);

// CHECK PAYMENT STATUS (BY REFERENCE)
router.get("/status/:reference", paymentStatus);

// DELETE PAYMENT
router.delete("/delete/:id", deletePayment);

module.exports = router;
