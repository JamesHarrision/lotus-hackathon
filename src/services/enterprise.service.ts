import { EnterpriseRepository } from "../repositories/enterprise.repository";
import { Prisma } from "@prisma/client";
import { buildEnterpriseBranchGraph } from "../utils/orsMatrix.util";

export class EnterpriseService {
  private enterpriseRepository: EnterpriseRepository;

  constructor() {
    this.enterpriseRepository = new EnterpriseRepository();
  }

  async getAllEnterprises() {
    return this.enterpriseRepository.findAll();
  }

  async getEnterpriseById(id: number) {
    const enterprise = await this.enterpriseRepository.findByIdWithBranches(id);
    if (!enterprise) {
      throw new Error("Enterprise not found");
    }
    return enterprise;
  }

  async getDashboardData(id: number) {
    const enterprise = await this.enterpriseRepository.findByIdWithBranches(id);
    if (!enterprise) {
      throw new Error("Enterprise not found");
    }

    const branches = enterprise.branches;
    const totalCapacity = branches.reduce((sum: number, b: any) => sum + b.maxCapacity, 0);
    const totalCurrentLoad = branches.reduce((sum: number, b: any) => sum + b.currentLoad, 0);
    const averageLoadPercentage = totalCapacity > 0 ? (totalCurrentLoad / totalCapacity) * 100 : 0;

    return {
      enterpriseName: enterprise.name,
      stats: {
        totalBranches: branches.length,
        totalCapacity,
        totalCurrentLoad,
        averageLoadPercentage: Math.round(averageLoadPercentage * 100) / 100
      },
      branches: branches.map((b: any) => ({
        id: b.id,
        name: b.name,
        currentLoad: b.currentLoad,
        maxCapacity: b.maxCapacity,
        loadPercentage: Math.round((b.currentLoad / b.maxCapacity) * 10000) / 100,
        status: b.currentLoad >= b.maxCapacity ? 'FULL' : (b.currentLoad > b.maxCapacity * 0.8 ? 'CROWDED' : 'NORMAL')
      }))
    };
  }

  async getEnterpriseGraph(id: number) {
    const enterprise = await this.enterpriseRepository.findByIdWithBranches(id);
    if (!enterprise) {
      throw new Error("Enterprise not found");
    }
    return buildEnterpriseBranchGraph(id);
  }

  async createEnterprise(data: { name: string; userId: number }) {
    const existingEnterprise = await this.enterpriseRepository.findByUserId(data.userId);
    if (existingEnterprise) {
      throw new Error(`User with ID ${data.userId} already has an associated Enterprise`);
    }
    return this.enterpriseRepository.create(data);
  }

  async updateEnterprise(id: number, data: { name: string }) {
    const enterprise = await this.enterpriseRepository.findByIdWithBranches(id);
    if (!enterprise) {
      throw new Error("Enterprise not found");
    }
    return this.enterpriseRepository.update(id, data);
  }

  async deleteEnterprise(id: number) {
    const enterprise = await this.enterpriseRepository.findByIdWithBranches(id);
    if (!enterprise) {
      throw new Error("Enterprise not found");
    }
    return this.enterpriseRepository.delete(id);
  }
}
