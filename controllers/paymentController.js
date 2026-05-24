
// const Payment = require("../models/Payment");

// const {
//   generateReference,
//   initiatePayment,
//   checkPaymentStatus,
// } = require("../utils/urubutoService");


// // CREATE PAYMENT (ALWAYS PENDING FIRST)


// const createPayment = async (req, res) => {
//   try {
//     const {
//       customerName,
//       phoneNumber,
//       productName,
//       price,
//       orderId,
//     } = req.body;

//     // VALIDATION
//     if (
//       !customerName ||
//       !phoneNumber ||
//       !productName ||
//       !price||
//       !orderId
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields",
//       });
//     }

//     const reference = generateReference();

//     // CALL URUBUTO
//     const result = await initiatePayment({
//       amount: Number(price),
//       phoneNumber,
//       customerName,
//       reference,
//     });

//     // ❌ STOP IF PAYMENT FAILED (DO NOT SAVE ANYTHING)
//     if (!result.success) {
//       return res.status(400).json({
//         success: false,
//         message: "Payment initiation failed",
//         error: result.error,
//       });
//     }

//     const urubutoData = result.data?.data;

//     // ✅ SAVE ONLY SUCCESSFUL INITIATION
//     const payment = await Payment.create({
//       reference,
//       customerName,
//       phoneNumber,
//       productName,
//       price,

//       paymentChannel: "MOMO",
//       status: "PENDING",

//       urubutoReference:
//         urubutoData?.internal_transaction_ref_number || null,

//       rawResponse: result.data,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Payment initiated successfully",
//       data: payment,
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };



// // GET ALL PAYMENTS
// const getAllPayments = async (req, res) => {
//   try {
//     const payments = await Payment.find().sort({
//       createdAt: -1,
//     });

//     return res.json({
//       success: true,
//       data: payments,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch payments",
//       error: error.message,
//     });
//   }
// };


// // GET SINGLE PAYMENT
// const getPayment = async (req, res) => {
//   try {
//     const payment = await Payment.findById(
//       req.params.id
//     );

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment not found",
//       });
//     }

//     return res.json({
//       success: true,
//       data: payment,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching payment",
//       error: error.message,
//     });
//   }
// };


// // CHECK PAYMENT STATUS (SYNC WITH URUBUTO)
// const paymentStatus = async (req, res) => {
//   try {
//     const { reference } = req.params;

//     const payment = await Payment.findOne({
//       reference,
//     });

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment not found",
//       });
//     }

//     const result =
//       await checkPaymentStatus(reference);

//     if (!result.success) {
//       return res.status(400).json({
//         success: false,
//         message: "Failed to check status",
//         error: result.error,
//       });
//     }

//     const status =
//       result.data?.data?.transaction_status ||
//       "PENDING";

//     payment.status = status;
//     payment.rawResponse = result.data;

//     await payment.save();

//     return res.json({
//       success: true,
//       status,
//       data: payment,
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Status check failed",
//       error: error.message,
//     });
//   }
// };


// // DELETE PAYMENT
// const deletePayment = async (req, res) => {
//   try {
//     const payment = await Payment.findByIdAndDelete(
//       req.params.id
//     );

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment not found",
//       });
//     }

//     return res.json({
//       success: true,
//       message: "Payment deleted",
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Delete failed",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   createPayment,
//   getAllPayments,
//   getPayment,
//   paymentStatus,
//   deletePayment,
// };














const Payment = require("../models/Payment");

const {
  generateReference,
  initiatePayment,
  checkPaymentStatus,
} = require("../utils/urubutoService");


// CREATE PAYMENT (ALWAYS PENDING FIRST)


const createPayment = async (req, res) => {
  try {
    const {
      customerName,
      phoneNumber,
      productName,
      price,
    } = req.body;

    // VALIDATION
    if (
      !customerName ||
      !phoneNumber ||
      !productName ||
      !price
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const reference = generateReference();

    // CALL URUBUTO
    const result = await initiatePayment({
      amount: Number(price),
      phoneNumber,
      customerName,
      reference,
    });

    // ❌ STOP IF PAYMENT FAILED (DO NOT SAVE ANYTHING)
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Payment initiation failed",
        error: result.error,
      });
    }

    const urubutoData = result.data?.data;

    // ✅ SAVE ONLY SUCCESSFUL INITIATION
    const payment = await Payment.create({
      reference,
      customerName,
      phoneNumber,
      productName,
      price,

      paymentChannel: "MOMO",
      status: "PENDING",

      urubutoReference:
        urubutoData?.internal_transaction_ref_number || null,

      rawResponse: result.data,
    });

    return res.status(201).json({
      success: true,
      message: "Payment initiated successfully",
      data: payment,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



// GET ALL PAYMENTS
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};


// GET SINGLE PAYMENT
const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(
      req.params.id
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    return res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching payment",
      error: error.message,
    });
  }
};


// CHECK PAYMENT STATUS (SYNC WITH URUBUTO)
const paymentStatus = async (req, res) => {
  try {
    const { reference } = req.params;

    const payment = await Payment.findOne({
      reference,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const result =
      await checkPaymentStatus(reference);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Failed to check status",
        error: result.error,
      });
    }

    const status =
      result.data?.data?.transaction_status ||
      "PENDING";

    payment.status = status;
    payment.rawResponse = result.data;

    await payment.save();

    return res.json({
      success: true,
      status,
      data: payment,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Status check failed",
      error: error.message,
    });
  }
};


// DELETE PAYMENT
const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(
      req.params.id
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    return res.json({
      success: true,
      message: "Payment deleted",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message,
    });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPayment,
  paymentStatus,
  deletePayment,
};
