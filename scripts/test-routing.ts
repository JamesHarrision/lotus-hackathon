import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:8080/api';

async function testRoutingFlow() {
  console.log('--- STARTING ROUTING API TEST ---');

  try {
    // 1. Setup Data (User, Enterprise, Branch)
    let user = await prisma.user.findFirst({ where: { email: 'test_user@example.com' } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'test_user@example.com',
          password: 'hashed_password',
          name: 'Test User',
          role: 'USER',
        },
      });
      console.log('Created test user:', user.id);
    }

    let enterprise = await prisma.enterprise.findFirst({ where: { userId: user.id } });
    if (!enterprise) {
      enterprise = await prisma.enterprise.create({
        data: {
          name: 'Test Enterprise',
          userId: user.id,
        },
      });
      console.log('Created test enterprise:', enterprise.id);
    }

    let branch1 = await prisma.branch.findFirst({ where: { enterpriseId: enterprise.id, name: 'Branch A' } });
    if (!branch1) {
      branch1 = await prisma.branch.create({
        data: {
          name: 'Branch A',
          enterpriseId: enterprise.id,
          lat: 10.7,
          lng: 106.7,
          maxCapacity: 100,
        },
      });
      console.log('Created branch A:', branch1.id);
    }

    let branch2 = await prisma.branch.findFirst({ where: { enterpriseId: enterprise.id, name: 'Branch B' } });
    if (!branch2) {
      branch2 = await prisma.branch.create({
        data: {
          name: 'Branch B',
          enterpriseId: enterprise.id,
          lat: 10.8,
          lng: 106.8,
          maxCapacity: 50,
        },
      });
      console.log('Created branch B:', branch2.id);
    }

    // 2. Create a PENDING RoutingHistory record
    const routing = await prisma.routingHistory.create({
      data: {
        userId: user.id,
        fromBranchId: branch1.id,
        toBranchId: branch2.id,
        status: 'PENDING',
        incentiveGiven: 'VOUCHER_10',
        calculatedCost: 15.5,
      },
    });
    console.log('Created PENDING routing record:', routing.id);

    // 3. Test API: PATCH /api/routings/:id/status (ACCEPT)
    console.log(`Testing ACCEPT status for routing ${routing.id}...`);
    const acceptRes = await axios.patch(`${API_URL}/routings/${routing.id}/status`, {
      status: 'ACCEPTED',
    });
    
    if (acceptRes.data.success && acceptRes.data.data.status === 'ACCEPTED') {
      console.log('✅ SUCCESS: Status updated to ACCEPTED');
    } else {
      console.error('❌ FAILED: Status update failed', acceptRes.data);
    }

    // 4. Test API: PATCH /api/routings/:id/status (Try to REJECT an already ACCEPTED one)
    console.log(`Testing REJECT status for routing ${routing.id} (expect failure)...`);
    try {
      await axios.patch(`${API_URL}/routings/${routing.id}/status`, {
        status: 'REJECTED',
      });
      console.error('❌ FAILED: Should not allow updating non-PENDING status');
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        console.log('✅ SUCCESS: Correctly blocked updating non-PENDING status');
      } else {
        console.error('❌ FAILED: Unexpected error', error.message);
      }
    }

    // 5. Test API: GET /api/routings/user/:userId
    console.log(`Testing GET user history for user ${user.id}...`);
    const historyRes = await axios.get(`${API_URL}/routings/user/${user.id}`);
    if (historyRes.data.success && Array.isArray(historyRes.data.data)) {
      console.log(`✅ SUCCESS: Retrieved ${historyRes.data.data.length} routing records`);
    } else {
      console.error('❌ FAILED: Could not retrieve history');
    }

  } catch (error: any) {
    console.error('❌ FATAL ERROR DURING TEST:', error.message);
    if (error.response) console.error('Response data:', error.response.data);
  } finally {
    await prisma.$disconnect();
    console.log('--- TEST FINISHED ---');
  }
}

testRoutingFlow();
