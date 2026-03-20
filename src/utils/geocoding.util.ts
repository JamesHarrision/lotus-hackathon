import axios from 'axios';

export const getCoordinatesFromAddress = async (address: string) => {
  const apiKey = process.env.OPENROUTESERVICE_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTESERVICE_API_KEY is not defined in .env');
  }

  // OpenRouteService Geocoding API endpoint - Add boundary.country=VN to restrict results to Vietnam
  const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(address)}&boundary.country=VN`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.features && data.features.length > 0) {
      // Note: OpenRouteService returns [lng, lat]
      const [lng, lat] = data.features[0].geometry.coordinates;
      const formattedAddress = data.features[0].properties.label;
      
      return { 
        lat, 
        lng, 
        formattedAddress 
      };
    } else {
      throw new Error(`Geocoding failed for address: ${address}. No features found.`);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message;
    throw new Error(`Error calling OpenRouteService Geocoding API: ${errorMessage}`);
  }
};
