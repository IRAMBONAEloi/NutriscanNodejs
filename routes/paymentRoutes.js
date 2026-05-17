const express = require("express");
const router = express.Router();

const {
  createPayment,
  checkPaymentStatus,
  getAllPayments,
} = require("../controllers/paymentController");

/**
 * CREATE PAYMENT
 */
router.post("/request-payment", createPayment);

/**
 * CHECK PAYMENT STATUS
 */
router.get("/status/:referenceId", checkPaymentStatus);

/**
 * GET ALL PAYMENTS
 */
router.get("/all", getAllPayments);

module.exports = router;