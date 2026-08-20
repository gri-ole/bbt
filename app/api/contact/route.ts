import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
};

// Create Supabase client (server-side, using service role key)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

export async function POST(req: Request): Promise<Response> {
  try {
    const { name, email, message } = (await req.json()) as ContactBody;

    if (!name || !email || !message) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      SMTP_SECURE,
      CONTACT_TO_EMAIL,
      CONTACT_FROM_EMAIL,
    } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      console.error("SMTP configuration is missing in environment variables");
      return Response.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    // Best-effort store in Supabase; email sending should still work if this fails
    if (supabase) {
      const { error: supabaseError } = await supabase
        .from("contact_messages")
        .insert({
          name,
          email,
          message,
        });

      if (supabaseError) {
        console.error(
          "Failed to save contact message to Supabase",
          supabaseError
        );
      }
    } else {
      console.warn(
        "Supabase client not configured (check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY), skipping DB save for contact message"
      );
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 465,
      secure: SMTP_SECURE !== "false",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const toEmail = CONTACT_TO_EMAIL || SMTP_USER;
    const fromEmail = CONTACT_FROM_EMAIL || SMTP_USER;

    await transporter.sendMail({
      from: `"BusyBuddy.Toys Contact" <${fromEmail}>`,
      to: toEmail,
      replyTo: email,
      subject: `New message from ${name}`,
      text: `New message from BusyBuddy.Toys contact form:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Error sending contact email", err);
    return Response.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}


