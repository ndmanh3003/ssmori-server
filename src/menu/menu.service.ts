import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/database/database.service'
import { SystemService } from 'src/system/system.service'

@Injectable()
export class MenuService {
  constructor(
    private dbSv: DatabaseService,
    private readonly systemService: SystemService
  ) {}

  //TODO: Category
  async createCategory(data) {
    const { name } = data

    return await this.dbSv.exeProc('sp_CreateCategory', [{ name, useQuote: true }])
  }

  async updateCategory(data) {
    const { categoryId, name } = data

    return await this.dbSv.exeProc('sp_UpdateCategory', [{ categoryId }, { name, useQuote: true }])
  }

  async deleteCategory(data) {
    const { categoryId } = data

    return await this.dbSv.exeProc('sp_DeleteCategory', [{ categoryId }])
  }

  //TODO: Dish
  async createDish(data) {
    const { isCombo, nameVn, nameEn, price, canShip, img } = data

    return await this.dbSv.exeProc('sp_CreateDish', [
      { nameVn, nameEn, img, useQuote: true },
      { isCombo, price, canShip }
    ])
  }

  async updateDish(data) {
    const { dishId, nameVn, nameEn, price, canShip, img } = data

    return await this.dbSv.exeProc('sp_UpdateDish', [
      { nameVn, nameEn, img, useQuote: true },
      { dishId, price, canShip }
    ])
  }

  async deleteDish(data) {
    const { dishId } = data

    return await this.dbSv.exeProc('sp_DeleteDish', [{ dishId }])
  }

  //TODO: Manage
  async manageRegionDishes(data) {
    const { regionId, dishId, isDelete } = data

    return await this.dbSv.exeProc('sp_ManageRegionDishes', [{ regionId, dishId, isDelete }])
  }

  async manageBranchDishes(branchId: number, data) {
    const { dishId, isDelete } = data

    return await this.dbSv.exeProc('sp_ManageBranchDishes', [{ branchId, dishId, isDelete }])
  }

  async manageCategoryDishes(data) {
    const { categoryId, dishId, isDelete } = data

    return await this.dbSv.exeProc('sp_ManageCategoryDishes', [{ categoryId, dishId, isDelete }])
  }

  async manageComboDishes(data) {
    const { dishId, comboId, isDelete } = data

    return await this.dbSv.exeProc('sp_ManageComboDishes', [{ dishId, comboId, isDelete }])
  }

  //TODO: View
  async getDishByDishId(dishId: number) {
    const dish = (await this.dbSv.exeSelect('Dish', [`id = ${dishId}`]))[0]

    if (dish.isCombo) {
      dish.dishes = await this.dbSv.exeSelect('ComboDish', [`combo = ${dishId}`])

      dish.dishes = await Promise.all(
        dish.dishes.map(async (combo) => {
          const { nameVn, nameEn, id } = await this.getDishByDishId(combo.dish)

          return { nameVn, nameEn, id }
        })
      )
    }

    return dish
  }

  async getMenu(branchId: number) {
    return await this.dbSv.exeFunc(`fn_viewMenuByBranchId(${branchId || 'null'})`)
  }

  async getCombo() {
    const combos = await this.dbSv.exeSelect('Dish', ['isCombo = 1'])

    return await Promise.all(
      combos.map(async (combo) => {
        const { dishes } = await this.getDishByDishId(combo.id)

        return {
          id: combo.id,
          name: combo.nameVn,
          dishes: dishes.map((dish) => dish.id)
        }
      })
    )
  }

  async getDishdByBranchId(branchId: number) {
    const regionId = (await this.systemService.getBranchByBranchId(branchId)).id

    const region = await this.getDishByRegionId(regionId)
    const branch = (await this.dbSv.exeSelect('BranchDish', [`branch = ${branchId}`])).map((dish) => dish.dish)

    return { region, branch }
  }

  async getDishByRegionId(regionId: number) {
    return (await this.dbSv.exeSelect('RegionDish', [`region = ${regionId}`])).map((dish) => dish.dish)
  }
}
