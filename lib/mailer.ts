export interface MailAttachment {
  filename: string;
  data: string;
  mimeType: string;
  size: number;
}

export interface SendOptions {
  to: string;
  toName?: string | null;
  from?: string;
  fromName?: string | null;
  subject: string;
  html: string;
  text?: string;
  cc?: string | null;
  bcc?: string | null;
  attachments?: MailAttachment[];
}

export async function sendMail(
  opts: SendOptions
): Promise<{ ok: true } | { ok: false; error: string }> {
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return {
      ok: false,
      error: "SMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS.",
    };
  }

  try {
    const { createTransport } = await import("nodemailer");
    const SMTP_PORT = parseInt(process.env.SMTP_PORT ?? "587", 10);
    const SMTP_SECURE = process.env.SMTP_SECURE === "true" || SMTP_PORT === 465;
    const FROM = opts.from ?? process.env.SMTP_FROM ?? SMTP_USER;

    const transporter = createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: opts.fromName ? `"${opts.fromName}" <${FROM}>` : FROM,
      to: opts.toName ? `"${opts.toName}" <${opts.to}>` : opts.to,
      cc: opts.cc ?? undefined,
      bcc: opts.bcc ?? undefined,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      attachments: opts.attachments?.map((a) => ({
        filename: a.filename,
        content: Buffer.from(a.data, "base64"),
        contentType: a.mimeType,
      })),
    });

    return { ok: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    return { ok: false, error };
  }
}

export function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .trim();
}

export function wrapInEmailTemplate(body: string, subject: string): string {
  const isHtml = /<[a-z][\s\S]*>/i.test(body);
  const htmlBody = isHtml
    ? body
    : body
        .split("\n")
        .map((l) => `<p style="margin:0 0 12px">${l || "&nbsp;"}</p>`)
        .join("");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${subject}</title>
</head>
<body style="margin:0;padding:24px;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1e293b;">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;">
  <div style="background:#0f1117;padding:20px 28px;">
    <p style="margin:0;color:#fff;font-size:15px;font-weight:600;">Eddie Marketing Solutions</p>
  </div>
  <div style="padding:28px;font-size:14px;line-height:1.6;color:#334155;">
    ${htmlBody}
  </div>
  <div style="padding:16px 28px;border-top:1px solid #f1f5f9;font-size:12px;color:#94a3b8;">
    Eddie Marketing Solutions FZE · eddietechsolns.com
  </div>
</div>
</body>
</html>`;
}
