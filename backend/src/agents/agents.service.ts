import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Agent, AgentDocument } from './schemas/agent.schema';

@Injectable()
export class AgentsService {
  constructor(
    @InjectModel(Agent.name) private agentModel: Model<AgentDocument>,
  ) {}

  async create(data: { name: string; email: string; phone: string }): Promise<AgentDocument> {
    const agent = new this.agentModel(data);
    return agent.save();
  }

  async findAll(): Promise<AgentDocument[]> {
    return this.agentModel.find().exec();
  }

  async findOne(id: string): Promise<AgentDocument> {
    const agent = await this.agentModel.findById(id).exec();
    if (!agent) {
      throw new NotFoundException(`Agent ${id} bulunamadı`);
    }
    return agent;
  }
}