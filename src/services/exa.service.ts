import axios from 'axios';

export class ExaService {
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://api.exa.ai';

  constructor() {
    this.apiKey = process.env.EXA_API_KEY || '';
    if (!this.apiKey) {
      console.warn('[ExaService] EXA_API_KEY is not defined in environment variables.');
    }
  }

  async search(query: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/search`,
        {
          query,
          useAutoprompt: true,
          type: 'neural',
          numResults: 5,
          contents: {
            text: { maxCharacters: 1000 },
            highlights: true,
            summary: true
          }
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.results;
    } catch (error: any) {
      console.error('[ExaService] Error searching:', error.response?.data || error.message);
      throw new Error('Failed to fetch data from Exa');
    }
  }

  async getContents(ids: string[]) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/contents`,
        { ids },
        {
          headers: {
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.results;
    } catch (error: any) {
      console.error('[ExaService] Error getting contents:', error.response?.data || error.message);
      throw new Error('Failed to fetch contents from Exa');
    }
  }
}
