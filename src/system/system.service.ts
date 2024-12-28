import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/database/database.service'

@Injectable()
export class SystemService {
  constructor(private dbSv: DatabaseService) {}

  //TODO: Region
  async createRegion(data) {
    const { name } = data

    return await this.dbSv.exeProc('sp_CreateRegion', [{ name, useQuote: true }])
  }

  async updateRegion(data) {
    const { regionId, name } = data

    return await this.dbSv.exeProc('sp_UpdateRegion', [{ regionId }, { name, useQuote: true }])
  }

  async deleteRegion(data) {
    const { regionId } = data

    return await this.dbSv.exeProc('sp_DeleteRegion', [{ regionId }])
  }

  //TODO: Branch
  async createBranch(data) {
    const { name, address, openTime, closeTime, phone, hasMotoPark, hasCarPark, canShip, regionId, img } = data

    return await this.dbSv.exeProc('sp_CreateBranch', [
      { phone, hasMotoPark, hasCarPark, canShip, regionId },
      { name, address, openTime, closeTime, img, useQuote: true }
    ])
  }

  async updateBranch(data) {
    const { branchId, name, address, openTime, closeTime, phone, hasMotoPark, hasCarPark, canShip, regionId, img } = data

    return await this.dbSv.exeProc('sp_UpdateBranch', [
      { phone, hasMotoPark, hasCarPark, canShip, regionId },
      { branchId, name, address, openTime, closeTime, img, useQuote: true }
    ])
  }

  async deleteBranch(data) {
    const { branchId } = data

    return await this.dbSv.exeProc('sp_DeleteBranch', [{ branchId }])
  }

  //TODO: System
  async updateSystem(data) {
    const {
      costPerKm,
      freeDistance,
      phone,
      shipMemberDiscount,
      shipSilverDiscount,
      shipGoldDiscount,
      dishMemberDiscount,
      dishSilverDiscount,
      dishGoldDiscount
    } = data

    return await this.dbSv.exeProc('sp_UpdateSystemConstants', [
      { phone, useQuote: true },
      { costPerKm, freeDistance, shipMemberDiscount, shipSilverDiscount, shipGoldDiscount, dishMemberDiscount, dishSilverDiscount, dishGoldDiscount }
    ])
  }
}
