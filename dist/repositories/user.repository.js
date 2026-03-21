"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_config_1 = require("../config/prisma.config");
class UserRepository {
    async findByEmail(email) {
        return prisma_config_1.prisma.user.findUnique({
            where: { email },
        });
    }
    async findById(id) {
        return prisma_config_1.prisma.user.findUnique({
            where: { id },
        });
    }
    async create(data) {
        return prisma_config_1.prisma.user.create({
            data,
        });
    }
    async update(id, data) {
        return prisma_config_1.prisma.user.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return prisma_config_1.prisma.user.delete({
            where: { id },
        });
    }
}
exports.UserRepository = UserRepository;
