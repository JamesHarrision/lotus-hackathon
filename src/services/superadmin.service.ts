import { prisma } from "../config/prisma.config";

export class SuperAdminService {
  async getSystemDashboard() {
    const totalUsers = await prisma.user.count();
    const totalEnterprises = await prisma.enterprise.count();
    const totalBranches = await prisma.branch.count();
    const totalRoutings = await prisma.routingHistory.count();

    // Get system-wide traffic for the last 7 days
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const loadLogs = await prisma.branchLoadLog.findMany({
      where: { timestamp: { gte: last7Days } },
      orderBy: { timestamp: 'asc' }
    });

    // Simple daily aggregation for the chart
    const dailyTraffic: any[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      
      const dayLabel = date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'short' });
      const dayLogs = loadLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate.toDateString() === date.toDateString();
      });

      const totalLoad = dayLogs.reduce((sum, log) => sum + log.currentLoad, 0);
      const avgLoad = dayLogs.length > 0 ? totalLoad / dayLogs.length : 0;

      dailyTraffic.push({
        name: dayLabel,
        traffic: Math.round(avgLoad),
        requests: dayLogs.length
      });
    }

    // Get conversion rate
    const accepted = await prisma.routingHistory.count({ where: { status: 'ACCEPTED' } });
    const total = await prisma.routingHistory.count({ where: { status: { in: ['ACCEPTED', 'REJECTED'] } } });
    const conversionRate = total > 0 ? (accepted / total) * 100 : 0;

    return {
      stats: {
        totalUsers,
        totalEnterprises,
        totalBranches,
        totalRoutings,
        conversionRate: Math.round(conversionRate * 10) / 10
      },
      systemTraffic: dailyTraffic
    };
  }
}
