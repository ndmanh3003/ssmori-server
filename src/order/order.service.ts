import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/database/database.service'

@Injectable()
export class OrderService {
  constructor(private dbSv: DatabaseService) {}

  //TODO: Create order
  async createOnlineOrder(customerId: number, data) {
    const { phone, address, distanceKm, branchId } = data

    return await this.dbSv.exeProc(
      'sp_CreateOnlineOrder',
      [
        { customerId, branchId, distanceKm },
        { phone, address, useQuote: true }
      ],
      'invoiceId'
    )
  }

  async createReserveOrder(customerId: number, data) {
    const { branchId, guestCount, bookingAt, phone } = data

    return await this.dbSv.exeProc('sp_CreateReserveOrder', [
      { branchId, guestCount, customerId },
      { phone, bookingAt, useQuote: true }
    ])
  }

  async createOffOrder(branchId: number, data) {
    const { invoiceId, customerId } = data

    return await this.dbSv.exeProc('sp_CreateOffOrder', [{ invoiceId, customerId, branchId }], 'outInvoiceId')
  }

  //TODO: Delete order
  async deleteOrder(data, customerId?: number) {
    const { invoiceId } = data

    return await this.dbSv.exeProc('sp_DeleteOrder', [{ invoiceId, customerId }])
  }

  //TODO: Add dish to order
  async addDishToOrder(data) {
    const { invoiceId, id, quantity } = data

    return await this.dbSv.exeProc('sp_AddDetail', [{ invoiceId, dishId: id, quantity }])
  }

  //TODO: Transfer order
  async submitOrder(data) {
    const { invoiceId } = data

    return await this.dbSv.exeProc('sp_SubmitOrder', [{ invoiceId }])
  }

  async cancelOrder(data) {
    const { invoiceId } = data

    return await this.dbSv.exeProc('sp_CancelOrder', [{ invoiceId }])
  }

  async issueOrder(data) {
    const { invoiceId } = data

    return await this.dbSv.exeProc('sp_IssueOrder', [{ invoiceId }])
  }

  async payOrder(data) {
    const { invoiceId } = data

    return await this.dbSv.exeProc('sp_PayOrder', [{ invoiceId }])
  }

  //TODO: Review
  async reviewOrder(data) {
    const { invoiceId, service, quality, price, location, comment } = data

    return await this.dbSv.exeProc('sp_CreateReview', [
      { invoiceId, service, quality, price, location },
      { comment, useQuote: true }
    ])
  }
}
