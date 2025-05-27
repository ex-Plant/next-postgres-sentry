"use server";

import { ActionResT } from "@/actions/tickets.action";
import { logSentryEvent } from "@/utils/sentrY";
import { prisma } from "@/app/db/prisma";
import bcrypt from "bcryptjs";
import { setAuthCookie, signAuthToken } from "@/lib/auth";

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
      return { success: false, message: "Missing form data" };
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
        success: false,
        message: "registration failed - user already exists: " + user.email,
      };
    }

    // hash password
    const hashePass = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: "",
        name: "",
        surname: "",
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

    return { success: true, message: `User: ${name} ${surname} registered 🚀` };
  } catch (e) {
    logSentryEvent(
      "registering user failed",
      "auth",
      { data: Object.fromEntries(formData.entries()) },
      "error",
      e,
    );

    return { success: false, message: "Registering user failed" };
  }
}
