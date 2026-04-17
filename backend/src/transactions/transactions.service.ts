import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Transaction,
  TransactionDocument,
  TransactionStage,
  CommissionBreakdown,
} from './schemas/transaction.schema';
import { AgentsService } from '../agents/agents.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    private agentsService: AgentsService,
  ) {}

  async create(data: {
    propertyAddress: string;
    totalServiceFee: number;
    listingAgentId: string;
    sellingAgentId: string;
  }): Promise<TransactionDocument> {
    await this.agentsService.findOne(data.listingAgentId);
    await this.agentsService.findOne(data.sellingAgentId);
    const transaction = new this.transactionModel({
      ...data,
      stage: TransactionStage.AGREEMENT,
      commission: null,
    });
    return transaction.save();
  }

  async findAll(): Promise<TransactionDocument[]> {
    return this.transactionModel
      .find()
      .populate('listingAgentId')
      .populate('sellingAgentId')
      .exec();
  }

  async findOne(id: string): Promise<TransactionDocument> {
    const transaction = await this.transactionModel
      .findById(id)
      .populate('listingAgentId')
      .populate('sellingAgentId')
      .exec();
    if (!transaction) {
      throw new NotFoundException(`Transaction ${id} bulunamadı`);
    }
    return transaction;
  }

  async advanceStage(id: string): Promise<TransactionDocument> {
    const transaction = await this.transactionModel.findById(id).exec();

    if (!transaction) {
      throw new NotFoundException(`Transaction ${id} bulunamadı`);
    }

    const stageOrder = [
      TransactionStage.AGREEMENT,
      TransactionStage.EARNEST_MONEY,
      TransactionStage.TITLE_DEED,
      TransactionStage.COMPLETED,
    ];

    const currentIndex = stageOrder.indexOf(transaction.stage);

    if (currentIndex === stageOrder.length - 1) {
      throw new BadRequestException('İşlem zaten tamamlandı');
    }

    const nextStage = stageOrder[currentIndex + 1];
    transaction.stage = nextStage;

    if (nextStage === TransactionStage.COMPLETED) {
      transaction.commission = this.calculateCommission(
        transaction.totalServiceFee,
        transaction.listingAgentId.toString(),
        transaction.sellingAgentId.toString(),
      );
    }

    await transaction.save();

    return this.transactionModel
      .findById(id)
      .populate('listingAgentId')
      .populate('sellingAgentId')
      .exec();
  }

  private calculateCommission(
    totalServiceFee: number,
    listingAgentId: string,
    sellingAgentId: string,
  ): CommissionBreakdown {
    const agencyShare = totalServiceFee * 0.5;
    const agentPool = totalServiceFee * 0.5;
    const isSameAgent = listingAgentId === sellingAgentId;

    if (isSameAgent) {
      return {
        agencyShare,
        listingAgentShare: agentPool,
        sellingAgentShare: 0,
        isSameAgent: true,
      };
    }

    return {
      agencyShare,
      listingAgentShare: agentPool * 0.5,
      sellingAgentShare: agentPool * 0.5,
      isSameAgent: false,
    };
  }
}