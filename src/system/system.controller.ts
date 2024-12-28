import { Body, Controller, Delete, Post, Put, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/guard/auth.guard'
import { RoleGuard } from 'src/guard/role.guard'

import { SystemService } from './system.service'

@Controller('system')
@UseGuards(new RoleGuard(['S']))
@UseGuards(AuthGuard)
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Post('region')
  async createRegion(@Body() data) {
    return await this.systemService.createRegion(data)
  }

  @Put('region')
  async updateRegion(@Body() data) {
    return await this.systemService.updateRegion(data)
  }

  @Delete('region')
  async deleteRegion(@Body() data) {
    return await this.systemService.deleteRegion(data)
  }

  @Post('branch')
  async createBranch(@Body() data) {
    return await this.systemService.createBranch(data)
  }

  @Put('branch')
  async updateBranch(@Body() data) {
    return await this.systemService.updateBranch(data)
  }

  @Delete('branch')
  async deleteBranch(@Body() data) {
    return await this.systemService.deleteBranch(data)
  }

  @Put()
  async updateSystem(@Body() data) {
    return await this.systemService.updateSystem(data)
  }
}
