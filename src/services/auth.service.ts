import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { Prisma } from "@prisma/client";

export class AuthService {
  private userRepository: UserRepository;
  private readonly JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: Prisma.UserCreateInput) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(email: string, passwordPlain: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(passwordPlain, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      this.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
}
