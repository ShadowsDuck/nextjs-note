"use server";

import { auth } from "../auth";

export const signIn = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    const e = error as Error;
    return { success: false, message: e.message || "Failed to sign in" };
  }
};

export const signUp = async (email: string, password: string, name: string) => {
  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    return { success: true, message: "Signed up successfully" };
  } catch (error) {
    const e = error as Error;
    return { success: false, message: e.message || "Failed to sign up" };
  }
};
