import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';

// Authentication middleware helper
function getAuthUser(req: VercelRequest) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    const userData = JSON.parse(Buffer.from(token, 'base64').toString());
    return userData;
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const categories = await storage.getAllCategories();
      return res.json(categories);
    }

    if (req.method === 'POST') {
      const user = getAuthUser(req);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
      }

      const { name, description } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Nome da categoria é obrigatório' });
      }

      // Generate slug from name
      const slug = name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const category = await storage.createCategory({ name, description, slug });
      return res.json(category);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Erro na API categories:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}