"use server";
import { prisma } from "@/app/db/prisma";
import { logSentryEvent } from "@/utils/sentrY";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth";
import { Ticket } from "@/generated/prisma";

export type ActionResT = {
  success: "pending" | "ok" | "failed";
  message: string;
};

export async function createTicket(
  prevState: ActionResT | null,
  formData: FormData,
): Promise<ActionResT | null> {
  const payload = await verifySession();
  if (!payload) return null;

  try {
    const subject = formData.get(`subject`) as string;
    const description = formData.get(`description`) as string;
    const priority = formData.get(`priority`) as string;

    // ℹ️ optional add sentry log
    if (!subject || !description || !priority) {
      const message = "❌ All fields should be filled";
      console.log(subject, description, priority, message);

      logSentryEvent(
        message,
        "ticket",
        { subject, description, priority },
        "warning",
      );

      // Sentry.captureMessage(`ll fields should be filled, {
      //   level: "warning",
      // });
      return { success: "failed", message: message };
    }

    const ticketData = await prisma.ticket.create({
      data: { subject, description, priority },
    });

    logSentryEvent(
      `Ticket was created: ${ticketData.id}`,
      "ticket",
      { ticketId: ticketData.id },
      "info",
    );

    return { success: "ok", message: `Ticket created 🚀` };

    // throw new Error(`🚨 test err`);
  } catch (error) {
    const message = "🚨 Error while creating the ticket";

    // ℹ️ capture errors and pass it to sentry
    logSentryEvent(
      message,
      "ticket",
      Object.fromEntries(formData.entries()),
      "error",
      error,
    );

    // Sentry.captureException(error, {
    //   extra: { formData: Object.fromEntries(formData.entries()) },
    // });
    console.log(error);
    return { success: "failed", message: message };
  }

  return { success: "ok", message: `OK` };
}

export async function getTickets(): Promise<
  ({ tickets: Ticket[] | null } & Partial<ActionResT>) | null
> {
  // Select * FROM Ticket ORDER BY createdAt DESC
  const payload = await verifySession();
  if (!payload) return null;

  try {
    const ticketsData = await prisma.ticket.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: "desc" },
    });

    logSentryEvent(`Fetched tickets ok`, "tickets", { tickets: {} }, "info");

    // console.log(ticketsData, "tickets ");

    ticketsData.sort((a, b) => a.id - b.id);

    return {
      tickets: ticketsData,
      success: "ok",
    };
  } catch (e) {
    console.log(e);
  }
  logSentryEvent(`Tickets ❌`, "tickets", { tickets: null }, "error");

  return {
    tickets: null,
    success: "failed",
    message: "Something went wrong see console",
  };
}

export async function deleteTicket(id: number) {
  console.log(`deleting ticket`);
  try {
    await prisma.ticket.delete({
      where: { id: id },
    });
    // console.log(data, "data");
    revalidatePath(`/tickets`, "page");
    return { success: true, message: "Deleted!" };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Deletion failed" };
  }
}

export async function getTicketById(id: string) {
  try {
    // Select * FROM ticket WHERE ID = id
    // Select * FROM TICKET WHERE ID = id LIMIT 1
    const ticketData = await prisma.ticket.findUnique({
      where: { id: Number(id) },
    });

    // const ticket = await prisma.ticket.findFirst({
    //   where: { subject: "Login issue" },
    // });

    if (!ticketData) {
      logSentryEvent(
        `Ticket not found ❌`,
        "tickets",
        { ticketId: id },
        "warning",
      );
    }
    return ticketData;
  } catch (e) {
    logSentryEvent(
      `Get ticket err ❌`,
      "tickets",
      { ticketId: id },
      "error",
      e,
    );
    return null;
  }
}
