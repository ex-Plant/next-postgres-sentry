"use server";

import { verifySession } from "@/lib/auth";
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

export async function getUser(): Promise<GetUserRes | null> {
  console.log("executing getUser...");

  const payload = await verifySession();
  if (!payload) return null;

  try {
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
