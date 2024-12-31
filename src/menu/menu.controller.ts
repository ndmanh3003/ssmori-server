import { Body, Controller, Delete, Get, Param, Post, Put, SetMetadata, UseGuards } from '@nestjs/common'
import { AuthGuard, IUser } from 'src/guard/auth.guard'
import { RoleGuard } from 'src/guard/role.guard'
import { User } from 'src/decorators/user.decorator'
import { groupBy } from 'src/utils/groupBy'

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

  @Get('dish/:dishId')
  @SetMetadata('bypassGuards', true)
  async getDish(@Param('dishId') dishId: number) {
    return await this.menuService.getDishByDishId(dishId)
  }

  @Get('branch')
  @UseGuards(new RoleGuard(['B']))
  async getBranchMenu(@User() user: IUser) {
    return await this.menuService.getDishdByBranchId(user.id)
  }

  @Get('region/:regionId')
  @UseGuards(new RoleGuard(['S']))
  async getRegionMenu(@Param('regionId') regionId: number) {
    return await this.menuService.getDishByRegionId(regionId)
  }

  @Get('combo')
  @UseGuards(new RoleGuard(['S']))
  async getCombo() {
    return await this.menuService.getCombo()
  }

  @Get('/:branchId?')
  @SetMetadata('bypassGuards', true)
  async getMenu(@Param('branchId') branchId: number) {
    const res = await this.menuService.getMenu(branchId)
    const data = groupBy(res, 'id', ['name'], 'dishes').map((category) => {
      if (category.id === null) {
        category.id = 4
        category.name = 'Combo'
      }

      return {
        ...category,
        dishes: (category.dishes as Array<{ dishId: number }>).map((dish) => dish.dishId)
      }
    })

    return data
  }
}
