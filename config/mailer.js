const nodemailer = require('nodemailer');

// Email notifications are optional: they activate only when SMTP is
// configured via env vars, so a missing mail setup never breaks the site.
let transporter = null;

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const port = Number(process.env.SMTP_PORT) || 465;
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
} else {
    console.warn('SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASS) - contact form email notifications are disabled.');
}

function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

async function sendContactNotification(msg) {
    if (!transporter) return;

    const to = process.env.NOTIFY_EMAIL || 'Kaaf.architects@gmail.com';
    const rows = [
        ['Name', msg.name],
        ['Email', msg.email],
        ['Phone', msg.phone || '-'],
        ['Project Type', msg.projectType || '-']
    ].map(([label, value]) =>
        `<tr><td style="padding:6px 12px;font-weight:bold;color:#09221E;">${label}</td><td style="padding:6px 12px;">${escapeHtml(value)}</td></tr>`
    ).join('');

    await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to,
        replyTo: msg.email,
        subject: `New inquiry from ${msg.name} - kaafarchitects.com`,
        text: `New contact form message\n\nName: ${msg.name}\nEmail: ${msg.email}\nPhone: ${msg.phone || '-'}\nProject Type: ${msg.projectType || '-'}\n\nMessage:\n${msg.message}`,
        html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;">
                <h2 style="color:#09221E;">New inquiry from kaafarchitects.com</h2>
                <table style="border-collapse:collapse;background:#f7f7f5;border-radius:8px;">${rows}</table>
                <h3 style="color:#09221E;">Message</h3>
                <p style="white-space:pre-wrap;">${escapeHtml(msg.message)}</p>
                <p style="color:#888;font-size:12px;">Reply directly to this email to answer ${escapeHtml(msg.name)}. Also saved in the admin dashboard.</p>
            </div>`
    });
}

module.exports = { sendContactNotification };
