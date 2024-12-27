import { Module } from '@nestjs/common'
import { DatabaseService } from 'src/database/database.service'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

@Module({
  controllers: [AuthController],
  providers: [AuthService, DatabaseService]
})
export class AuthModule {}
