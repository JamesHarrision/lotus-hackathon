"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchRepository = void 0;
const prisma_config_1 = require("../config/prisma.config");
class BranchRepository {
    async findAll(enterpriseId) {
        return prisma_config_1.prisma.branch.findMany({
            where: enterpriseId ? { enterpriseId } : {},
        });
    }
    async findById(id) {
        return prisma_config_1.prisma.branch.findUnique({
            where: { id },
            include: {
                enterprise: true,
            }
        });
    }
    async create(data) {
        return prisma_config_1.prisma.branch.create({
            data,
        });
    }
    async update(id, data) {
        return prisma_config_1.prisma.branch.update({
            where: { id },
            data,
        });
    }
    async updateLoad(id, currentLoad) {
        const branch = await prisma_config_1.prisma.branch.update({
            where: { id },
            data: { currentLoad },
            select: {
                currentLoad: true,
                maxCapacity: true,
            },
        });
        return branch;
    }
    async delete(id) {
        return prisma_config_1.prisma.branch.delete({
            where: { id },
        });
    }
}
exports.BranchRepository = BranchRepository;
