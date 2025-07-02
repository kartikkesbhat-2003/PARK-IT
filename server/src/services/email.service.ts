import { Resend } from "resend";
import { EmailType } from "../@types";

const resend = new Resend("re_F5htgiK3_Fvi8r4Fe4641V5M7uJvv4E3b");

export function sendEmailToUser(email: string, type: EmailType, data: any) {
  switch (type) {
    case EmailType.VERIFICATION:
      return resend.emails.send({
        from: "onboarding@resend.dev",
        to: "satyamsingh748846@gmail.com",
        subject: "Verify your email",
        html: `<h1>Verify your email</h1> <p>Please click the link below to verify your email address:</p> <a href="http://localhost:3000/verify-email">Verify Email</a>`,
      });
    case EmailType.RESET_PASSWORD:
      return resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: email,
        subject: "Reset your password",
        html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
      });
    default:
      return resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Hello World",
        html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
      });
  }
}
