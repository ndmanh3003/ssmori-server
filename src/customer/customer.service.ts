import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/database/database.service'

@Injectable()
export class CustomerService {
  constructor(private dbSv: DatabaseService) {}

  async closeCustomerCard(customerId: number) {
    return await this.dbSv.exeProc('sp_CloseCustomerCard', [{ customerId }])
  }

  async openCustomerCard(branchId: number, customerId: number) {
    return await this.dbSv.exeProc('sp_CreateCustomerCard', [{ branchId, customerId }])
  }

  async updateCustomer(customerId: number, updateData) {
    const { name, email, gender } = updateData

    return await this.dbSv.exeProc('sp_UpdateCustomer', [{ customerId }, { name, email, gender, useQuote: true }])
  }
}
