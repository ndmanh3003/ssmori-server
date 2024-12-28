import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/database/database.service'

@Injectable()
export class MenuService {
  constructor(private dbSv: DatabaseService) {}

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
}
