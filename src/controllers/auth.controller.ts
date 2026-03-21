import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json({
        status: "success",
        data: user,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({
        status: "error",
        message: error.message,
      });
    }
  };
}
