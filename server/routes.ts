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
  // Categories routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.post('/api/categories', async (req, res) => {
    try {
      const { name, description } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Nome da categoria é obrigatório' });
      }
      
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const category = await storage.createCategory({ name, description, slug });
      res.json(category);
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.put('/api/categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { name, description } = req.body;
      
      let updates: any = { name, description };
      if (name) {
        updates.slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      
      const category = await storage.updateCategory(id, updates);
      res.json(category);
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.delete('/api/categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCategory(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Photos routes
  app.get('/api/photos', async (req, res) => {
    try {
      const photos = await storage.getPhotos();
      res.json(photos);
    } catch (error) {
      console.error('Erro ao buscar fotos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.get('/api/photos/category/:categoryId', async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const photos = await storage.getPhotosByCategory(categoryId);
      res.json(photos);
    } catch (error) {
      console.error('Erro ao buscar fotos da categoria:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.get('/api/photos/category/:categoryId/recent', async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const limit = parseInt(req.query.limit as string) || 8;
      const photos = await storage.getRecentPhotosByCategory(categoryId, limit);
      res.json(photos);
    } catch (error) {
      console.error('Erro ao buscar fotos recentes:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Upload de fotos com limite de 1MB
  app.post('/api/photos/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      // Verificar tamanho do arquivo (1MB = 1024 * 1024 bytes)
      const maxSize = 1024 * 1024; // 1MB
      if (req.file.size > maxSize) {
        return res.status(400).json({ 
          error: 'Arquivo muito grande. O tamanho máximo é 1MB.',
          maxSize: '1MB',
          currentSize: `${(req.file.size / 1024 / 1024).toFixed(2)}MB`
        });
      }

      // Verificar se é uma imagem
      if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({ error: 'Apenas imagens são permitidas' });
      }

      const { title, description, categoryId, userId, externalLink } = req.body;
      
      if (!title || !categoryId) {
        return res.status(400).json({ error: 'Título e categoria são obrigatórios' });
      }

      // Usar ID 1 como usuário padrão se não fornecido ou inválido
      const validUserId = userId && !isNaN(parseInt(userId)) ? parseInt(userId) : 1;

      const photo = await storage.createPhoto({
        title,
        description: description || undefined,
        imageUrl: `/uploads/${req.file.filename}`,
        externalLink: externalLink || undefined,
        categoryId: parseInt(categoryId),
        uploadedBy: validUserId
      });

      res.json(photo);
    } catch (error) {
      console.error('Erro no upload:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.put('/api/photos/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { title, description, externalLink } = req.body;
      
      const photo = await storage.updatePhoto(id, { 
        title, 
        description: description || undefined, 
        externalLink: externalLink || undefined 
      });
      res.json(photo);
    } catch (error) {
      console.error('Erro ao atualizar foto:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.delete('/api/photos/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePhoto(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Erro ao deletar foto:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // User routes
  app.post('/api/users', async (req, res) => {
    try {
      const { username, password, role } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Username e password são obrigatórios' });
      }
      
      const user = await storage.createUser({ username, password, role: role || 'user' });
      res.json(user);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
      
      res.json({ user: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Rota para servir arquivos estáticos
  app.use('/uploads', express.static('uploads'));

  const httpServer = createServer(app);
  return httpServer;
}
