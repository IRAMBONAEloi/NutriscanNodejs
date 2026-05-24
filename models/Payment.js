

// const mongoose = require("mongoose");

// // SAFE UNIQUE TRANSACTION ID (VERY IMPORTANT FIX)
// const generateTransactionId = () => {
//   return Math.floor(
//     1000000000 + Math.random() * 9000000000
//   ).toString();
// };

// const paymentSchema = new mongoose.Schema(
//   {
//     reference: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     // ✅ ORDER ID (SAFE UNIQUE STRING)
//     orderId: {
//       type: String,
//       unique: true,
//       sparse: true
     
//     },

//     // ✅ TRANSACTION ID (SAFE RANDOM NUMBER STRING)
//     transactionId: {
//       type: String,
//       unique: true,
//       sparse: true,
//       default: generateTransactionId,
//     },

//     customerName: {
//       type: String,
//       required: true,
//     },

//     phoneNumber: {
//       type: String,
//       required: true,
//     },

//     productName: {
//       type: String,
//       required: true,
//     },

//     price: {
//       type: Number,
//       required: true,
//     },

//     paymentChannel: {
//       type: String,
//       default: "MOMO",
//     },

//     status: {
//       type: String,
//       enum: ["PENDING", "SUCCESS", "FAILED"],
//       default: "PENDING",
//     },

//     urubutoReference: {
//       type: String,
//       default: null,
//     },

//     rawResponse: {
//       type: Object,
//       default: {},
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Payment", paymentSchema);


















const mongoose = require("mongoose");

// SAFE UNIQUE ORDER ID
const generateOrderId = () => {
  return `ORD-${Date.now()}-${Math.floor(
    Math.random() * 10000
  )}`;
};

// SAFE UNIQUE TRANSACTION ID (VERY IMPORTANT FIX)
const generateTransactionId = () => {
  return Math.floor(
    1000000000 + Math.random() * 9000000000
  ).toString();
};

const paymentSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
    },

    // ✅ ORDER ID (SAFE UNIQUE STRING)
    orderId: {
      type: String,
      unique: true,
      sparse: true,
      default: generateOrderId,
    },

    // ✅ TRANSACTION ID (SAFE RANDOM NUMBER STRING)
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
      default: generateTransactionId,
    },

    customerName: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    paymentChannel: {
      type: String,
      default: "MOMO",
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },

    urubutoReference: {
      type: String,
      default: null,
    },

    rawResponse: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
