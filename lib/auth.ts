import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { schema } from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import emailjs from "@emailjs/nodejs";

export const auth = betterAuth({
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      try {
        await emailjs.send(
          process.env.EMAILJS_SERVICE_ID!,
          process.env.EMAILJS_VERIFICATION_TEMPLATE_ID!,
          {
            to_email: user.email,
            to_name: user.name || "User",
            user_name: user.name || "User",
            verification_url: url,
            company_name: "NS Note",
            current_year: new Date().getFullYear().toString(),
          },
          {
            publicKey: process.env.EMAILJS_PUBLIC_KEY!,
            privateKey: process.env.EMAILJS_PRIVATE_KEY!,
          }
        );
        console.log("Verification email sent successfully via EmailJS");
      } catch (error) {
        console.error("Error sending verification email:", error);
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
        const requestTime = new Date().toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        });

        await emailjs.send(
          process.env.EMAILJS_SERVICE_ID!,
          process.env.EMAILJS_RESET_TEMPLATE_ID!,
          {
            to_email: user.email,
            to_name: user.name || "User",
            user_name: user.name || "User",
            reset_url: url,
            request_time: requestTime,
            company_name: "NS Note",
            current_year: new Date().getFullYear().toString(),
          },
          {
            publicKey: process.env.EMAILJS_PUBLIC_KEY!,
            privateKey: process.env.EMAILJS_PRIVATE_KEY!,
          }
        );
        console.log("Password reset email sent successfully via EmailJS");
      } catch (error) {
        console.error("Error sending password reset email:", error);
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
