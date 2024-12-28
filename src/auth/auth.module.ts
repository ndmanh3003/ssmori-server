import { Module } from '@nestjs/common'
import { DatabaseService } from 'src/database/database.service'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { MailService } from './mail.service'
import { TokenService } from './token.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, DatabaseService, MailService, TokenService]
})
export class AuthModule {}
