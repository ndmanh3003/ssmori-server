import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'src/database/database.service'
import { groupBy } from 'src/utils/groupBy'

interface IOrderList {
  status: string
  from: string
  customerId: number
  branchId: number
  type: string
  page: number
  limit: number
}

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
    const { branchId, guestCount, bookingAt } = data

    return await this.dbSv.exeProc(
      'sp_CreateReserveOrder',
      [
        { branchId, guestCount, customerId },
        { bookingAt, useQuote: true }
      ],
      'invoiceId'
    )
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

  //TODO: Get order
  async getHistory(data: IOrderList) {
    const query = `fn_viewInvoiceList(
      ${data.status ? `'${data.status}'` : 'null'}, 
      ${data.from ? `'${data.from}'` : 'null'}, 
      ${data.customerId || 'null'}, 
      ${data.branchId || 'null'}, 
      ${data.type ? `'${data.type}'` : 'null'}, 
      ${data.page || 1}, 
      ${data.limit || 5}
    )`

    return await this.dbSv.exeFunc(query)
  }

  async getOrderDetail(invoiceId: number, customerId?: number) {
    const res = await this.dbSv.exeFunc(`fn_viewInvoiceDetail(${invoiceId}, ${customerId || 'null'})`)

    if (res.length === 1) {
      return res[0]
    }

    return groupBy(
      res,
      'id',
      [
        'status',
        'orderAt',
        'total',
        'shipCost',
        'dishDiscount',
        'shipDiscount',
        'totalPayment',
        'customer',
        'branch',
        'type',
        'guestCount',
        'bookingAt',
        'phone',
        'address',
        'distanceKm',
        'branchInfo'
      ],
      'dishes'
    )[0]
  }
}
