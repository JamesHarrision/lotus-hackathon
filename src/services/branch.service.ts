import { BranchRepository } from "../repositories/branch.repository";
import { EnterpriseRepository } from "../repositories/enterprise.repository";
import { Prisma } from "@prisma/client";
import { getCoordinatesFromAddress } from "../utils/geocoding.util";

export class BranchService {
  private branchRepository: BranchRepository;
  private enterpriseRepository: EnterpriseRepository;

  constructor() {
    this.branchRepository = new BranchRepository();
    this.enterpriseRepository = new EnterpriseRepository();
  }

  async getAllBranches(enterpriseId?: number) {
    return this.branchRepository.findAll(enterpriseId);
  }

  async getBranchById(id: number) {
    const branch = await this.branchRepository.findById(id);
    if (!branch) {
      throw new Error("Branch not found");
    }
    return branch;
  }

  async createBranch(data: {
    enterpriseId: number;
    name: string;
    maxCapacity: number;
    address: string;
  }) {
    const enterprise = await this.enterpriseRepository.findById(data.enterpriseId);
    if (!enterprise) {
      throw new Error(`Enterprise with ID ${data.enterpriseId} not found`);
    }

    const { lat, lng, formattedAddress } = await getCoordinatesFromAddress(data.address);

    return this.branchRepository.create({
      ...data,
      lat,
      lng,
      address: formattedAddress,
    });
  }

  async updateBranch(id: number, data: Prisma.BranchUpdateInput) {
    const branch = await this.branchRepository.findById(id);
    if (!branch) {
      throw new Error("Branch not found");
    }
    return this.branchRepository.update(id, data);
  }

  async updateBranchLoad(id: number, currentLoad: number) {
    const branch = await this.branchRepository.findById(id);
    if (!branch) {
      throw new Error("Branch not found");
    }
    return this.branchRepository.updateLoad(id, currentLoad);
  }
}
