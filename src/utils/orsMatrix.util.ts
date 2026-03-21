import axios from 'axios';
import { BranchRepository } from '../repositories/branch.repository';

export interface BranchEdge {
  fromBranchId: number;
  toBranchId: number;
  distanceMeters: number;
  durationMinutes: number;
}

export interface UserToBranchMatrix {
  branchId: number;
  distanceMeters: number;
  durationMinutes: number;
}

export const getUserToBranchesMatrix = async (userLat: number, userLng: number, branches: { id: number, lat: number, lng: number }[]): Promise<UserToBranchMatrix[]> => {
  const apiKey = process.env.OPENROUTESERVICE_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTESERVICE_API_KEY is not defined in .env');
  }

  // ORS Matrix: first location is source (user), others are destinations (branches)
  const locations = [
    [userLng, userLat], // Source
    ...branches.map(b => [b.lng, b.lat]) // Destinations
  ];

  const url = 'https://api.openrouteservice.org/v2/matrix/driving-car';

  try {
    const response = await axios.post(
      url,
      {
        locations,
        sources: [0], // Only user is source
        destinations: Array.from({ length: branches.length }, (_, i) => i + 1), // Branches are destinations
        metrics: ['distance', 'duration'],
        units: 'm',
      },
      {
        headers: {
          Authorization: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    const { distances, durations } = response.data;
    // distances[0] is array of distances from source 0 (user) to each destination
    
    return branches.map((branch, index) => {
      const dist = distances[0][index];
      const dur = durations[0][index];
      return {
        branchId: branch.id,
        distanceMeters: dist === null ? -1 : dist,
        durationMinutes: dur === null ? -1 : Math.round((dur / 60) * 100) / 100,
      };
    });
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message;
    throw new Error(`Error calling ORS Matrix API for user: ${errorMessage}`);
  }
};

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
