import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './database/database.module'
import { AuthModule } from './auth/auth.module'
import { CustomerModule } from './customer/customer.module'

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), AuthModule, CustomerModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
