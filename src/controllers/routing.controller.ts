import { Request, Response } from "express";
import { RoutingService } from "../services/routing.service";
import { RoutingStatus } from "@prisma/client";

export class RoutingController {
  private routingService: RoutingService;

  constructor() {
    this.routingService = new RoutingService();
  }

  updateStatus = async (req: Request, res: Response) => {
    try {
      const routingId = parseInt(req.params.routingId as string);
      const { status } = req.body;

      if (isNaN(routingId)) {
        return res.status(400).json({ success: false, message: "Invalid routing ID" });
      }

      if (!status || !['ACCEPTED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ 
          success: false, 
          message: "Status must be either 'ACCEPTED' or 'REJECTED'" 
        });
      }

      const updatedRouting = await this.routingService.updateRoutingStatus(routingId, status as RoutingStatus);

      res.status(200).json({
        success: true,
        message: `Routing status updated to ${status}`,
        data: updatedRouting
      });
    } catch (error: any) {
      const statusCode = error.message.includes("not found") ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  };

  getUserHistory = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
      }

      const history = await this.routingService.getUserRoutingHistory(userId);
      res.status(200).json({
        success: true,
        data: history
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  recommend = async (req: Request, res: Response) => {
    try {
      const { userId, enterpriseId, lat, lng, currentBranchId } = req.body;

      if (!userId || !enterpriseId || lat === undefined || lng === undefined) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing required fields: userId, enterpriseId, lat, lng" 
        });
      }

      const recommendation = await this.routingService.recommendBranch(
        userId, 
        enterpriseId, 
        lat, 
        lng,
        currentBranchId
      );

      res.status(200).json({
        success: true,
        message: "Branch recommendation generated successfully",
        data: recommendation
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const history = await this.routingService.getAllRoutingHistory();
      res.status(200).json({
        success: true,
        data: history
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
}
