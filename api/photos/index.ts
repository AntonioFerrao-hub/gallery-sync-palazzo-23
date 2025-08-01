import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
import formidable from 'formidable';

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
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      if (categoryId) {
        const photos = await storage.getPhotosByCategory(categoryId);
        return res.json(photos);
      } else {
        const photos = await storage.getAllPhotos();
        return res.json(photos);
      }
    }

    if (req.method === 'POST') {
      const user = getAuthUser(req);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
      }

      // For Vercel, we'll handle base64 images
      const { title, description, categoryId, externalLink, imageUrl } = req.body;
      
      if (!title || !categoryId) {
        return res.status(400).json({ error: 'Título e categoria são obrigatórios' });
      }

      if (!imageUrl) {
        return res.status(400).json({ error: 'Imagem é obrigatória' });
      }

      const photo = await storage.createPhoto({
        title,
        description,
        categoryId: parseInt(categoryId),
        imageUrl,
        externalLink,
        uploadedBy: user.id
      });

      return res.json(photo);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Erro na API photos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}