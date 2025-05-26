"use server";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/app/db/prisma";
import { logSentryEvent } from "@/utils/sentrY";
type FormState = {
  success: boolean;
  message: string;
};

export async function createTicket(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  console.log(1);

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
      return { success: false, message: message };
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

    console.log(3, `creating ticket...`);

    console.log(ticketData);
    return { success: true, message: `Ticket created 🚀` };

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
    return { success: false, message: message };
  }

  return { success: true, message: `OK` };
}
