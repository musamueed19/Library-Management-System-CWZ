import nodeMailer from "nodemailer";

export default async function sendEmail({ email, subject, message }) {
  // first we will create a transporter
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    service: process.env.SMTP_SERVICE,
      port: process.env.SMTP_PORT,
    // secure: true, //by Default it is True
    
    //   for 2-Factor Authentication, we will define this "auth"
      auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // we will provide mail options - whatever we will create
  const mailOptions = {
    // from: process.env.SMTP_HOST_EMAIL,
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html: message,
    // text: "You email verification code is: " + "759871",
    };
    


    // send email to the client email 
    await transporter.sendMail(mailOptions);
}
