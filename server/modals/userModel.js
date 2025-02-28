import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // for security purposes, when i will get userInfo, I cannot get user's password
    },
    role: {
      type: String,
      enum: ["Amdin", "User"],
      default: "User",
    },
    accountVerified: {
      type: Boolean,
      default: false,
    },
    borrowedBooks: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Borrow",
        },
        returned: {
          type: Boolean,
          default: false,
        },
        bookTitle: String,
        borrowedDate: Date,
        dueDate: Date,
      },
    ],

    avatar: {
      public_id: String,
      url: String,
    },
    verificationCode: Number,
    verificationCodeExpire: Date,
    reserPasswordToken: String,
    reserPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// create a method
userSchema.methods.generateVerificationCode = function () {
  function generateRandomSixDigitNumber() {
    const firstDigit = Math.floor(Math.random() * 9) + 1;
    const remainingDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(5, 0);

    // 4 + "96710"
    // "496710"
    return +(firstDigit + remainingDigits);
    // return parseInt(firstDigit + remainingDigits);
  }
  const verificationCode = generateRandomSixDigitNumber();
  this.verificationCode = verificationCode;

  // 1s = 1000ms
  // 60 * 1000 (ms) = 60 s
  // 60 s * 15 = 15 min
  // The code will expire in 'next' 15 minutes.
  this.verificationCodeExpire = Date.now() + 15 * 60 * 1000;
  return verificationCode;
};

export const User = mongoose.model("User", userSchema);
