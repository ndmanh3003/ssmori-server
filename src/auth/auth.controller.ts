import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/guard/auth.guard'
import { User } from 'src/decorators/user.decorator'

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  async sendOtp(@Body() body) {
    return this.authService.sendOtp(body)
  }

  @Post('register')
  async register(@Body() body) {
    return this.authService.register(body)
  }

  @Post('login')
  async login(@Body() body) {
    return this.authService.login(body)
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getme(@User() user) {
    return user
  }
}
