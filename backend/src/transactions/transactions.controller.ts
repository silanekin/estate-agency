import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Body()
    body: {
      propertyAddress: string;
      totalServiceFee: number;
      listingAgentId: string;
      sellingAgentId: string;
    },
  ) {
    return this.transactionsService.create(body);
  }

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id/stage')
  advanceStage(@Param('id') id: string) {
    return this.transactionsService.advanceStage(id);
  }
}