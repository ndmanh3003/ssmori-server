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
  async createCategory(@Body() body) {
    return await this.menuService.createCategory(body)
  }

  @Put('category')
  @UseGuards(new RoleGuard(['S']))
  async updateCategory(@Body() body) {
    return await this.menuService.updateCategory(body)
  }

  @Delete('category')
  @UseGuards(new RoleGuard(['S']))
  async deleteCategory(@Body() body) {
    return await this.menuService.deleteCategory(body)
  }

  @Post('dish')
  @UseGuards(new RoleGuard(['S']))
  async createDish(@Body() body) {
    return await this.menuService.createDish(body)
  }

  @Put('dish')
  @UseGuards(new RoleGuard(['S']))
  async updateDish(@Body() body) {
    return await this.menuService.updateDish(body)
  }

  @Delete('dish')
  @UseGuards(new RoleGuard(['S']))
  async deleteDish(@Body() body) {
    return await this.menuService.deleteDish(body)
  }

  @Post('region-dish')
  @UseGuards(new RoleGuard(['S']))
  async manageRegionDishes(@Body() body) {
    return await this.menuService.manageRegionDishes(body)
  }

  @Post('branch-dish')
  @UseGuards(new RoleGuard(['B']))
  async manageBranchDishes(@User() user: IUser, @Body() body) {
    return await this.menuService.manageBranchDishes(user.id, body)
  }

  @Post('category-dish')
  @UseGuards(new RoleGuard(['S']))
  async manageCategoryDishes(@Body() body) {
    return await this.menuService.manageCategoryDishes(body)
  }

  @Post('combo-dish')
  @UseGuards(new RoleGuard(['S']))
  async manageComboDishes(@Body() body) {
    return await this.menuService.manageComboDishes(body)
  }
}
