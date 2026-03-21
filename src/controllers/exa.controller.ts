import { Request, Response } from 'express';
export const searchExa = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Query parameter "q" is required' });
    }

    const { ExaService } = await import('../services/exa.service');
    const exaService = new ExaService();
    const results = await exaService.search(q);

    res.status(200).json({
      status: 'success',
      data: results
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
