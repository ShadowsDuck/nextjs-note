import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { schema } from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import {
  createEmailTransporter,
  createVerificationEmailTemplate,
  createResetPasswordEmailTemplate,
  sendEmail,
} from "@/lib/email";

export const auth = betterAuth({
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      try {
        const transporter = createEmailTransporter();

        const htmlContent = createVerificationEmailTemplate({
          userName: user.name || "User",
          verificationUrl: url,
          companyName: "NS Note",
          currentYear: new Date().getFullYear().toString(),
        });

        const mailOptions = {
          from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "ยืนยันอีเมลของคุณ - NS Note",
          html: htmlContent,
        };

        const messageId = await sendEmail(transporter, mailOptions);
        console.log("✅ Verification email sent successfully:", messageId);
      } catch (error) {
        console.error("❌ Error sending verification email:", error);
        throw error;
      }
    },
    sendOnSignUp: true,
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        const transporter = createEmailTransporter();

        const requestTime = new Date().toLocaleString("th-TH", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        });

        const htmlContent = createResetPasswordEmailTemplate({
          userName: user.name || "User",
          resetUrl: url,
          requestTime: requestTime,
          companyName: "NS Note",
          currentYear: new Date().getFullYear().toString(),
        });

        const mailOptions = {
          from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "รีเซ็ตรหัสผ่าน - NS Note",
          html: htmlContent,
        };

        const messageId = await sendEmail(transporter, mailOptions);
        console.log("✅ Password reset email sent successfully:", messageId);
      } catch (error) {
        console.error("❌ Error sending password reset email:", error);
        throw error;
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [nextCookies()],
});
