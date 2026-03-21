import { prisma } from "../config/prisma.config";
import { Prisma, Enterprise } from "@prisma/client";

export class EnterpriseRepository {
  async findAll(): Promise<Enterprise[]> {
    return prisma.enterprise.findMany();
  }

  async findById(id: number): Promise<Enterprise | null> {
    return prisma.enterprise.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: number): Promise<Enterprise | null> {
    return prisma.enterprise.findUnique({
      where: { userId },
    });
  }

  async findByIdWithBranches(id: number) {
    return prisma.enterprise.findUnique({
      where: { id },
      include: {
        branches: true,
      },
    });
  }

  async create(data: Prisma.EnterpriseUncheckedCreateInput): Promise<Enterprise> {
    return prisma.enterprise.create({
      data,
    });
  }

  async update(id: number, data: Prisma.EnterpriseUpdateInput): Promise<Enterprise> {
    return prisma.enterprise.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Enterprise> {
    // Delete related branches first since there's no cascade delete in schema
    await prisma.branch.deleteMany({
      where: { enterpriseId: id },
    });
    
    return prisma.enterprise.delete({
      where: { id },
    });
  }
}
