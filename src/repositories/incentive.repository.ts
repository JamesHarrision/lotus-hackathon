import { prisma } from "../config/prisma.config";
import { Incentive, Prisma } from "@prisma/client";

export class IncentiveRepository {
  async findAll(enterpriseId?: number): Promise<Incentive[]> {
    return prisma.incentive.findMany({
      where: {
        ...(enterpriseId ? { enterpriseId } : {}),
        isActive: true
      }
    });
  }

  async findById(id: number): Promise<Incentive | null> {
    return prisma.incentive.findUnique({
      where: { id }
    });
  }

  async findByCode(code: string): Promise<Incentive | null> {
    return prisma.incentive.findUnique({
      where: { code }
    });
  }

  async create(data: Prisma.IncentiveUncheckedCreateInput): Promise<Incentive> {
    return prisma.incentive.create({
      data
    });
  }

  async update(id: number, data: Prisma.IncentiveUpdateInput): Promise<Incentive> {
    return prisma.incentive.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<Incentive> {
    return prisma.incentive.update({
      where: { id },
      data: { isActive: false }
    });
  }
}
