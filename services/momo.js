const axios = require("axios");

const {
  MTN_SUBSCRIPTION_KEY,
  MTN_API_USER,
  MTN_API_KEY,
  MTN_BASE_URL,
  MTN_ENVIRONMENT,
} = process.env;

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
          "Ocp-Apim-Subscription-Key":
            MTN_SUBSCRIPTION_KEY,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.log(error.response?.data || error.message);
    throw new Error("Failed to get MTN token");
  }
};

const requestToPay = async (
  accessToken,
  referenceId,
  paymentData
) => {
  try {
    await axios.post(
      `${MTN_BASE_URL}/collection/v1_0/requesttopay`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Reference-Id": referenceId,
          "X-Target-Environment": MTN_ENVIRONMENT,
          "Ocp-Apim-Subscription-Key":
            MTN_SUBSCRIPTION_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return true;
  } catch (error) {
    console.log(error.response?.data || error.message);
    throw new Error("Payment request failed");
  }
};

const getPaymentStatus = async (
  accessToken,
  referenceId
) => {
  try {
    const response = await axios.get(
      `${MTN_BASE_URL}/collection/v1_0/requesttopay/${referenceId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Target-Environment": MTN_ENVIRONMENT,
          "Ocp-Apim-Subscription-Key":
            MTN_SUBSCRIPTION_KEY,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error.response?.data || error.message);
    throw new Error("Failed to fetch payment status");
  }
};

module.exports = {
  getAccessToken,
  requestToPay,
  getPaymentStatus,
};