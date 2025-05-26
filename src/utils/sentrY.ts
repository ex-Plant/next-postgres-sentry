import * as Sentry from "@sentry/nextjs";
import { SeverityLevel } from "@sentry/nextjs";

type LogLevel = "";

export function logSentryEvent(
  message: string,
  category: string = "",
  data: Record<string, unknown>,
  level: SeverityLevel,
  error?: unknown,
) {
  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level,
  });
}
