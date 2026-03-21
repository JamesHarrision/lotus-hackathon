"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.changeUserRole = exports.createUser = exports.getAllUsers = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_config_1 = require("../config/prisma.config");
// [GET] /api/users - Lấy danh sách user
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma_config_1.prisma.user.findMany({
            select: { id: true, email: true, name: true, role: true, createdAt: true },
        });
        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};
exports.getAllUsers = getAllUsers;
// [POST] /api/users - Thêm user mới (như luồng đăng ký)
const createUser = async (req, res) => {
    try {
        const { email, password, name, phone, role } = req.body;
        const existingUser = await prisma_config_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await prisma_config_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
                role: role || client_1.Role.USER, // Mặc định là USER nếu không truyền
            },
            select: { id: true, email: true, name: true, role: true } // Trả về không chứa password
        });
        res.status(201).json({ success: true, data: newUser });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};
exports.createUser = createUser;
// [PATCH] /api/users/:id/role - Nâng cấp/Chuyển đổi Role (Quan trọng)
const changeUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, enterpriseName } = req.body; // Cần enterpriseName nếu up lên ENTERPRISE
        // 1. Cập nhật role cho User
        const updatedUser = await prisma_config_1.prisma.user.update({
            where: { id: Number(id) },
            data: { role },
            select: { id: true, email: true, role: true }
        });
        // 2. Logic đi kèm: Nếu đổi thành ENTERPRISE, tự động tạo luôn record trong bảng Enterprise
        if (role === client_1.Role.ENTERPRISE && enterpriseName) {
            // Check xem user này đã có doanh nghiệp chưa (tránh tạo đúp)
            const existingEnterprise = await prisma_config_1.prisma.enterprise.findUnique({ where: { userId: Number(id) } });
            if (!existingEnterprise) {
                await prisma_config_1.prisma.enterprise.create({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi cập nhật role' });
    }
};
exports.changeUserRole = changeUserRole;
// [DELETE] /api/users/:id - Xóa user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_config_1.prisma.user.delete({
            where: { id: Number(id) }
        });
        res.status(200).json({ success: true, message: 'Đã xóa người dùng' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Không thể xóa user này (có thể do vướng khóa ngoại)' });
    }
};
exports.deleteUser = deleteUser;
