import nodemailer from "nodemailer";
import { contactInfo } from "../data/site";

const MAILER_HOST = process.env.MAILER_HOST;
const MAILER_PORT = process.env.MAILER_PORT;
const MAILER_SECURE = process.env.MAILER_SECURE;
const MAILER_USER = process.env.MAILER_USER;
const MAILER_PASSWORD = process.env.MAILER_PASSWORD;
const EMAIL_FROM = process.env.EMAIL_FROM;
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL;

if (!MAILER_HOST || !MAILER_PORT || !MAILER_USER || !MAILER_PASSWORD) {
  throw new Error(
    "Missing email configuration. Set MAILER_HOST, MAILER_PORT, MAILER_USER and MAILER_PASSWORD.",
  );
}

const transporter = nodemailer.createTransport({
  host: MAILER_HOST,
  port: Number(MAILER_PORT),
  secure: MAILER_SECURE === "true",
  auth: {
    user: MAILER_USER,
    pass: MAILER_PASSWORD,
  },
});

function getFromAddress() {
  if (EMAIL_FROM) return EMAIL_FROM;

  if (process.env.SUPABASE_URL) {
    try {
      const host = new URL(process.env.SUPABASE_URL).hostname;
      return `no-reply@${host}`;
    } catch {
      return "no-reply@example.com";
    }
  }

  return "no-reply@example.com";
}

function getAdminAddress() {
  return ADMIN_NOTIFICATION_EMAIL ?? contactInfo.emails[0];
}

export async function sendAdminBookingNotification(options: {
  studentName: string | null;
  studentEmail: string | null;
  packageCode: string | null;
  packageTitle: string | null;
  lessonsCount: number;
  scheduledAt?: string | null;
  notes: string | null;
  pickupLocation: string | null,
  dropoffLocation: string | null,
  tripDate: string | null,
  passengerCount: number,
}) {
  const from = getFromAddress();
  const to = getAdminAddress();

  const subject = `New booking: ${options.packageCode ?? "Unknown package"}`;
  const bodyLines = [
    `Student: ${options.studentName ?? "Unknown"}`,
    `Email: ${options.studentEmail ?? "Unknown"}`,
    `Package: ${options.packageCode ?? "Unknown"} ${options.packageTitle ?? ""}`.trim(),
    `Lessons: ${options.lessonsCount}`,
    `Preferred time: ${options.scheduledAt ?? "Not specified"}`,
    `Notes: ${options.notes ?? "None"}`,
  ];

  const text = `A new booking has been created.

${bodyLines.join("\n")}

Please review the booking in the admin dashboard.`;

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
  });
}
