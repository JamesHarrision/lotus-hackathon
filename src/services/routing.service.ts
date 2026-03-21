import { RoutingRepository } from "../repositories/routing.repository";
import { RoutingStatus } from "@prisma/client";

export class RoutingService {
  private routingRepository: RoutingRepository;

  constructor() {
    this.routingRepository = new RoutingRepository();
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
}
