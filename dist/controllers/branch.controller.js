"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchController = void 0;
const branch_service_1 = require("../services/branch.service");
class BranchController {
    constructor() {
        this.getAll = async (req, res) => {
            try {
                const enterpriseId = req.query.enterpriseId ? parseInt(req.query.enterpriseId) : undefined;
                const branches = await this.branchService.getAllBranches(enterpriseId);
                res.status(200).json({
                    success: true,
                    data: branches,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        };
        this.getById = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ success: false, message: "Invalid ID" });
                }
                const branch = await this.branchService.getBranchById(id);
                res.status(200).json({
                    success: true,
                    data: branch,
                });
            }
            catch (error) {
                const statusCode = error.message === "Branch not found" ? 404 : 500;
                res.status(statusCode).json({
                    success: false,
                    message: error.message,
                });
            }
        };
        this.create = async (req, res) => {
            try {
                const { enterpriseId, name, maxCapacity, address } = req.body;
                if (!enterpriseId || !name || !maxCapacity || !address) {
                    return res.status(400).json({ success: false, message: "Missing required fields: enterpriseId, name, maxCapacity, address" });
                }
                const branch = await this.branchService.createBranch({ enterpriseId, name, maxCapacity, address });
                res.status(201).json({
                    success: true,
                    message: "Branch created successfully",
                    data: branch,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        };
        this.update = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ success: false, message: "Invalid ID" });
                }
                const branch = await this.branchService.updateBranch(id, req.body);
                res.status(200).json({
                    success: true,
                    message: "Branch updated successfully",
                    data: branch,
                });
            }
            catch (error) {
                const statusCode = error.message === "Branch not found" ? 404 : 500;
                res.status(statusCode).json({
                    success: false,
                    message: error.message,
                });
            }
        };
        this.updateLoad = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                const { currentLoad } = req.body;
                if (isNaN(id) || currentLoad === undefined) {
                    return res.status(400).json({ success: false, message: "Invalid ID or missing currentLoad" });
                }
                const data = await this.branchService.updateBranchLoad(id, currentLoad);
                res.status(200).json({
                    success: true,
                    message: "Branch load updated by AI system",
                    data: data,
                });
            }
            catch (error) {
                const statusCode = error.message === "Branch not found" ? 404 : 500;
                res.status(statusCode).json({
                    success: false,
                    message: error.message,
                });
            }
        };
        this.branchService = new branch_service_1.BranchService();
    }
}
exports.BranchController = BranchController;
