import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

router.post("/book-meeting", async (req, res) => {
  const { name, email, phone, date, time } = req.body as {
    name: string; email: string; phone: string; date: string; time: string;
  };

  if (!name || !email || !date || !time) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  // ── Send email ────────────────────────────────────────────────────────────
  const smtpHost = process.env["SMTP_HOST"];
  const smtpPort = Number(process.env["SMTP_PORT"] ?? "465");
  const smtpUser = process.env["SMTP_USER"];
  const smtpPass = process.env["SMTP_PASS"];

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn("[booking] SMTP not configured — booking logged only:", {
      name, email, phone, date, time,
    });
    res.json({ ok: true, warning: "Email not sent (SMTP not configured)" });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0d0d0d;color:#fff;padding:32px;border-radius:12px">
      <h2 style="color:#ff5500;margin-top:0">📅 New Meeting Request</h2>
      <table style="width:100%;border-collapse:collapse;font-size:15px">
        <tr><td style="padding:8px 0;color:#aaa;width:120px">Name</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
        <tr><td style="padding:8px 0;color:#aaa">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#ff5500">${email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#aaa">Phone</td><td style="padding:8px 0">${phone || "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#aaa">Date</td><td style="padding:8px 0">${date}</td></tr>
        <tr><td style="padding:8px 0;color:#aaa">Time</td><td style="padding:8px 0">${time}</td></tr>
      </table>
      <hr style="border:none;border-top:1px solid #222;margin:24px 0"/>
      <p style="color:#666;font-size:12px;margin:0">Sent from swissulife.com schedule form</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Swissulife Media" <${smtpUser}>`,
      to: "anas@swissulife.com",
      replyTo: email,
      subject: `New Meeting — ${name} · ${date} at ${time}`,
      html,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error("[booking] Failed to send email:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// ── General contact form ────────────────────────────────────────────────────
router.post("/contact", async (req, res) => {
  const { name, email, phone, company, message } = req.body as {
    name: string; email: string; phone?: string; company?: string; message: string;
  };

  if (!name || !email || !message) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const smtpHost = process.env["SMTP_HOST"];
  const smtpPort = Number(process.env["SMTP_PORT"] ?? "465");
  const smtpUser = process.env["SMTP_USER"];
  const smtpPass = process.env["SMTP_PASS"];

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn("[contact] SMTP not configured — message logged:", { name, email, company, message });
    res.json({ ok: true, warning: "Email not sent (SMTP not configured)" });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0d0d0d;color:#fff;padding:32px;border-radius:12px">
      <h2 style="color:#ff5500;margin-top:0">✉️ New Contact Message</h2>
      <table style="width:100%;border-collapse:collapse;font-size:15px">
        <tr><td style="padding:8px 0;color:#aaa;width:120px">Name</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
        <tr><td style="padding:8px 0;color:#aaa">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#ff5500">${email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#aaa">Phone</td><td style="padding:8px 0">${phone || "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#aaa">Company</td><td style="padding:8px 0">${company || "—"}</td></tr>
      </table>
      <div style="margin-top:16px;padding:16px;background:#1a1a1a;border-radius:8px;font-size:14px;line-height:1.6;color:#ccc">${message.replace(/\n/g, "<br/>")}</div>
      <hr style="border:none;border-top:1px solid #222;margin:24px 0"/>
      <p style="color:#666;font-size:12px;margin:0">Sent from swissulife.com contact form</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Swissulife Media" <${smtpUser}>`,
      to: "anas@swissulife.com",
      replyTo: email,
      subject: `New Message from ${name}${company ? ` · ${company}` : ""}`,
      html,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error("[contact] Failed to send email:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;
