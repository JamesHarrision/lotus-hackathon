"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseService = void 0;
const enterprise_repository_1 = require("../repositories/enterprise.repository");
class EnterpriseService {
    constructor() {
        this.enterpriseRepository = new enterprise_repository_1.EnterpriseRepository();
    }
    async getAllEnterprises() {
        return this.enterpriseRepository.findAll();
    }
    async getEnterpriseById(id) {
        const enterprise = await this.enterpriseRepository.findByIdWithBranches(id);
        if (!enterprise) {
            throw new Error("Enterprise not found");
        }
        return enterprise;
    }
    async createEnterprise(data) {
        return this.enterpriseRepository.create(data);
    }
    async updateEnterprise(id, data) {
        const enterprise = await this.enterpriseRepository.findByIdWithBranches(id);
        if (!enterprise) {
            throw new Error("Enterprise not found");
        }
        return this.enterpriseRepository.update(id, data);
    }
    async deleteEnterprise(id) {
        const enterprise = await this.enterpriseRepository.findByIdWithBranches(id);
        if (!enterprise) {
            throw new Error("Enterprise not found");
        }
        return this.enterpriseRepository.delete(id);
    }
}
exports.EnterpriseService = EnterpriseService;
