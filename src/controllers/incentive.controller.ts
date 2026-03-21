import { Request, Response } from "express";
import { IncentiveService } from "../services/incentive.service";

export class IncentiveController {
  private incentiveService: IncentiveService;

  constructor() {
    this.incentiveService = new IncentiveService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const enterpriseId = req.query.enterpriseId ? parseInt(req.query.enterpriseId as string) : undefined;
      const incentives = await this.incentiveService.getAllIncentives(enterpriseId);
      res.status(200).json({
        success: true,
        data: incentives
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const incentive = await this.incentiveService.createIncentive(req.body);
      res.status(201).json({
        success: true,
        message: "Incentive created successfully",
        data: incentive
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const incentive = await this.incentiveService.updateIncentive(id, req.body);
      res.status(200).json({
        success: true,
        message: "Incentive updated successfully",
        data: incentive
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      await this.incentiveService.deleteIncentive(id);
      res.status(200).json({
        success: true,
        message: "Incentive deleted successfully"
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
}
