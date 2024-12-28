import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common'
import { AuthGuard, IUser } from 'src/guard/auth.guard'
import { RoleGuard } from 'src/guard/role.guard'
import { User } from 'src/decorators/user.decorator'

import { OrderService } from './order.service'

interface IDishState {
  id: number
  quantity: number
}

@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('online')
  @UseGuards(new RoleGuard(['C']))
  async orderOnline(@Body() body, @User() user: IUser) {
    const invoiceId = await this.orderService.createOnlineOrder(user.id, body)

    await Promise.all((body.dishes as IDishState[]).map((dish) => this.orderService.addDishToOrder({ invoiceId, ...dish })))

    await this.orderService.submitOrder({ invoiceId })

    return { data: invoiceId }
  }

  @Post('reserve')
  @UseGuards(new RoleGuard(['C']))
  async createReserveOrder(@Body() body, @User() user: IUser) {
    return await this.orderService.createReserveOrder(user.id, body)
  }

  @Post('off')
  @UseGuards(new RoleGuard(['B']))
  async createOffOrder(@Body() body, @User() user: IUser) {
    const invoiceId = await this.orderService.createOffOrder(user.id, body)

    await Promise.all((body.dishes as IDishState[]).map((dish) => this.orderService.addDishToOrder({ invoiceId, ...dish })))

    return await this.orderService.submitOrder({ invoiceId })
  }

  @Delete()
  @UseGuards(new RoleGuard(['C', 'B']))
  async deleteOrder(@Body() body, @User() user: IUser) {
    return await this.orderService.deleteOrder(body, user.type === 'C' ? user.id : null)
  }

  @Post('cancel')
  @UseGuards(new RoleGuard(['B']))
  async cancelOrder(@Body() body) {
    return await this.orderService.cancelOrder(body)
  }

  @Post('issue')
  @UseGuards(new RoleGuard(['B']))
  async issueOrder(@Body() body) {
    return await this.orderService.issueOrder(body)
  }

  @Post('pay')
  @UseGuards(new RoleGuard(['B']))
  async payOrder(@Body() body) {
    return await this.orderService.payOrder(body)
  }

  @Post('review')
  async reviewOrder(@Body() body) {
    return await this.orderService.reviewOrder(body)
  }
}
