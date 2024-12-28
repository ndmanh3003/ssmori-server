import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/database/database.service'

import { MailService } from './mail.service'
import { TokenService } from './token.service'

@Injectable()
export class AuthService {
  constructor(
    private dbSv: DatabaseService,
    private mailService: MailService,
    private tokenService: TokenService
  ) {}

  async sendOtp(reqBody) {
    const { phone, type } = reqBody

    const res = await this.dbSv.exeProc('sp_SendOtp', [{ phone, type, useQuote: true }], 'otp')

    await this.mailService.mail(res as string)

    return { message: 'OK' }
  }

  async register(reqBody) {
    const { otp, name, phone, email, gender } = reqBody

    const res = await this.dbSv.exeProc('sp_Register', [{ otp, name, phone, email, gender, useQuote: true }], 'id')

    return { data: this.tokenService.generateToken({ id: res, type: 'C' }) }
  }

  async login(reqBody) {
    const { phone, otp, type } = reqBody

    const res = await this.dbSv.exeProc('sp_Login', [{ phone, otp, type, useQuote: true }], 'id')

    return { data: this.tokenService.generateToken({ id: res, type }) }
  }
}
