import axios from 'axios';
import { BranchRepository } from '../repositories/branch.repository';

export interface BranchEdge {
  fromBranchId: number;
  toBranchId: number;
  distanceMeters: number;
  durationMinutes: number;
}

export const buildEnterpriseBranchGraph = async (enterpriseId: number): Promise<BranchEdge[]> => {
  const apiKey = process.env.OPENROUTESERVICE_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTESERVICE_API_KEY is not defined in .env');
  }

  const branchRepository = new BranchRepository();
  const branches = await branchRepository.findCoordinatesByEnterpriseId(enterpriseId);

  if (branches.length < 2) {
    return [];
  }

  // Format coordinates for ORS: [longitude, latitude]
  const locations = branches.map(b => [b.lng, b.lat]);

  const url = 'https://api.openrouteservice.org/v2/matrix/driving-car';

  try {
    const response = await axios.post(
      url,
      {
        locations,
        metrics: ['distance', 'duration'],
        units: 'm', // distance in meters
      },
      {
        headers: {
          Authorization: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    const { distances, durations } = response.data;
    const edges: BranchEdge[] = [];

    // Create unique pairs (undirected graph representation)
    // Using i and j to iterate through the matrix
    for (let i = 0; i < branches.length; i++) {
      for (let j = i + 1; j < branches.length; j++) {
        const dist = distances[i][j];
        const dur = durations[i][j];
        
        edges.push({
          fromBranchId: branches[i].id,
          toBranchId: branches[j].id,
          // Handle null cases where route cannot be found (e.g. across oceans)
          distanceMeters: dist === null ? -1 : dist,
          durationMinutes: dur === null ? -1 : Math.round((dur / 60) * 100) / 100,
        });
      }
    }

    return edges;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message;
    throw new Error(`Error calling ORS Matrix API: ${errorMessage}`);
  }
};
