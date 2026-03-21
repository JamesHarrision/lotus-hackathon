"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchService = void 0;
const branch_repository_1 = require("../repositories/branch.repository");
const googleMaps_util_1 = require("../utils/googleMaps.util");
class BranchService {
    constructor() {
        this.branchRepository = new branch_repository_1.BranchRepository();
    }
    async getAllBranches(enterpriseId) {
        return this.branchRepository.findAll(enterpriseId);
    }
    async getBranchById(id) {
        const branch = await this.branchRepository.findById(id);
        if (!branch) {
            throw new Error("Branch not found");
        }
        return branch;
    }
    async createBranch(data) {
        const { lat, lng, formattedAddress } = await (0, googleMaps_util_1.getCoordinatesFromAddress)(data.address);
        return this.branchRepository.create({
            ...data,
            lat,
            lng,
            address: formattedAddress,
        });
    }
    async updateBranch(id, data) {
        const branch = await this.branchRepository.findById(id);
        if (!branch) {
            throw new Error("Branch not found");
        }
        return this.branchRepository.update(id, data);
    }
    async updateBranchLoad(id, currentLoad) {
        const branch = await this.branchRepository.findById(id);
        if (!branch) {
            throw new Error("Branch not found");
        }
        return this.branchRepository.updateLoad(id, currentLoad);
    }
}
exports.BranchService = BranchService;
