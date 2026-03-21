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

  async getNearbyBranches(lat: number, lng: number, radiusKm: number = 5) {
    const branches = await this.branchRepository.findAll();
    
    // Tính khoảng cách Haversine đơn giản
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // Radius of the earth in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    return branches
      .map(branch => ({
        ...branch,
        distance: calculateDistance(lat, lng, branch.lat, branch.lng)
      }))
      .filter(branch => branch.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
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
    cameraUrl?: string;
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
