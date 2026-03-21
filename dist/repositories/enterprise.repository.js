"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseRepository = void 0;
const prisma_config_1 = require("../config/prisma.config");
class EnterpriseRepository {
    async findAll() {
        return prisma_config_1.prisma.enterprise.findMany();
    }
    async findByIdWithBranches(id) {
        return prisma_config_1.prisma.enterprise.findUnique({
            where: { id },
            include: {
                branches: true,
            },
        });
    }
    async create(data) {
        return prisma_config_1.prisma.enterprise.create({
            data,
        });
    }
    async update(id, data) {
        return prisma_config_1.prisma.enterprise.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        // Delete related branches first since there's no cascade delete in schema
        await prisma_config_1.prisma.branch.deleteMany({
            where: { enterpriseId: id },
        });
        return prisma_config_1.prisma.enterprise.delete({
            where: { id },
        });
    }
}
exports.EnterpriseRepository = EnterpriseRepository;
