"use server";

import { ActionResT } from "@/actions/tickets.action";
import { logSentryEvent } from "@/utils/sentrY";
import { prisma } from "@/app/db/prisma";
import bcrypt from "bcryptjs";
import { deleteAuthCookie, setAuthCookie, signAuthToken } from "@/lib/auth";

export async function registerUser(
  prevState: ActionResT,
  formData: FormData,
): Promise<ActionResT> {
  try {
    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;

    if (!name || !surname || !email || !password) {
      logSentryEvent(
        "verifyAuthToken failed",
        "auth",
        { data: Object.fromEntries(formData.entries()) },
        "warning",
      );
      return { success: "ok", message: "Missing form data" };
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (user) {
      logSentryEvent(
        "registration failed - user already exists",
        "auth",
        { data: Object.fromEntries(formData.entries()) },
        "warning",
      );

      return {
        success: "failed",
        message: "registration failed - user already exists: " + user.email,
      };
    }

    // hash password
    const hashePass = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        surname,
        password: hashePass,
      },
    });

    /*After user is successfully registered we want them to be logged in straight away
     * In order to do that we want to sign the jwtToken and set the cookie with it
     * */

    const token = await signAuthToken({
      userId: newUser.id,
    });

    await setAuthCookie(token, "auth-cookie");

    logSentryEvent("registering user ok ✅", "auth", { email }, "info");

    return { success: "ok", message: `User: ${name} ${surname} registered 🚀` };
  } catch (e) {
    console.log(e, `❌`);
    logSentryEvent(
      "registering user failed",
      "auth",
      { data: Object.fromEntries(formData.entries()) },
      "error",
      e,
    );

    return { success: "failed", message: "Registering user failed" };
  }
}

export async function logInUser(
  prevState: ActionResT,
  formData: FormData,
): Promise<ActionResT> {
  try {
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;

    if (!email || !password) {
      logSentryEvent(
        "login failed",
        "auth",
        { data: Object.fromEntries(formData.entries()) },
        "warning",
      );
      return { success: "failed", message: "Missing form data" };
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      logSentryEvent(
        "login failed - user not found",
        "auth",
        { email: email },
        "warning",
      );
      return { success: "failed", message: "User not found ❌" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logSentryEvent(
        "login failed - invalid password",
        "auth",
        { password: password },
        "warning",
      );
      return { success: "failed", message: "Invalid password ❌" };

      // handle invalid password
    }

    logSentryEvent("password ok ✅ ", "auth", { email: email }, "info");

    const userData = await prisma.user.findUnique({
      where: { email: email },
      select: {
        name: true,
        surname: true,
        id: true,
      },
    });

    if (!userData) {
      logSentryEvent(
        " Getting user data failed - user data not found",
        "auth",
        { email: email },
        "error",
      );
      return { success: "failed", message: "No user data found ❌" };
    }

    const token = await signAuthToken({
      userId: userData.id,
    });

    await setAuthCookie(token, "auth-cookie");

    logSentryEvent("login user ok ✅", "auth", { email }, "info");

    return {
      success: "ok",
      message: `User: ${userData.name} ${userData.surname} logged 🚀`,
    };
  } catch (e) {
    console.log(e, `❌`);
    logSentryEvent(
      "login  failed",
      "auth",
      { data: Object.fromEntries(formData.entries()) },
      "error",
      e,
    );

    return { success: "failed", message: "Login failed 🥶" };
  }
}

export async function logOutUser() {
  console.log(`logOutUser`);
  try {
    await deleteAuthCookie("auth-cookie");
    logSentryEvent("logging out  ok ", "auth", { data: null }, "info");

    return { success: "ok", message: "You've been logged out 👋" };
  } catch (e) {
    console.log(e, `❌`);
    logSentryEvent("logging out failed", "auth", { data: null }, "error", e);

    return { success: "failed", message: "Logout failed 🥶" };
  }
}
