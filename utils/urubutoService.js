
require("dotenv").config();
const axios = require("axios");

const BASE_URL =
  process.env.URUBUTO_BASE_URL ||
  "https://staging.urubutopay.rw/api";

const API_KEY = process.env.URUBUTO_API_KEY;
const MERCHANT_CODE = process.env.URUBUTO_MERCHANT_CODE;
const SERVICE_CODE = process.env.URUBUTO_SERVICE_CODE;


// GENERATE REFERENCE
const generateReference = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "";

  for (let i = 0; i < 9; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }

  return ref;
};


// FORMAT PHONE (SAFE + CLEAN)
const formatPhoneNumber = (phone) => {
  if (!phone) throw new Error("phoneNumber is required");

  let p = String(phone).trim().replace(/\s/g, "");

  if (p.startsWith("0")) {
    p = "250" + p.substring(1);
  }

  return p;
};


// CHANNEL DETECTION (FIXED)
const getChannel = (phone) => {
  const p = String(phone).trim();

  if (/^07(2|8|9)/.test(p)) return "MOMO";
  if (/^07(3|4|5)/.test(p)) return "AIRTEL_MONEY";

  return CHANNEL_NAME;
};


// INITIATE PAYMENT
const initiatePayment = async ({
  amount,
  phoneNumber,
  customerName,
  reference,
}) => {
  try {
    if (!API_KEY || !MERCHANT_CODE) {
      throw new Error("Missing Urubuto API credentials");
    }

    const payload = {
      amount: Number(amount),
      channel_name: getChannel(phoneNumber),
      merchant_code: MERCHANT_CODE,
      service_code: SERVICE_CODE,
      payer_code: reference,
      payer_names: customerName || "Customer",
      phone_number: formatPhoneNumber(phoneNumber),
      transaction_id: reference,
      payer_email: process.env.PAYER_EMAIL || "",
    };

     console.log("📤 Urubuto payload:", JSON.stringify(payload, null, 2));

    const response = await axios.post(
      `${BASE_URL}/v2/payment/initiate`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };

  } catch (error) {
    console.error("❌ Urubuto error:", JSON.stringify(error.response?.data || error.message, null, 2));
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};


// CHECK PAYMENT STATUS
const checkPaymentStatus = async (reference) => {
  try {
    if (!API_KEY || !MERCHANT_CODE) {
      throw new Error("Missing Urubuto API credentials");
    }

    const response = await axios.post(
      `${BASE_URL}/v2/payment/transaction/status`,
      {
        transaction_id: reference,
        merchant_code: MERCHANT_CODE,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };

  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};

module.exports = {
  generateReference,
  initiatePayment,
  checkPaymentStatus,
};
