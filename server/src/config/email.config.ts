import nodemailer from "nodemailer";

import { EmailType } from "../@types";
import { env } from "./env.config";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: env.FROM_EMAIL,
    pass: env.GMAIL_PASSWORD,
  },
});

type sendVerificationEmailType = {
  type: EmailType.VERIFICATION;
  verificationToken: string;
};

type sendEmailToUserUsingGmailType = sendVerificationEmailType & {
  userEmail: string;
};

export const sendEmailToUserUsingGmail = async (
  userEmail: string,
  type: EmailType,
  verificationToken?: string
) => {
  console.log("userEmail is ", userEmail);
  const mailOptions = {
    from: env.FROM_EMAIL,
    to: userEmail,
    subject: "Email Verification",
    html: `<h1>Verify your email</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="http://localhost:5173/verify-user?token=${verificationToken}">Verify Email</a>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
