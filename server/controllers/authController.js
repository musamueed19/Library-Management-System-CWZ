// custom build ErrorHandler Class extends Error class - for custom error handling (Middleware)
import ErrorHandler from "../middlewares/errorMiddleware.js";

// wrapper function for "custom defined Error Handling" using (Middleware).
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

// managing users for authentication
import { User } from "../modals/userModel.js";

// for user password & hashing
import bcrypt from "bcrypt";
import crypto from "crypto";

// sending verification code
import { sendVerificationCode } from "../utils/sendVerificationCode.js";


// sending token - after OTP Validation and User Verification
import { sendToken } from "../utils/sendToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(new ErrorHandler("PLease enter all fields.", 400));
    }
    const isRegistered = await User.findOne({ email, accountVerified: true });
    if (isRegistered) {
      return next(new ErrorHandler("User already exists.", 400));
    }
    const registrationAttemptsByUser = await User.find({
      email,
      accountVerified: false,
    });
    if (registrationAttemptsByUser.length >= 10) {
      return next(
        new ErrorHandler(
          "You have exceeded the number of registration attempts. Please contact support.",
          400
        )
      );
      //   400 statusCode means, BAD REQUEST
    }

    if (password.length < 8 || password.length > 16) {
      return next(
        new ErrorHandler("Password must be between 8 and 16 characters.", 400)
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const verificationCode = await user.generateVerificationCode();
    // console.log(verificationCode)
    await user.save();
    sendVerificationCode(verificationCode, email, res);
  } catch (error) {
    return next(error);
  }
});

// basically catchAsyncErrors is a function that accepts (a function). And it returns its own custom function

// This async function is the one that is being passed to catchAsyncErrors. It is the actual function that is  being executed when the route is hit.
// This function is the one that is being wrapped by catchAsyncErrors. So if there is an
// error in this function, catchAsyncErrors will catch it and send a response back to the client
// with a 500 status code. This is the default behavior of catchAsyncErrors. But we
// can customize it to send a different status code or response back to the client if we want to
// catchAsyncErrors is a function that accepts a function as an argument. It returns a new function
// that wraps the original function. So when we call the new function, it will execute the original
// function and if there is an error, it will catch it and send a response back to the
// client with a 500 status code. This is the default behavior of catchAsyncErrors. But
// we can customize it to send a different status code or response back to the client if we want
// to. So basically, catchAsyncErrors is a function that accepts a function as an argument.

// This function is the one that is being wrapped by catchAsyncErrors. So if there is an error in this function, catchAsyncErrors will catch it and send a response back to the client.

export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  // waht we need from frontend side, aur POST Request

  const { email, otp } = req.body;

  // if both are missing
  if (!email && !otp) {
    return next(new ErrorHandler("Email and otp are missing.", 400));
    // Bad Request - 400
  }

// if emai is missing
  if (!email) {
    return next(new ErrorHandler("Email is missing.", 400));
    // Bad Request - 400
  }

  // if otp is missing
  if (!otp) {
    return next(new ErrorHandler("Otp is missing.", 400));
    // Bad Request - 400
  }

  try {
    //
    const userAllEntries = await User.find({
      email,
      accountVerified: false,
    }).sort({ createdAt: -1 }); //sort on the basis of User "Created at" Descending Order. (Latest user created comes first)

    // if someone, has not try
    if (!userAllEntries) {
      return next(new ErrorHandler("User not found.", 404));
      // Resource, or user could found by the server - 404
    }

    let user;

    // whether code is expired or not, if user has tried many times.
    // then delete all remaing users, except the latest one - stored in the "user" variable (object).
    if (userAllEntries.length > 1) {
      user = userAllEntries[0];

      // how to tell DB to delete all such entries from the "User Modal"
      await User.deleteMany({
        // $ne stands for notEqual
        // it means, if it is notEqual to the user obj's id, then delete- otherwise do not delete that single user.
        _id: { $ne: user._id },

        // the email of the user should be the same email, which for user is trying to verify OTP.
        email,

        // and those "User records or - objects from User Collection" will be deleted, those have accound Unverified
        accountVerified: false,
      });
    } else {
      user = userAllEntries[0];
    }

    // make sure, OTP is converted to Number - as DB USER Schema property, VerificationCode is (Number Type)
    if (user.verificationCode !== +otp) {
      return next(new ErrorHandler("Invalid OTP.", 400));
      // Bad Request, as we say the Client, that we cannot move forward, it is incorrect - 400
    }

    // store current time
    const currentTime = Date.now();

    // Get User record, code expiry DateTime - get only time
    const verificationCodeExpire = new Date(
      user.verificationCodeExpire
    ).getTime();

    // Now, both have same format
    if (currentTime > verificationCodeExpire) {
      return next(new ErrorHandler("OTP expired.", 400));
    }

    // Now, checked that, user have correct OTP, and within expiry time. (Means OTP is fresh).

    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;

    // do validations on only those fields of the (user object in the User Collection) - of which fields we have modified, not on others, like password
    await user.save({ validateModifiedOnly: true });

    // Now, we need to send the token to the client,
    sendToken(user, 200, "Account Verified.", res);

    // catch, if any unconditional error occurs
  } catch (error) {
    return next(new ErrorHandler("Internal server error.", 500));
  }
});
