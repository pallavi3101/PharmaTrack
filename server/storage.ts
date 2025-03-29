import { 
  users, 
  products, 
  sales, 
  customers, 
  type User, 
  type InsertUser,
  type Product,
  type InsertProduct,
  type Sale,
  type InsertSale,
  type Customer,
  type InsertCustomer
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, asc, sql, SQL } from "drizzle-orm";
import { PgColumn } from 'drizzle-orm/pg-core';

// Interface with all CRUD methods we need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(filters?: { 
    category?: string; 
    search?: string; 
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  addProduct(product: InsertProduct): Promise<Product>;
  updateProductStock(id: number, newQuantity: number): Promise<Product | undefined>;
  
  // Sale methods
  getSales(dateRange?: { startDate: string; endDate: string }): Promise<Sale[]>;
  addSale(sale: InsertSale): Promise<Sale>;
  
  // Customer methods
  getCustomers(): Promise<Customer[]>;
  getCustomerById(id: number): Promise<Customer | undefined>;
  addCustomer(customer: InsertCustomer): Promise<Customer>;
  
  // Specific reporting methods
  getLowStockProducts(threshold?: number): Promise<Product[]>;
  getExpiringProducts(daysThreshold?: number): Promise<Product[]>;
  getMonthlySalesData(): Promise<{ month: number; total_amount: number }[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results.length > 0 ? results[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return result[0];
  }
  
  // Product methods
  async getProducts(filters?: { 
    category?: string; 
    search?: string; 
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Product[]> {
    let conditions: SQL[] = [];
    
    // Apply filters if provided
    if (filters) {
      // Category filter
      if (filters.category && filters.category !== 'All') {
        conditions.push(eq(products.category, filters.category));
      }
      
      // Search filter
      if (filters.search && filters.search.length > 0) {
        conditions.push(sql`(${products.name} ILIKE ${'%' + filters.search + '%'} OR 
             ${products.manufacturer} ILIKE ${'%' + filters.search + '%'} OR
             ${products.batchNumber} ILIKE ${'%' + filters.search + '%'})`);
      }
      
      // Status filter
      if (filters.status) {
        if (filters.status === 'in-stock') {
          conditions.push(sql`${products.quantity} > 0`);
          conditions.push(sql`${products.quantity} > ${products.threshold}`);
        } else if (filters.status === 'low-stock') {
          conditions.push(sql`${products.quantity} > 0`);
          conditions.push(sql`${products.quantity} <= ${products.threshold}`);
        } else if (filters.status === 'out-of-stock') {
          conditions.push(eq(products.quantity, 0));
        }
      }
    }
    
    let query = db.select().from(products);
    
    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply sorting if specified
    if (filters?.sortBy) {
      const column = filters.sortBy as keyof typeof products;
      if (column in products) {
        const columnRef = products[column] as PgColumn<any>;
        if (filters.sortOrder === 'desc') {
          query = query.orderBy(desc(columnRef));
        } else {
          query = query.orderBy(asc(columnRef));
        }
      }
    }
    
    return await query;
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    const results = await db.select().from(products).where(eq(products.id, id));
    return results.length > 0 ? results[0] : undefined;
  }
  
  async addProduct(product: InsertProduct): Promise<Product> {
    const result = await db
      .insert(products)
      .values(product)
      .returning();
    return result[0];
  }
  
  async updateProductStock(id: number, newQuantity: number): Promise<Product | undefined> {
    const result = await db
      .update(products)
      .set({ quantity: newQuantity })
      .where(eq(products.id, id))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }
  
  // Sale methods
  async getSales(dateRange?: { startDate: string; endDate: string }): Promise<Sale[]> {
    let query = db.select().from(sales);
    
    if (dateRange) {
      query = query.where(
        and(
          sql`${sales.saleDate} >= ${dateRange.startDate}`,
          sql`${sales.saleDate} <= ${dateRange.endDate}`
        )
      );
    }
    
    return await query;
  }
  
  async addSale(sale: InsertSale): Promise<Sale> {
    const result = await db
      .insert(sales)
      .values(sale)
      .returning();
    return result[0];
  }
  
  // Customer methods
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers);
  }
  
  async getCustomerById(id: number): Promise<Customer | undefined> {
    const results = await db.select().from(customers).where(eq(customers.id, id));
    return results.length > 0 ? results[0] : undefined;
  }
  
  async addCustomer(customer: InsertCustomer): Promise<Customer> {
    const result = await db
      .insert(customers)
      .values(customer)
      .returning();
    return result[0];
  }
  
  // Reporting methods
  async getLowStockProducts(threshold?: number): Promise<Product[]> {
    let query;
    
    if (threshold !== undefined) {
      query = db.select().from(products).where(sql`${products.quantity} <= ${threshold}`);
    } else {
      query = db.select().from(products).where(sql`${products.quantity} <= ${products.threshold}`);
    }
    
    return await query;
  }
  
  async getExpiringProducts(daysThreshold: number = 60): Promise<Product[]> {
    // Calculate the date threshold (today + daysThreshold)
    const today = new Date().toISOString().split('T')[0];
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    const thresholdDateStr = thresholdDate.toISOString().split('T')[0];
    
    return await db
      .select()
      .from(products)
      .where(
        and(
          sql`${products.expiryDate} IS NOT NULL`,
          sql`${products.expiryDate} <= ${thresholdDateStr}`,
          sql`${products.expiryDate} >= ${today}`
        )
      );
  }
  
  async getMonthlySalesData(): Promise<{ month: number; total_amount: number }[]> {
    // Get the current year
    const currentYear = new Date().getFullYear();
    
    // This PostgreSQL query extracts the month from the sale date and sums the total amounts for each month
    const results = await db
      .select({
        month: sql<number>`EXTRACT(MONTH FROM ${sales.saleDate})::integer`,
        total_amount: sql<number>`SUM(${sales.totalAmount})`
      })
      .from(sales)
      .where(sql`EXTRACT(YEAR FROM ${sales.saleDate}) = ${currentYear}`)
      .groupBy(sql`EXTRACT(MONTH FROM ${sales.saleDate})`)
      .orderBy(sql`EXTRACT(MONTH FROM ${sales.saleDate})`);
    
    return results.map(row => ({
      month: row.month,
      total_amount: Number(row.total_amount) || 0
    }));
  }
}

export const storage = new DatabaseStorage();
