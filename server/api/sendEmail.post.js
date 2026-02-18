import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const data = await transporter.sendMail({
      from: body.from,
      to: body.to,
      subject: body.subject,
      html: body.html,
    });

    return data;
  } catch (error) {
    return { error };
  }
});
