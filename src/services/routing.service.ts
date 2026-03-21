import { RoutingRepository } from "../repositories/routing.repository";
import { BranchRepository } from "../repositories/branch.repository";
import { EnterpriseRepository } from "../repositories/enterprise.repository";
import { buildEnterpriseBranchGraph, getUserToBranchesMatrix } from "../utils/orsMatrix.util";
import { RoutingStatus } from "@prisma/client";
import axios from "axios";

export class RoutingService {
  private routingRepository: RoutingRepository;
  private branchRepository: BranchRepository;
  private enterpriseRepository: EnterpriseRepository;

  constructor() {
    this.routingRepository = new RoutingRepository();
    this.branchRepository = new BranchRepository();
    this.enterpriseRepository = new EnterpriseRepository();
  }

  async recommendBranch(userId: number, enterpriseId: number, userLat: number, userLng: number) {
    // 1. Get all branches and their current load
    const branches = await this.branchRepository.findAll(enterpriseId);
    if (branches.length === 0) {
      throw new Error("No branches found for this enterprise");
    }

    // 2. Get the pre-calculated distance/duration from USER to ALL branches
    const userToBranches = await getUserToBranchesMatrix(userLat, userLng, branches);

    // 3. Call AI-service (Python Algorithm)
    // Format payload for AI Team - Now only sending user-to-branch distances
    const aiPayload = {
      userId,
      userLocation: { lat: userLat, lng: userLng },
      branches: branches.map(b => ({
        id: b.id,
        name: b.name,
        lat: b.lat,
        lng: b.lng,
        currentLoad: b.currentLoad,
        maxCapacity: b.maxCapacity
      })),
      userToBranches: userToBranches // Distances from user to branches
    };

    try {
      // Assuming AI Service URL is in env or default to localhost:5000
      const AI_SERVICE_URL = process.env.AI_ALGO_SERVICE_URL || 'http://localhost:5000/algorithm/optimize';
      const aiResponse = await axios.post(AI_SERVICE_URL, aiPayload);
      
      const { recommendedBranchId, fromBranchId, cost } = aiResponse.data;

      // 4. Save to RoutingHistory
      return this.routingRepository.create({
        userId,
        fromBranchId: fromBranchId || branches[0].id, // Default to first if not provided
        toBranchId: recommendedBranchId,
        status: 'PENDING',
        calculatedCost: cost
      });

    } catch (error: any) {
      console.error("AI Service Error:", error.message);
      throw new Error(`AI Service currently unavailable: ${error.message}`);
    }
  }

  async updateRoutingStatus(id: number, status: RoutingStatus) {
    const routing = await this.routingRepository.findById(id);
    if (!routing) {
      throw new Error("Routing history not found");
    }

    if (routing.status !== 'PENDING') {
      throw new Error(`Cannot update routing status from ${routing.status}. Only PENDING status can be updated.`);
    }

    return this.routingRepository.updateStatus(id, status);
  }

  async getUserRoutingHistory(userId: number) {
    return this.routingRepository.findAllByUserId(userId);
  }

  async getAllRoutingHistory() {
    return this.routingRepository.findAll();
  }
}
