"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = require("../repositories/user.repository");
class AuthService {
    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
        this.userRepository = new user_repository_1.UserRepository();
    }
    async register(data) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error("Email already exists");
        }
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        const user = await this.userRepository.create({
            ...data,
            password: hashedPassword,
        });
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async login(email, passwordPlain) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await bcryptjs_1.default.compare(passwordPlain, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, this.JWT_SECRET, { expiresIn: "1d" });
        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
}
exports.AuthService = AuthService;
