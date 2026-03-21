import { Request, Response } from "express";
import { SuperAdminService } from "../services/superadmin.service";

export class SuperAdminController {
  private superAdminService: SuperAdminService;

  constructor() {
    this.superAdminService = new SuperAdminService();
  }

  getDashboard = async (req: Request, res: Response) => {
    try {
      const data = await this.superAdminService.getSystemDashboard();
      res.status(200).json({
        success: true,
        data: data
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
}
