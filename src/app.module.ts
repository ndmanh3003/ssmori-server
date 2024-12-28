import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './database/database.module'
import { AuthModule } from './auth/auth.module'
import { CustomerModule } from './customer/customer.module'
import { MenuModule } from './menu/menu.module'
import { SystemModule } from './system/system.module';

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), AuthModule, CustomerModule, MenuModule, SystemModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
