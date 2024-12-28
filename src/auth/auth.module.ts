import { Global, Module } from '@nestjs/common'
import { DatabaseService } from 'src/database/database.service'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { MailService } from './mail.service'
import { TokenService } from './token.service'

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, DatabaseService, MailService, TokenService],
  exports: [TokenService]
})
export class AuthModule {}
