import { Request, Response } from "express";
import { EnterpriseService } from "../services/enterprise.service";

export class EnterpriseController {
  private enterpriseService: EnterpriseService;

  constructor() {
    this.enterpriseService = new EnterpriseService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const enterprises = await this.enterpriseService.getAllEnterprises();
      res.status(200).json({
        success: true,
        data: enterprises,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
      }
      const enterprise = await this.enterpriseService.getEnterpriseById(id);
      res.status(200).json({
        success: true,
        data: enterprise,
      });
    } catch (error: any) {
      const statusCode = error.message === "Enterprise not found" ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  };

  getGraph = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
      }
      const graph = await this.enterpriseService.getEnterpriseGraph(id);
      res.status(200).json({
        success: true,
        data: graph,
      });
    } catch (error: any) {
      const statusCode = error.message === "Enterprise not found" ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  };

  getDashboard = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
      }
      const dashboardData = await this.enterpriseService.getDashboardData(id);
      res.status(200).json({
        success: true,
        data: dashboardData,
      });
    } catch (error: any) {
      const statusCode = error.message === "Enterprise not found" ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  };

  create = async (req: Request, res: Response) => {
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
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
      }
      const enterprise = await this.enterpriseService.updateEnterprise(id, req.body);
      res.status(200).json({
        success: true,
        message: "Enterprise updated successfully",
        data: enterprise,
      });
    } catch (error: any) {
      const statusCode = error.message === "Enterprise not found" ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
      }
      await this.enterpriseService.deleteEnterprise(id);
      res.status(200).json({
        success: true,
        message: "Enterprise and related branches deleted successfully",
      });
    } catch (error: any) {
      const statusCode = error.message === "Enterprise not found" ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  };
}
