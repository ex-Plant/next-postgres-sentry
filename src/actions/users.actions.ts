"use server";

import { verifySession, getAuthCookie, verifyAuthToken } from "@/lib/auth";
import { ActionResT } from "@/actions/tickets.action";
import { prisma } from "@/app/db/prisma";
import { redirect } from "next/navigation";

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
    const { payload, success, message } = await verifySession();

    if (!payload) {
      return {
        message: message,
        success: success,
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
  } catch (e) {
    console.log(e);

    return {
      message: "Something went wrong",
      success: "failed",
    };
  }
}
