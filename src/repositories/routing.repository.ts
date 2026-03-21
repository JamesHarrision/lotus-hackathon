import { prisma } from "../config/prisma.config";
import { RoutingHistory, RoutingStatus } from "@prisma/client";

export class RoutingRepository {
  async findById(id: number): Promise<RoutingHistory | null> {
    return prisma.routingHistory.findUnique({
      where: { id },
      include: {
        fromBranch: true,
        toBranch: true
      }
    });
  }

  async create(data: {
    userId: number;
    fromBranchId: number;
    toBranchId: number;
    status: RoutingStatus;
    incentiveGiven?: string;
    calculatedCost?: number;
    estimatedWaitTime?: number;
  }): Promise<RoutingHistory> {
    return prisma.routingHistory.create({
      data,
      include: {
        fromBranch: true,
        toBranch: true
      }
    });
  }

  async updateStatus(id: number, status: RoutingStatus): Promise<RoutingHistory> {
    return prisma.routingHistory.update({
      where: { id },
      data: { status },
    });
  }

  async findAll(): Promise<RoutingHistory[]> {
    return prisma.routingHistory.findMany({
      include: {
        user: { select: { name: true, email: true } },
        fromBranch: { select: { name: true } },
        toBranch: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllByUserId(userId: number): Promise<RoutingHistory[]> {
    return prisma.routingHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
