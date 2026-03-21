import { RoutingRepository } from "../repositories/routing.repository";
import { BranchRepository } from "../repositories/branch.repository";
import { EnterpriseRepository } from "../repositories/enterprise.repository";
import { IncentiveRepository } from "../repositories/incentive.repository";
import { buildEnterpriseBranchGraph, getUserToBranchesMatrix } from "../utils/orsMatrix.util";
import { RoutingStatus } from "@prisma/client";
import axios from "axios";

export class RoutingService {
  private routingRepository: RoutingRepository;
  private branchRepository: BranchRepository;
  private enterpriseRepository: EnterpriseRepository;
  private incentiveRepository: IncentiveRepository;

  constructor() {
    this.routingRepository = new RoutingRepository();
    this.branchRepository = new BranchRepository();
    this.enterpriseRepository = new EnterpriseRepository();
    this.incentiveRepository = new IncentiveRepository();
  }

  async recommendBranch(userId: number, enterpriseId: number, userLat: number, userLng: number, currentBranchId?: number) {
    // 1. Get all branches and their current load
    const branches = await this.branchRepository.findAll(enterpriseId);
    if (branches.length === 0) {
      throw new Error("No branches found for this enterprise");
    }

    // 2. Get the pre-calculated distance/duration from USER to ALL branches
    const userToBranches = await getUserToBranchesMatrix(userLat, userLng, branches);

    // 3. Call AI-service (Python Algorithm)
    // We create a more detailed payload for the Python AI Service
    const aiPayload = {
      company_id: enterpriseId.toString(),
      user_prefs: {
        user_id: userId.toString(),
        beta_dist: -1.5,  // Penalty per km
        beta_wait: -2.0,  // Penalty per wait minute (users hate waiting more than traveling)
        beta_inc: 0.8     // Boost per incentive point
      },
      current_branch_id: (currentBranchId || branches[0].id).toString(),
      // Additional context for the AI service if it needs it
      branches_data: branches.map(b => ({
        branch_id: b.id.toString(),
        company_id: enterpriseId.toString(),
        current_capacity: b.currentLoad,
        max_capacity: b.maxCapacity,
        arrival_rate_lambda: 2.0, // Mock rates for now
        departure_rate_mu: 1.5,
        avg_serving_time_minutes: 3.0
      })),
      user_to_branches: userToBranches.map((matrix, index) => ({
        branch_id: branches[index].id.toString(),
        distance_km: matrix.distanceMeters / 1000,
        travel_time_minutes: matrix.durationMinutes
      }))
    };

    try {
      // Python AI Service URL (Capacity Controller)
      const AI_SERVICE_URL = process.env.AI_ALGO_SERVICE_URL || 'http://localhost:8000/capacity/calculate-routes';
      const aiResponse = await axios.post(AI_SERVICE_URL, aiPayload);
      
      const { recommended_branch_id, estimated_wait_time, cost } = aiResponse.data;

      // 4. Check for applicable incentive based on strict distance criteria
      let incentiveGiven = null;
      if (parseInt(recommended_branch_id) !== (currentBranchId || branches[0].id)) {
        const recBranch = branches.find(b => b.id === parseInt(recommended_branch_id));
        const currentBranch = branches.find(b => b.id === (currentBranchId || branches[0].id));
        
        if (recBranch && currentBranch) {
          // Hàm tính khoảng cách xấp xỉ (km)
          const getDistKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
            return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2)) * 111.32;
          };

          const distOldToNew = getDistKm(currentBranch.lat, currentBranch.lng, recBranch.lat, recBranch.lng);
          const distUserToNew = getDistKm(userLat, userLng, recBranch.lat, recBranch.lng);
          const distUserToOld = getDistKm(userLat, userLng, currentBranch.lat, currentBranch.lng);

          // Chống Spam: Kiểm tra xem user đã nhận voucher nào trong 24h qua chưa
          const last24h = new Date();
          last24h.setHours(last24h.getHours() - 24);
          
          const recentVoucher = await this.routingRepository.findAllByUserId(userId);
          const hasVoucherIn24h = recentVoucher.some(r => r.incentiveGiven && r.createdAt > last24h);

          // Điều kiện cấp Voucher cực kỳ khắt khe:
          // 1. Khoảng cách từ chi nhánh cũ sang chi nhánh mới > 10km
          // 2. Người dùng phải đi xa thêm > 10km so với chi nhánh cũ
          // 3. Chưa nhận voucher nào trong vòng 24h qua
          if (distOldToNew > 10 && (distUserToNew - distUserToOld) > 10 && !hasVoucherIn24h) {
            const incentives = await this.incentiveRepository.findAll(enterpriseId);
            if (incentives.length > 0) {
              incentiveGiven = incentives[0].code;
            }
          }
        }
      }

      // 5. Save to RoutingHistory
      return this.routingRepository.create({
        userId,
        fromBranchId: currentBranchId || branches[0].id,
        toBranchId: parseInt(recommended_branch_id),
        status: 'PENDING',
        calculatedCost: cost,
        estimatedWaitTime: estimated_wait_time,
        incentiveGiven: incentiveGiven || undefined
      });

    } catch (error: any) {
      console.error("AI Service Error:", error.response?.data || error.message);
      throw new Error(`AI Service error: ${error.response?.data?.detail || error.message}`);
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
