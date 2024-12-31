import { Body, Controller, Delete, Get, Param, Post, Put, SetMetadata, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/guard/auth.guard'
import { RoleGuard } from 'src/guard/role.guard'

import { SystemService } from './system.service'

@Controller('system')
@UseGuards(new RoleGuard(['S']))
@UseGuards(AuthGuard)
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Post('region')
  async createRegion(@Body() body) {
    return await this.systemService.createRegion(body)
  }

  @Put('region')
  async updateRegion(@Body() body) {
    return await this.systemService.updateRegion(body)
  }

  @Delete('region')
  async deleteRegion(@Body() body) {
    return await this.systemService.deleteRegion(body)
  }

  @Post('branch')
  async createBranch(@Body() body) {
    return await this.systemService.createBranch(body)
  }

  @Put('branch')
  async updateBranch(@Body() body) {
    return await this.systemService.updateBranch(body)
  }

  @Delete('branch')
  async deleteBranch(@Body() body) {
    return await this.systemService.deleteBranch(body)
  }

  @Put()
  async updateSystem(@Body() body) {
    return await this.systemService.updateSystem(body)
  }

  @Get('region-branch')
  @SetMetadata('bypassGuards', true)
  async getRegionBranch() {
    return await this.systemService.getRegionBranch()
  }

  @Get('region')
  async getRegion() {
    return await this.systemService.getRegion()
  }

  @Get('branch')
  async getBranch() {
    return await this.systemService.getBranch()
  }

  @Get('branch/:branchId')
  async getBranchByRegionId(@Param('branchId') branchId: number) {
    return await this.systemService.getBranchById(branchId)
  }

  @Get()
  async getSystem() {
    return await this.systemService.getSystem()
  }
}
