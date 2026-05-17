const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const Payment = require("../models/Payment");
require("dotenv").config();

const MTN_SUBSCRIPTION_KEY = process.env.MTN_SUBSCRIPTION_KEY;
const MTN_API_USER = process.env.MTN_API_USER;
const MTN_API_KEY = process.env.MTN_API_KEY;
const MTN_BASE_URL = process.env.MTN_BASE_URL;
const MTN_ENVIRONMENT = process.env.MTN_ENVIRONMENT;

/**
 * GET ACCESS TOKEN
 */
const getAccessToken = async () => {
  try {
    const auth = Buffer.from(
      `${MTN_API_USER}:${MTN_API_KEY}`
    ).toString("base64");

    const response = await axios.post(
      `${MTN_BASE_URL}/collection/token/`,
      {},
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Ocp-Apim-Subscription-Key": MTN_SUBSCRIPTION_KEY,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.log(error.response?.data || error.message);
    throw new Error("Failed to get MTN token");
  }
};

/**
 * CREATE PAYMENT
 */
const createPayment = async (req, res) => {
  try {
    const {
      phoneNumber,
      amount,
      currency,
      payerMessage,
      payeeNote,
    } = req.body;

    const referenceId = uuidv4();
    const token = await getAccessToken();

    const payload = {
      amount: amount.toString(),
      currency: currency || "EUR",
      externalId: Date.now().toString(),
      payer: {
        partyIdType: "MSISDN",
        partyId: phoneNumber,
      },
      payerMessage: payerMessage || "Payment Request",
      payeeNote: payeeNote || "MTN Payment",
    };

    await axios.post(
      `${MTN_BASE_URL}/collection/v1_0/requesttopay`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Reference-Id": referenceId,
          "X-Target-Environment": MTN_ENVIRONMENT,
          "Ocp-Apim-Subscription-Key": MTN_SUBSCRIPTION_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const payment = await Payment.create({
      phoneNumber,
      amount,
      currency,
      referenceId,
      externalId: payload.externalId,
      payerMessage,
      payeeNote,
      status: "PENDING",
    });

    return res.status(201).json({
      success: true,
      message: "Payment request sent successfully",
      payment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * CHECK PAYMENT STATUS
 */
const checkPaymentStatus = async (req, res) => {
  try {
    const { referenceId } = req.params;

    const token = await getAccessToken();

    const response = await axios.get(
      `${MTN_BASE_URL}/collection/v1_0/requesttopay/${referenceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Target-Environment": MTN_ENVIRONMENT,
          "Ocp-Apim-Subscription-Key": MTN_SUBSCRIPTION_KEY,
        },
      }
    );

    await Payment.findOneAndUpdate(
      { referenceId },
      { status: response.data.status },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      status: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET ALL PAYMENTS
 */
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPayment,
  checkPaymentStatus,
  getAllPayments,
};