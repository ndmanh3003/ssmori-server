import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { DatabaseService } from 'src/database/database.service'

@Injectable()
export class AuthService {
  constructor(private dbSv: DatabaseService) {}

  async sendOtp(reqBody) {
    const { phone, type } = reqBody

    const res = await this.dbSv.exeProc('sp_SendOtp', [{ phone, type, useQuote: true }], 'otp')

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    })

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      subject: 'SushiMori - OTP',
      text: res
    }

    transporter.sendMail(mailOptions)

    return { message: 'OK' }
  }
}
