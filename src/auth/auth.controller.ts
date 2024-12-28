import { Body, Controller, Post } from '@nestjs/common'

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  async sendOtp(@Body() reqBody) {
    return this.authService.sendOtp(reqBody)
  }

  @Post('register')
  async register(@Body() reqBody) {
    return this.authService.register(reqBody)
  }

  @Post('login')
  async login(@Body() reqBody) {
    return this.authService.login(reqBody)
  }
}
