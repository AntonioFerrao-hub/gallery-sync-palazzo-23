import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const galleries = await storage.getAllCategoriesWithPhotos();
    res.json(galleries);
  } catch (error) {
    console.error('Erro ao buscar galerias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}