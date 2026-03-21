import { prisma } from "../config/prisma.config";
import { RoutingHistory, RoutingStatus } from "@prisma/client";

export class RoutingRepository {
  async findById(id: number): Promise<RoutingHistory | null> {
    return prisma.routingHistory.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: number, status: RoutingStatus): Promise<RoutingHistory> {
    return prisma.routingHistory.update({
      where: { id },
      data: { status },
    });
  }

  async findAllByUserId(userId: number): Promise<RoutingHistory[]> {
    return prisma.routingHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
