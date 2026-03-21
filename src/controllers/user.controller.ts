import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.config';

// [GET] /api/users - Lấy danh sách user
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// [POST] /api/users - Thêm user mới (như luồng đăng ký)
export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, name, phone, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: role || Role.USER, // Mặc định là USER nếu không truyền
      },
      select: { id: true, email: true, name: true, role: true } // Trả về không chứa password
    });

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// [PATCH] /api/users/:id/role - Nâng cấp/Chuyển đổi Role (Quan trọng)
export const changeUserRole = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { role, enterpriseName } = req.body; // Cần enterpriseName nếu up lên ENTERPRISE

    // 1. Cập nhật role cho User
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { role },
      select: { id: true, email: true, role: true }
    });

    // 2. Logic đi kèm: Nếu đổi thành ENTERPRISE, tự động tạo luôn record trong bảng Enterprise
    if (role === Role.ENTERPRISE && enterpriseName) {
      // Check xem user này đã có doanh nghiệp chưa (tránh tạo đúp)
      const existingEnterprise = await prisma.enterprise.findUnique({ where: { userId: Number(id) } });

      if (!existingEnterprise) {
        await prisma.enterprise.create({
          data: {
            name: enterpriseName,
            userId: Number(id)
          }
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật phân quyền thành công',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật role' });
  }
};

// [DELETE] /api/users/:id - Xóa user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: Number(id) }
    });
    res.status(200).json({ success: true, message: 'Đã xóa người dùng' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Không thể xóa user này (có thể do vướng khóa ngoại)' });
  }
};

