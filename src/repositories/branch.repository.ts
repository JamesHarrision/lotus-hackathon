import { prisma } from "../config/prisma.config";
import { Prisma, Branch } from "@prisma/client";

export class BranchRepository {
  async findAll(enterpriseId?: number): Promise<Branch[]> {
    return prisma.branch.findMany({
      where: enterpriseId ? { enterpriseId } : {},
    });
  }

  async findById(id: number): Promise<Branch | null> {
    return prisma.branch.findUnique({
      where: { id },
      include: {
        enterprise: true,
      }
    });
  }

  async findCoordinatesByEnterpriseId(enterpriseId: number): Promise<Pick<Branch, 'id' | 'lat' | 'lng'>[]> {
    return prisma.branch.findMany({
      where: { enterpriseId },
      select: {
        id: true,
        lat: true,
        lng: true,
      },
    });
  }

  async create(data: Prisma.BranchUncheckedCreateInput): Promise<Branch> {
    return prisma.branch.create({
      data,
    });
  }

  async update(id: number, data: Prisma.BranchUpdateInput): Promise<Branch> {
    return prisma.branch.update({
      where: { id },
      data,
    });
  }

  async updateLoad(id: number, currentLoad: number): Promise<{ currentLoad: number; maxCapacity: number }> {
    // Run update and log creation in a transaction
    const [branch] = await prisma.$transaction([
      prisma.branch.update({
        where: { id },
        data: { currentLoad },
        select: {
          currentLoad: true,
          maxCapacity: true,
        },
      }),
      prisma.branchLoadLog.create({
        data: {
          branchId: id,
          currentLoad: currentLoad
        }
      })
    ]);
    return branch;
  }

  async delete(id: number): Promise<Branch> {
    return prisma.branch.delete({
      where: { id },
    });
  }
}
