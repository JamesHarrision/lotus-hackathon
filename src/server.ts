import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app';
import { BranchService } from './services/branch.service';
import { initSocket } from './utils/socket.util';

const PORT = process.env.PORT || 8080;
const httpServer = http.createServer(app);
const branchService = new BranchService();

// Tích hợp Socket.io qua utility
const io = initSocket(httpServer);

// Lắng nghe kết nối từ AI Client (Python)
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // Event update_load từ AI
  socket.on('update_load', async (payload: { branchId: number; currentLoad: number }) => {
    try {
      const { branchId, currentLoad } = payload;

      // Kiểm tra payload cơ bản
      if (branchId === undefined || currentLoad === undefined) {
        console.error(`[Socket] Invalid payload from ${socket.id}:`, payload);
        return;
      }

      // Update thẳng xuống Database qua Service
      const updatedData = await branchService.updateBranchLoad(branchId, currentLoad);
      
      console.log(`[Socket] Branch ${branchId} updated: ${updatedData.currentLoad}/${updatedData.maxCapacity}`);
      
      // Broadcast dữ liệu mới cho tất cả các client (Frontend Dashboard)
      io.emit('branch_load_changed', { 
        branchId, 
        currentLoad: updatedData.currentLoad,
        maxCapacity: updatedData.maxCapacity,
        loadPercentage: Math.round((updatedData.currentLoad / updatedData.maxCapacity) * 10000) / 100
      });

    } catch (error: any) {
      console.error(`[Socket] Error updating load for branch:`, error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server (HTTP & Socket.io) is running on http://localhost:${PORT}`);
});
