import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

export enum TransactionStage {
  AGREEMENT = 'agreement',
  EARNEST_MONEY = 'earnest_money',
  TITLE_DEED = 'title_deed',
  COMPLETED = 'completed',
}

export class CommissionBreakdown {
  agencyShare: number;
  listingAgentShare: number;
  sellingAgentShare: number;
  isSameAgent: boolean;
}

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  propertyAddress: string;

  @Prop({ required: true })
  totalServiceFee: number;

  @Prop({
    type: String,
    enum: TransactionStage,
    default: TransactionStage.AGREEMENT,
  })
  stage: TransactionStage;

  @Prop({ type: Types.ObjectId, ref: 'Agent', required: true })
  listingAgentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Agent', required: true })
  sellingAgentId: Types.ObjectId;

  @Prop({ type: Object, default: null })
  commission: CommissionBreakdown | null;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);