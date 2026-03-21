import { IncentiveRepository } from "../repositories/incentive.repository";
import { Prisma } from "@prisma/client";

export class IncentiveService {
  private incentiveRepository: IncentiveRepository;

  constructor() {
    this.incentiveRepository = new IncentiveRepository();
  }

  async getAllIncentives(enterpriseId?: number) {
    return this.incentiveRepository.findAll(enterpriseId);
  }

  async getIncentiveById(id: number) {
    const incentive = await this.incentiveRepository.findById(id);
    if (!incentive) {
      throw new Error("Incentive not found");
    }
    return incentive;
  }

  async createIncentive(data: Prisma.IncentiveUncheckedCreateInput) {
    const existing = await this.incentiveRepository.findByCode(data.code);
    if (existing) {
      throw new Error("Incentive code already exists");
    }
    return this.incentiveRepository.create(data);
  }

  async updateIncentive(id: number, data: Prisma.IncentiveUpdateInput) {
    return this.incentiveRepository.update(id, data);
  }

  async deleteIncentive(id: number) {
    return this.incentiveRepository.delete(id);
  }
}
