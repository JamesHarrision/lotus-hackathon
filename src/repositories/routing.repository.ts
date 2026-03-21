import { prisma } from "../config/prisma.config";
import { RoutingHistory, RoutingStatus } from "@prisma/client";

export class RoutingRepository {
  async findById(id: number): Promise<RoutingHistory | null> {
    return prisma.routingHistory.findUnique({
      where: { id },
    });
  }

  async create(data: {
    userId: number;
    fromBranchId: number;
    toBranchId: number;
    status: RoutingStatus;
    incentiveGiven?: string;
    calculatedCost?: number;
  }): Promise<RoutingHistory> {
    return prisma.routingHistory.create({
      data,
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
