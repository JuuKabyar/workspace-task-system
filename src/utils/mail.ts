import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
}) // Create mail transporter

export const sendMail = async (
    to: string,
    subject: string,
    html: string
) => {

  await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: to,
      subject: subject,
      html: html
  }) // Send email

}