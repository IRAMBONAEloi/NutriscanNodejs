const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "EUR" },
    referenceId: { type: String, required: true, unique: true },
    externalId: String,
    status: { type: String, default: "PENDING" },
    payerMessage: String,
    payeeNote: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);