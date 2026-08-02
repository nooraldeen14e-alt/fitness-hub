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
  const smtpUser = process.env["SMTP_USER"];
  const smtpPass = process.env["SMTP_PASS"];

  if (!smtpUser || !smtpPass) {
    // Credentials not set yet — log the booking and respond OK so the UI still
    // shows the confirmation screen while the owner sets up email.
    console.warn("[booking] SMTP_USER / SMTP_PASS not set — booking logged only:", {
      name, email, phone, date, time,
    });
    res.json({ ok: true, warning: "Email not sent (SMTP not configured)" });
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
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
      to: "sales@swissulife.com",
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

export default router;
