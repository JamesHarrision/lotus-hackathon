"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    constructor() {
        this.register = async (req, res) => {
            try {
                const user = await this.authService.register(req.body);
                res.status(201).json({
                    status: "success",
                    data: user,
                });
            }
            catch (error) {
                res.status(400).json({
                    status: "error",
                    message: error.message,
                });
            }
        };
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                const result = await this.authService.login(email, password);
                res.status(200).json({
                    status: "success",
                    data: result,
                });
            }
            catch (error) {
                res.status(401).json({
                    status: "error",
                    message: error.message,
                });
            }
        };
        this.authService = new auth_service_1.AuthService();
    }
}
exports.AuthController = AuthController;
