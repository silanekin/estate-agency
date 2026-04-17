import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Transaction, TransactionStage } from './schemas/transaction.schema';
import { AgentsService } from '../agents/agents.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const createMockQuery = (resolvedValue: any) => ({
  populate: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(resolvedValue),
});

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionModel: any;

  const mockAgentsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    transactionModel = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getModelToken(Transaction.name),
          useValue: transactionModel,
        },
        {
          provide: AgentsService,
          useValue: mockAgentsService,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  describe('calculateCommission', () => {
    it('aynı ajan: agencyShare %50, listingAgent %50 almalı', () => {
      const result = (service as any).calculateCommission(
        100000,
        'agent1',
        'agent1',
      );
      expect(result.agencyShare).toBe(50000);
      expect(result.listingAgentShare).toBe(50000);
      expect(result.sellingAgentShare).toBe(0);
      expect(result.isSameAgent).toBe(true);
    });

    it('farklı ajanlar: agencyShare %50, her ajan %25 almalı', () => {
      const result = (service as any).calculateCommission(
        100000,
        'agent1',
        'agent2',
      );
      expect(result.agencyShare).toBe(50000);
      expect(result.listingAgentShare).toBe(25000);
      expect(result.sellingAgentShare).toBe(25000);
      expect(result.isSameAgent).toBe(false);
    });

    it('toplam komisyon doğru dağıtılmalı', () => {
      const result = (service as any).calculateCommission(
        200000,
        'agent1',
        'agent2',
      );
      const total =
        result.agencyShare +
        result.listingAgentShare +
        result.sellingAgentShare;
      expect(total).toBe(200000);
    });
  });

  describe('advanceStage', () => {
    it('agreement → earnest_money geçişi yapmalı', async () => {
      const mockTransaction = {
        _id: 'tx1',
        stage: TransactionStage.AGREEMENT,
        totalServiceFee: 100000,
        listingAgentId: 'agent1',
        sellingAgentId: 'agent1',
        commission: null,
        save: jest.fn().mockResolvedValue(true),
      };

      const mockPopulatedTransaction = {
        ...mockTransaction,
        stage: TransactionStage.EARNEST_MONEY,
      };

      transactionModel.findById
        .mockReturnValueOnce({ exec: jest.fn().mockResolvedValue(mockTransaction) })
        .mockReturnValueOnce(createMockQuery(mockPopulatedTransaction));

      const result = await service.advanceStage('tx1');
      expect(result.stage).toBe(TransactionStage.EARNEST_MONEY);
    });

    it('completed aşamasında hata fırlatmalı', async () => {
      const mockTransaction = {
        _id: 'tx1',
        stage: TransactionStage.COMPLETED,
        save: jest.fn(),
      };

      transactionModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTransaction),
      });

      await expect(service.advanceStage('tx1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('geçersiz id için NotFoundException fırlatmalı', async () => {
      transactionModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.advanceStage('invalidId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});