import { Resend } from "resend";

export type ContactEmailPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function sendContactEmail(payload: ContactEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const to = process.env.CONTACT_TO_EMAIL?.trim() || "jagrutivengurlekar@gmail.com";
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "Akshad Portfolio <onboarding@resend.dev>";

  const resend = new Resend(apiKey);
  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeSubject = escapeHtml(payload.subject);
  const safeMessage = escapeHtml(payload.message).replaceAll("\n", "<br />");

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: payload.email,
    subject: `Portfolio contact: ${payload.subject}`,
    text: [
      "New portfolio contact form submission",
      "",
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Subject: ${payload.subject}`,
      "",
      payload.message,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111;">
        <h2 style="margin:0 0 12px;">New portfolio contact</h2>
        <p style="margin:0 0 8px;"><strong>Name:</strong> ${safeName}</p>
        <p style="margin:0 0 8px;"><strong>Email:</strong> ${safeEmail}</p>
        <p style="margin:0 0 16px;"><strong>Subject:</strong> ${safeSubject}</p>
        <div style="padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px;background:#f8fafc;">
          ${safeMessage}
        </div>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message || "Failed to send contact email.");
  }

  return data;
}
