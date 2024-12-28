import { Body, Controller, Delete, Post, Put, UseGuards } from '@nestjs/common'
import { AuthGuard, IUser } from 'src/guard/auth.guard'
import { RoleGuard } from 'src/guard/role.guard'
import { User } from 'src/decorators/user.decorator'

import { MenuService } from './menu.service'

@Controller('menu')
@UseGuards(AuthGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('category')
  @UseGuards(new RoleGuard(['S']))
  async createCategory(@Body() data) {
    return await this.menuService.createCategory(data)
  }

  @Put('category')
  @UseGuards(new RoleGuard(['S']))
  async updateCategory(@Body() data) {
    return await this.menuService.updateCategory(data)
  }

  @Delete('category')
  @UseGuards(new RoleGuard(['S']))
  async deleteCategory(@Body() data) {
    return await this.menuService.deleteCategory(data)
  }

  @Post('dish')
  @UseGuards(new RoleGuard(['S']))
  async createDish(@Body() data) {
    return await this.menuService.createDish(data)
  }

  @Put('dish')
  @UseGuards(new RoleGuard(['S']))
  async updateDish(@Body() data) {
    return await this.menuService.updateDish(data)
  }

  @Delete('dish')
  @UseGuards(new RoleGuard(['S']))
  async deleteDish(@Body() data) {
    return await this.menuService.deleteDish(data)
  }

  @Post('region-dish')
  @UseGuards(new RoleGuard(['S']))
  async manageRegionDishes(@Body() data) {
    return await this.menuService.manageRegionDishes(data)
  }

  @Post('branch-dish')
  @UseGuards(new RoleGuard(['B']))
  async manageBranchDishes(@User() user: IUser, @Body() data) {
    return await this.menuService.manageBranchDishes(user.id, data)
  }

  @Post('category-dish')
  @UseGuards(new RoleGuard(['S']))
  async manageCategoryDishes(@Body() data) {
    return await this.menuService.manageCategoryDishes(data)
  }

  @Post('combo-dish')
  @UseGuards(new RoleGuard(['S']))
  async manageComboDishes(@Body() data) {
    return await this.menuService.manageComboDishes(data)
  }
}
