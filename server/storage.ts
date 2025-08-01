import { 
  users, 
  categories, 
  photos, 
  type User, 
  type InsertUser, 
  type Category, 
  type InsertCategory, 
  type Photo, 
  type InsertPhoto 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: number): Promise<void>;
  
  // Photo operations
  getPhotos(): Promise<Photo[]>;
  getPhotosByCategory(categoryId: number): Promise<Photo[]>;
  getRecentPhotosByCategory(categoryId: number, limit?: number): Promise<Photo[]>;
  getPhotoById(id: number): Promise<Photo | undefined>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  updatePhoto(id: number, updates: Partial<InsertPhoto>): Promise<Photo>;
  deletePhoto(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category> {
    const [updatedCategory] = await db
      .update(categories)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Photo operations
  async getPhotos(): Promise<Photo[]> {
    return await db.select().from(photos).orderBy(desc(photos.createdAt));
  }

  async getPhotosByCategory(categoryId: number): Promise<Photo[]> {
    return await db
      .select()
      .from(photos)
      .where(eq(photos.categoryId, categoryId))
      .orderBy(desc(photos.createdAt));
  }

  async getRecentPhotosByCategory(categoryId: number, limit: number = 8): Promise<Photo[]> {
    return await db
      .select()
      .from(photos)
      .where(eq(photos.categoryId, categoryId))
      .orderBy(desc(photos.createdAt))
      .limit(limit);
  }

  async getPhotoById(id: number): Promise<Photo | undefined> {
    const [photo] = await db.select().from(photos).where(eq(photos.id, id));
    return photo || undefined;
  }

  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const [newPhoto] = await db
      .insert(photos)
      .values(photo)
      .returning();
    return newPhoto;
  }

  async updatePhoto(id: number, updates: Partial<InsertPhoto>): Promise<Photo> {
    const [updatedPhoto] = await db
      .update(photos)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(photos.id, id))
      .returning();
    return updatedPhoto;
  }

  async deletePhoto(id: number): Promise<void> {
    await db.delete(photos).where(eq(photos.id, id));
  }
}

export const storage = new DatabaseStorage();
