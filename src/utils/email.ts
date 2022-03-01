import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

export const sendEmail = async (options: {
  email: string
  message: string
  subject: string
}) => {
  // 1. Create a transporter
  // `transporter` is a service to send email

  const transporterOption: SMTPTransport.Options = {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT!),
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  }
  const transporter = nodemailer.createTransport(transporterOption)

  // 2. Define the email option
  const mailOptions: Mail.Options = {
    from: 'Naruto Dev One <naruto.dev.one@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  }

  //3. Actually send the email
  await transporter.sendMail(mailOptions)
}
