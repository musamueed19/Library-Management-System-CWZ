import { generateVerificationOtpEmailTemplate } from "./emailTemplate.js";
import sendEmail from "./sendEmail.js";

export async function sendVerificationCode(verificationCode, email, res) {
  try {
    const message = generateVerificationOtpEmailTemplate(verificationCode); // at start this function doesnot exists - generate whole OTP Template and return that - we will store this template in the 'message' variable.

    sendEmail({
      email,
      subject: "Verification Code (BookWorm Library Management System)",
      message,
    });
    //   at start this function does not exits - through which we can send email, we will create this function.
    // This will accept some paramters as mentioned above

    return res.status(200).json({
      success: true,
      message: "Verification code sent successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send Verification code.",
    });
  }
}
