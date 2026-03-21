import { Router } from 'express';
import { searchExa } from '../controllers/exa.controller';

const router = Router();

/**
 * @swagger
 * /api/exa/search:
 *   get:
 *     summary: Search using Exa AI
 *     tags: [Exa]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query
 */
router.get('/search', searchExa);

export default router;
