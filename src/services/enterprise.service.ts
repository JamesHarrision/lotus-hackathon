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

  async getEnterpriseGraph(id: number) {
    const enterprise = await this.enterpriseRepository.findByIdWithBranches(id);
    if (!enterprise) {
      throw new Error("Enterprise not found");
    }
    return buildEnterpriseBranchGraph(id);
  }

  async createEnterprise(data: { name: string; userId: number }) {
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
