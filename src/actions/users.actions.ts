"use server";

import { getAuthCookie, verifyAuthToken } from "@/lib/auth";
import { ActionResT } from "@/actions/tickets.action";
import { prisma } from "@/app/db/prisma";

export type GetUserRes = {
  data?: {
    email: string;
    name: string;
    id: string;
  } | null;
} & ActionResT;

export type AuthPayload = {
  userId: string;
};
export async function getUser(): Promise<GetUserRes> {
  console.log("executing getUser...");
  try {
    const tokenFromCookie = await getAuthCookie("auth-cookie");

    if (!tokenFromCookie) {
      return {
        message: "No token",
        success: "failed",
      };
    }

    // console.log({ tokenFromCookie });

    const payload = await verifyAuthToken<AuthPayload>(tokenFromCookie);

    console.log(payload.userId as string);

    if (!payload) {
      return {
        message: "No payload",
        success: "failed",
      };
    }

    const fullUserData = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return {
      message: fullUserData?.email as string,
      success: "ok",
      data: fullUserData,
    };

    console.log({ fullUserData });

    console.log(tokenFromCookie);
  } catch (e) {
    console.log(e);

    return {
      message: "Something went wrong",
      success: "failed",
    };
  }
}
