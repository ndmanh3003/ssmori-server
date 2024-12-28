import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/database/database.service'

@Injectable()
export class CustomerService {
  constructor(private dbSv: DatabaseService) {}

  async closeCustomerCard(customerId: number) {
    return await this.dbSv.exeProc('sp_CloseCustomerCard', [{ customerId }])
  }

  async openCustomerCard(branchId: number, data) {
    const { customerId } = data

    return await this.dbSv.exeProc('sp_CreateCustomerCard', [{ branchId, customerId }])
  }

  async updateCustomer(customerId: number, data) {
    const { name, email, gender } = data

    return await this.dbSv.exeProc('sp_UpdateCustomer', [{ customerId }, { name, email, gender, useQuote: true }])
  }
}
