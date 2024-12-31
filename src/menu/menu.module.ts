import { Module } from '@nestjs/common'
import { SystemModule } from 'src/system/system.module'
import { SystemService } from 'src/system/system.service'

import { MenuService } from './menu.service'
import { MenuController } from './menu.controller'

@Module({
  controllers: [MenuController],
  providers: [MenuService, SystemService],
  imports: [SystemModule]
})
export class MenuModule {}
