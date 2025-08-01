import { storage } from './storage';

async function initializeDatabase() {
  try {
    // Create default admin user
    const existingAdmin = await storage.getUserByUsername('admin');
    
    if (!existingAdmin) {
      const admin = await storage.createUser({
        username: 'admin',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin padrão criado:', { id: admin.id, username: admin.username, role: admin.role });
    } else {
      console.log('Admin já existe:', { id: existingAdmin.id, username: existingAdmin.username, role: existingAdmin.role });
    }
  } catch (error) {
    console.error('Erro ao inicializar banco:', error);
  }
}

initializeDatabase();