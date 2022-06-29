import nodemailer, { Transporter } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import pug from 'pug'
import { htmlToText } from 'html-to-text'
import path from 'path'
import { environment } from '@config/env.config'
import { pinoLogger } from './logger'

export default class Email {
  private readonly url: string
  private to: string
  private from: string
  private firstName: string

  constructor(url: string, user: { email: string; name: string }) {
    this.url = url
    this.from = `NATOUR CONTACT CENTER <${environment.EMAIL_FROM}>`
    this.to = user.email
    this.firstName = user.name.split(' ')[0]
  }

  newTransport() {
    const auth = {
      user: environment.EMAIL_USERNAME,
      pass: environment.EMAIL_PASSWORD,
    }

    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth,
      })
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT!),
      auth,
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
    await (this.newTransport() as Transporter)
      .sendMail(mailOptions)
      .catch((e) => pinoLogger.error(e))
  }

  async sendWelcome() {
    await this._send('welcome', 'Welcome to the Natours Tour').catch((e) => pinoLogger.error(e))
  }

  async sendPasswordReset() {
    await this._send('passwordReset', 'Your password reset token (valid for only 10 mins)').catch(
      (e) => pinoLogger.error(e),
    )
  }
}
