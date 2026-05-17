

// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // User Schema
// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'Please provide a name'],
//       trim: true,
//       minlength: [2, 'Name must be at least 2 characters'],
//       maxlength: [50, 'Name cannot exceed 50 characters']
//     },

//     email: {
//       type: String,
//       required: [true, 'Please provide an email'],
//       unique: true, // ✅ creates unique index automatically
//       lowercase: true,
//       trim: true,
//       match: [
//         /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//         'Please provide a valid email address'
//       ]
//     },

//     password: {
//       type: String,
//       required: [true, 'Please provide a password'],
//       minlength: [6, 'Password must be at least 6 characters'],
//       select: false
//     },

//     role: {
//       type: String,
//       enum: {
//         values: ['manager', 'chef', 'staff'],
//         message: 'Role must be either manager, chef, or staff'
//       },
//       default: 'staff'
//     },

//     isActive: {
//       type: Boolean,
//       default: true
//     },

//     lastLogin: {
//       type: Date,
//       default: null
//     },

//     // 🔐 Session token storage
//     token: {
//       type: String,
//       default: null
//     }
//   },
//   {
//     timestamps: true, // ✅ automatically adds createdAt & updatedAt
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
//   }
// );

// // 🔐 Hash password before save
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     return next();
//   }

//   try {
//     const saltRounds =
//       parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;

//     const salt = await bcrypt.genSalt(saltRounds);

//     this.password = await bcrypt.hash(this.password, salt);

//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // 🔐 Compare password
// userSchema.methods.comparePassword = async function (
//   candidatePassword
// ) {
//   return await bcrypt.compare(
//     candidatePassword,
//     this.password
//   );
// };

// // 🔐 Generate JWT Token
// userSchema.methods.generateAuthToken = function () {
//   return jwt.sign(
//     {
//       id: this._id,
//       email: this.email,
//       role: this.role,
//       name: this.name
//     },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: process.env.JWT_EXPIRE || '1d'
//     }
//   );
// };

// // 🔐 Clean response
// userSchema.methods.toJSON = function () {
//   const user = this.toObject();

//   delete user.password;
//   delete user.__v;

//   return user;
// };

// // 🔍 Find by email
// userSchema.statics.findByEmail = function (email) {
//   return this.findOne({
//     email: email.toLowerCase()
//   });
// };

// // ✅ Additional indexes (NO duplicate email index)
// userSchema.index({ role: 1 });
// userSchema.index({ createdAt: -1 });

// // Model
// const User = mongoose.model('User', userSchema);

// module.exports = User;
















const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =========================
// User Schema
// =========================
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },

    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },

    role: {
      type: String,
      enum: {
        values: ['manager', 'chef', 'staff'],
        message: 'Role must be either manager, chef, or staff'
      },
      default: 'staff'
    },

    isActive: {
      type: Boolean,
      default: true
    },

    lastLogin: {
      type: Date,
      default: null
    },

    token: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// =========================
// Hash Password Before Save
// =========================
userSchema.pre('save', async function () {
  // Only hash password if modified
  if (!this.isModified('password')) {
    return;
  }

  const saltRounds =
    parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;

  const salt = await bcrypt.genSalt(saltRounds);

  this.password = await bcrypt.hash(this.password, salt);
});

// =========================
// Compare Password Method
// =========================
userSchema.methods.comparePassword = async function (
  candidatePassword
) {
  return await bcrypt.compare(
    candidatePassword,
    this.password
  );
};

// =========================
// Generate JWT Token
// =========================
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      role: this.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '1d'
    }
  );
};

// =========================
// Clean Response
// =========================
userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;
  delete user.__v;

  return user;
};

// =========================
// Static Method - Find by Email
// =========================
userSchema.statics.findByEmail = function (email) {
  return this.findOne({
    email: email.toLowerCase()
  });
};

// =========================
// Indexes
// =========================
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// =========================
// Model
// =========================
const User = mongoose.model('User', userSchema);

module.exports = User;