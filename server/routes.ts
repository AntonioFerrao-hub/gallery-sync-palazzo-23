import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuração do multer para upload de arquivos
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 20 * 1024 * 1024 * 1024 // 20GB
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de acesso necessário' });
    }
    
    const token = authHeader.substring(7);
    // Simple token validation (em produção, use JWT)
    const userData = JSON.parse(Buffer.from(token, 'base64').toString());
    req.user = userData;
    next();
  };

  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
    }
    next();
  };

  // Auth routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Simple token generation (em produção, use JWT)
      const token = Buffer.from(JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role
      })).toString('base64');

      res.json({
        user: { id: user.id, username: user.username, role: user.role },
        token
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.post('/api/auth/register', async (req, res) => {
    try {
      const { username, password, role = 'user' } = req.body;
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: 'Nome de usuário já existe' });
      }

      const user = await storage.createUser({ username, password, role });
      res.json({ user: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Category routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.get('/api/categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const categoryWithPhotos = await storage.getCategoryWithPhotos(id);
      
      if (!categoryWithPhotos) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      
      res.json(categoryWithPhotos);
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.get('/api/categories/slug/:slug', async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      
      if (!category) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      
      const photos = await storage.getPhotosByCategory(category.id);
      res.json({ category, photos });
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.post('/api/categories', requireAuth, requireAdmin, async (req, res) => {
    try {
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
      res.json(category);
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.put('/api/categories/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { name, description } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Nome da categoria é obrigatório' });
      }

      // Generate new slug if name changed
      const slug = name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const category = await storage.updateCategory({ id, name, description, slug });
      res.json(category);
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.delete('/api/categories/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCategory(id);
      res.json({ message: 'Categoria removida com sucesso' });
    } catch (error) {
      console.error('Erro ao remover categoria:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Photo routes
  app.get('/api/photos', async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      if (categoryId) {
        const photos = await storage.getPhotosByCategory(categoryId);
        res.json(photos);
      } else {
        const photos = await storage.getAllPhotos();
        res.json(photos);
      }
    } catch (error) {
      console.error('Erro ao buscar fotos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.post('/api/photos', requireAuth, requireAdmin, upload.single('image'), async (req, res) => {
    try {
      const { title, description, categoryId, externalLink } = req.body;
      
      if (!title || !categoryId) {
        return res.status(400).json({ error: 'Título e categoria são obrigatórios' });
      }

      let imageUrl = '';
      
      if (req.file) {
        // File uploaded via multer
        imageUrl = `/uploads/${req.file.filename}`;
      } else if (req.body.imageUrl) {
        // Base64 image or external URL
        imageUrl = req.body.imageUrl;
      } else {
        return res.status(400).json({ error: 'Imagem é obrigatória' });
      }

      const photo = await storage.createPhoto({
        title,
        description,
        categoryId: parseInt(categoryId),
        imageUrl,
        externalLink,
        uploadedBy: req.user.id
      });

      res.json(photo);
    } catch (error) {
      console.error('Erro ao criar foto:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.put('/api/photos/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { title, description, externalLink } = req.body;
      
      const photo = await storage.updatePhoto({
        id,
        title,
        description,
        externalLink
      });

      res.json(photo);
    } catch (error) {
      console.error('Erro ao atualizar foto:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.delete('/api/photos/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePhoto(id);
      res.json({ message: 'Foto removida com sucesso' });
    } catch (error) {
      console.error('Erro ao remover foto:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Gallery routes (public)
  app.get('/api/gallery', async (req, res) => {
    try {
      const galleries = await storage.getAllCategoriesWithPhotos();
      res.json(galleries);
    } catch (error) {
      console.error('Erro ao buscar galerias:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Rota para servir arquivos estáticos
  app.use('/uploads', express.static('uploads'));

  const httpServer = createServer(app);
  return httpServer;
}
