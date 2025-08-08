import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { schema } from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
// import { Resend } from "resend";
// import VerificationEmail from "@/components/emails/verification-email";
// import PasswordResetEmail from "@/components/emails/reset-email";

// const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  // emailVerification: {
  //   sendVerificationEmail: async ({ user, url }) => {
  //     await resend.emails.send({
  //       from: "onboarding@resend.dev",
  //       to: [user.email],
  //       subject: "Verify your email address",
  //       react: VerificationEmail({
  //         userName: user.name,
  //         verificationUrl: url,
  //       }),
  //     });
  //   },
  //   sendOnSignUp: true,
  // },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    // requireEmailVerification: true,
    // sendResetPassword: async ({ user, url }) => {
    //   await resend.emails.send({
    //     from: "NS Note <nsnote@tanaphatdev.com>",
    //     to: [user.email],
    //     subject: "Reset your password",
    //     react: PasswordResetEmail({
    //       userName: user.name,
    //       resetUrl: url,
    //       requestTime: new Date().toISOString(),
    //     }),
    //   });
    // },
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
