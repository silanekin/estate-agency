import { Test, TestingModule } from '@nestjs/testing';
import { AgentsService } from './agents.service';
import { getModelToken } from '@nestjs/mongoose';
import { Agent } from './schemas/agent.schema';

describe('AgentsService', () => {
  let service: AgentsService;

  const mockAgentModel = {
    find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
    findById: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentsService,
        { provide: getModelToken(Agent.name), useValue: mockAgentModel },
      ],
    }).compile();

    service = module.get<AgentsService>(AgentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});