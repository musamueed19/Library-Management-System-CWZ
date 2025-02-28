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
    next(error);
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
