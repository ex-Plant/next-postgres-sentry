import { SignJWT, jwtVerify } from "jose";
import { logSentryEvent } from "@/utils/sentrY";
import { cookies } from "next/headers";
import { AuthPayload } from "@/actions/users.actions";
import { redirect } from "next/navigation";

const secret = process.env.AUTH_SECRET;
const secretEncoded = new TextEncoder().encode(secret);

/*No try/catch at lower level:
 Errors bubble up automatically to the caller.
 You can't log, transform, or add context to the error at the lower level.
 Useful if you want to handle/log all errors only at the top level.
 try/catch + rethrow at lower level:
 Lets you log the error, add context, or perform cleanup before rethrowing.
 The error still bubbles up, but now you have more information (e.g., Sentry logs, custom error messages) from the lower level.
 You can also throw a custom error type/message if needed.
 Summary:
 try/catch + rethrow = error still propagates, but you can log or enrich it at the point of failure.
 No try/catch */

// create sigh auth token - this will encrypt and sign token
export async function signAuthToken(payload: any) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .setIssuedAt()
      .sign(secretEncoded);
    return token;
  } catch (e) {
    logSentryEvent("SignAuthToken failed", "auth", { payload }, "error");
    console.log(e);
    throw new Error(`Token signing failed`);
  }
}

// decrypt and verify token

export async function verifyAuthToken<T>(token: string): Promise<T> {
  try {
    const { payload } = await jwtVerify(token, secretEncoded);

    return payload as T;
  } catch (e) {
    console.log(e);
    logSentryEvent(
      "verifyAuthToken failed",
      "auth",
      { tokenSliced: token.slice(0, 10) },
      "error",
    );
    throw new Error("verifyAuthToken failed");
  }
}

export async function setAuthCookie(token: string, cookieName: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set(cookieName, token, {
      //The cookie cannot be accessed by JavaScript in the browser (via document.cookie). Helps prevent XSS attacks.
      httpOnly: true,
      /*Restricts the cookie to be sent only with "safe" cross-site requests (like GET, but not POST). Helps prevent CSRF attacks. "lax" is a good default for auth.*/
      sameSite: "lax",
      //The cookie is only sent over HTTPS when secure is true. In development, it can be false so local testing works.
      secure: process.env.NODE_ENV === "production",

      path: "/", //The cookie is sent for all routes on your domain (not just a subPath).
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  } catch (e) {
    console.log(e);
    logSentryEvent(
      "setAuthCookie failed",
      "auth",
      { tokenSliced: token.slice(0, 10) },
      "error",
    );
    throw new Error("setAuthCookie failed");
  }
}
//
// export async function deleteAuthCookie(cookieName: string) {
//   try {
//     (await cookies()).delete("auth-cookie");
//   } catch (e) {
//     console.log(e);
//     logSentryEvent("deleteAuthCookie failed", "auth", { cookieName }, "error");
//     throw new Error("deleteAuthCookie failed");
//   }
// }

export async function verifySession(): Promise<AuthPayload | null> {
  // const tokenFromCookie = await getAuthCookie("auth-cookie");
  // immediately awaited expression i
  const token = (await cookies()).get("auth-cookie")?.value;

  if (!token) {
    console.log("❌ No auth cookie found redirecting to login...  ");
    redirect("/login");
  }

  const payload = await verifyAuthToken<AuthPayload>(token);

  if (!payload) return null;

  return payload;
}

// export async function getAuthCookie(cookieName: string) {
//   try {
//     const cookieStore = await cookies();
//
//     const storedToken = cookieStore.get(cookieName);
//     return storedToken?.value;
//   } catch (e) {
//     console.log(e);
//     logSentryEvent("getAuthCookie failed", "auth", { cookieName }, "error");
//     throw new Error("setAuthCookie failed");
//   }
// }
