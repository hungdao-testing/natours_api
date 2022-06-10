import nodemailer, { Transporter } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import pug from 'pug'
import { htmlToText } from 'html-to-text'
import path from 'path'

export default class Email {
  private readonly url: string
  private to: string
  private from: string
  private firstName: string

  constructor(url: string, user: { email: string; name: string }) {
    this.url = url
    this.from = `NATOUR CONTACT CENTER <${process.env.EMAIL_FROM}>`
    this.to = user.email
    this.firstName = user.name.split(' ')[0]
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'Mailjet',
        port: 587,
        secure: false,
        // auth: {
        //   credentials: {
        //     user: process.env.MAILJET_APIKEY,
        //     pass: process.env.MAILJET_SECRETKEY,
        //   }
        // }
        auth: {
          user: process.env.MAILJET_APIKEY,
          pass: process.env.MAILJET_SECRETKEY,
        },
      })
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT!),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  }

  private async _send(template: string, subject: string) {
    // 1) Render HTML base on the pug template
    const html = pug.renderFile(path.join(__dirname, '..', `views/email/${template}.pug`), {
      firstName: this.firstName,
      url: this.url,
      subject,
    })

    // 2) Define email option
    const mailOptions: Mail.Options = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    }

    // 3) Create transport and send email
    await (this.newTransport() as Transporter).sendMail(mailOptions)
  }

  async sendWelcome() {
    await this._send('welcome', 'Welcome to the Natours Tour')
  }

  async sendPasswordReset() {
    await this._send('passwordReset', 'Your password reset token (valid for only 10 mins)')
  }
}
