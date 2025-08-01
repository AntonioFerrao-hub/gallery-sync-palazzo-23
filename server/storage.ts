import { 
  users, 
  categories, 
  photos,
  type User, 
  type InsertUser,
  type Category,
  type InsertCategory,
  type UpdateCategory,
  type Photo,
  type InsertPhoto,
  type UpdatePhoto
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(category: UpdateCategory): Promise<Category>;
  deleteCategory(id: number): Promise<void>;
  
  // Photo operations
  getPhotosByCategory(categoryId: number): Promise<Photo[]>;
  getAllPhotos(): Promise<Photo[]>;
  getPhotoById(id: number): Promise<Photo | undefined>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  updatePhoto(photo: UpdatePhoto): Promise<Photo>;
  deletePhoto(id: number): Promise<void>;
  
  // Gallery operations
  getCategoryWithPhotos(categoryId: number): Promise<{ category: Category; photos: Photo[] } | undefined>;
  getAllCategoriesWithPhotos(): Promise<{ category: Category; photos: Photo[] }[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(desc(categories.createdAt));
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(category: UpdateCategory): Promise<Category> {
    const { id, ...updateData } = category;
    const [updatedCategory] = await db
      .update(categories)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<void> {
    // First delete all photos in this category
    await db.delete(photos).where(eq(photos.categoryId, id));
    // Then delete the category
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Photo operations
  async getPhotosByCategory(categoryId: number): Promise<Photo[]> {
    return await db.select().from(photos).where(eq(photos.categoryId, categoryId)).orderBy(desc(photos.createdAt));
  }

  async getAllPhotos(): Promise<Photo[]> {
    return await db.select().from(photos).orderBy(desc(photos.createdAt));
  }

  async getPhotoById(id: number): Promise<Photo | undefined> {
    const [photo] = await db.select().from(photos).where(eq(photos.id, id));
    return photo;
  }

  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const [newPhoto] = await db.insert(photos).values(photo).returning();
    return newPhoto;
  }

  async updatePhoto(photo: UpdatePhoto): Promise<Photo> {
    const { id, ...updateData } = photo;
    const [updatedPhoto] = await db
      .update(photos)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(photos.id, id))
      .returning();
    return updatedPhoto;
  }

  async deletePhoto(id: number): Promise<void> {
    await db.delete(photos).where(eq(photos.id, id));
  }

  // Gallery operations
  async getCategoryWithPhotos(categoryId: number): Promise<{ category: Category; photos: Photo[] } | undefined> {
    const category = await this.getCategoryById(categoryId);
    if (!category) return undefined;
    
    const categoryPhotos = await this.getPhotosByCategory(categoryId);
    return { category, photos: categoryPhotos };
  }

  async getAllCategoriesWithPhotos(): Promise<{ category: Category; photos: Photo[] }[]> {
    const allCategories = await this.getAllCategories();
    const result = [];
    
    for (const category of allCategories) {
      const categoryPhotos = await this.getPhotosByCategory(category.id);
      result.push({ category, photos: categoryPhotos });
    }
    
    return result;
  }
}

export const storage = new DatabaseStorage();
