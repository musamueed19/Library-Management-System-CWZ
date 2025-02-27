import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
    select: false,
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
}, {
  timestamps: true
});

export const User = mongoose.model("User", userSchema);
