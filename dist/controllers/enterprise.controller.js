"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseController = void 0;
const enterprise_service_1 = require("../services/enterprise.service");
class EnterpriseController {
    constructor() {
        this.getAll = async (req, res) => {
            try {
                const enterprises = await this.enterpriseService.getAllEnterprises();
                res.status(200).json({
                    success: true,
                    data: enterprises,
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
                const enterprise = await this.enterpriseService.getEnterpriseById(id);
                res.status(200).json({
                    success: true,
                    data: enterprise,
                });
            }
            catch (error) {
                const statusCode = error.message === "Enterprise not found" ? 404 : 500;
                res.status(statusCode).json({
                    success: false,
                    message: error.message,
                });
            }
        };
        this.create = async (req, res) => {
            try {
                const { name, userId } = req.body;
                if (!name || !userId) {
                    return res.status(400).json({ success: false, message: "Name and userId are required" });
                }
                const enterprise = await this.enterpriseService.createEnterprise({ name, userId });
                res.status(201).json({
                    success: true,
                    message: "Enterprise created successfully",
                    data: enterprise,
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
                const enterprise = await this.enterpriseService.updateEnterprise(id, req.body);
                res.status(200).json({
                    success: true,
                    message: "Enterprise updated successfully",
                    data: enterprise,
                });
            }
            catch (error) {
                const statusCode = error.message === "Enterprise not found" ? 404 : 500;
                res.status(statusCode).json({
                    success: false,
                    message: error.message,
                });
            }
        };
        this.delete = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ success: false, message: "Invalid ID" });
                }
                await this.enterpriseService.deleteEnterprise(id);
                res.status(200).json({
                    success: true,
                    message: "Enterprise and related branches deleted successfully",
                });
            }
            catch (error) {
                const statusCode = error.message === "Enterprise not found" ? 404 : 500;
                res.status(statusCode).json({
                    success: false,
                    message: error.message,
                });
            }
        };
        this.enterpriseService = new enterprise_service_1.EnterpriseService();
    }
}
exports.EnterpriseController = EnterpriseController;
