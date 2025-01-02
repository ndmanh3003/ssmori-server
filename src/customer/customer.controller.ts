import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common'
import { AuthGuard, IUser } from 'src/guard/auth.guard'
import { RoleGuard } from 'src/guard/role.guard'
import { User } from 'src/decorators/user.decorator'

import { CustomerService } from './customer.service'

@Controller('customer')
@UseGuards(AuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('close-card')
  @UseGuards(new RoleGuard(['C']))
  async closeCustomerCard(@User() user: IUser) {
    return this.customerService.closeCustomerCard(user.id)
  }

  @Post('open-card')
  @UseGuards(new RoleGuard(['B']))
  async openCustomerCard(@User() user: IUser, @Body() body) {
    return this.customerService.openCustomerCard(user.id, body)
  }

  @Put()
  @UseGuards(new RoleGuard(['C']))
  async updateCustomer(@User() user: IUser, @Body() body) {
    return this.customerService.updateCustomer(user.id, body)
  }

  @Get()
  @UseGuards(new RoleGuard(['C']))
  async getCustomer(@User() user: IUser) {
    return this.customerService.getCustomer(user.id)
  }
}
