import { Request, Response } from "express";
import { BranchService } from "../services/branch.service";
import { getIO } from "../utils/socket.util";

export class BranchController {
  private branchService: BranchService;

  constructor() {
    this.branchService = new BranchService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const enterpriseId = req.query.enterpriseId ? parseInt(req.query.enterpriseId as string) : undefined;
      const branches = await this.branchService.getAllBranches(enterpriseId);
      res.status(200).json({
        success: true,
        data: branches,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getNearby = async (req: Request, res: Response) => {
    try {
      const { lat, lng, radius } = req.query;
      if (!lat || !lng) {
        return res.status(400).json({ success: false, message: "Vui lòng cung cấp tọa độ lat, lng" });
      }
      
      const branches = await this.branchService.getNearbyBranches(
        parseFloat(lat as string),
        parseFloat(lng as string),
        radius ? parseFloat(radius as string) : 5
      );

      res.status(200).json({
        success: true,
        data: branches,
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
      const branch = await this.branchService.getBranchById(id);
      res.status(200).json({
        success: true,
        data: branch,
      });
    } catch (error: any) {
      const statusCode = error.message === "Branch not found" ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const { enterpriseId, name, maxCapacity, address, cameraUrl } = req.body;
      if (!enterpriseId || !name || !maxCapacity || !address) {
        return res.status(400).json({ success: false, message: "Missing required fields: enterpriseId, name, maxCapacity, address" });
      }
      const branch = await this.branchService.createBranch({ enterpriseId, name, maxCapacity, address, cameraUrl });

      // Phát sự kiện real-time cho AI Client (Python) nếu có cameraUrl
      if (cameraUrl) {
        getIO().emit('new_camera_added', {
          enterpriseId: branch.enterpriseId,
          branchId: branch.id,
          cameraUrl: branch.cameraUrl
        });
        console.log(`[Socket] Emitted new_camera_added for branch ${branch.id}`);
      }

      res.status(201).json({
        success: true,
        message: "Branch created successfully",
        data: branch,
      });
    } catch (error: any) {
      const statusCode = error.message.includes("not found") ? 404 : 500;
      res.status(statusCode).json({
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
      const branch = await this.branchService.updateBranch(id, req.body);

      // Phát sự kiện nếu có cameraUrl mới được thêm hoặc cập nhật
      if (req.body.cameraUrl) {
        getIO().emit('new_camera_added', {
          enterpriseId: branch.enterpriseId,
          branchId: branch.id,
          cameraUrl: branch.cameraUrl
        });
        console.log(`[Socket] Emitted new_camera_added for updated branch ${branch.id}`);
      }

      res.status(200).json({
        success: true,
        message: "Branch updated successfully",
        data: branch,
      });
    } catch (error: any) {
      const statusCode = error.message === "Branch not found" ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  };

  updateLoad = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
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
    } catch (error: any) {
      const statusCode = error.message === "Branch not found" ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
        });
    }
  };

  geocode = async (req: Request, res: Response) => {
    try {
      const { address } = req.query;
      if (!address) {
        return res.status(400).json({ success: false, message: "Missing address query parameter" });
      }
      const coordinates = await this.branchService.geocode(address as string);
      res.status(200).json({
        success: true,
        data: coordinates,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
}
