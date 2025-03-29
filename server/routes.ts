import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertSaleSchema, insertCustomerSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handler helper
  const handleError = (res: Response, error: unknown) => {
    console.error("API Error:", error);
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation Error",
        details: error.errors
      });
    }
    return res.status(500).json({
      error: "Server Error",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  };

  // API Routes
  
  // PRODUCT ROUTES
  
  // Get all products with optional filters
  app.get('/api/products', async (req, res) => {
    try {
      const filters = {
        category: req.query.category as string | undefined,
        search: req.query.search as string | undefined,
        status: req.query.status as string | undefined,
        sortBy: req.query.sortBy as string | undefined,
        sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined
      };
      
      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Get a single product
  app.get('/api/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Add a new product
  app.post('/api/products', async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const newProduct = await storage.addProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Update product stock
  app.patch('/api/products/:id/stock', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (isNaN(id) || typeof quantity !== 'number') {
        return res.status(400).json({ error: "Invalid parameters" });
      }
      
      const updatedProduct = await storage.updateProductStock(id, quantity);
      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // SALE ROUTES
  
  // Get all sales with optional date range
  app.get('/api/sales', async (req, res) => {
    try {
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;
      
      const dateRange = startDate && endDate ? { startDate, endDate } : undefined;
      const sales = await storage.getSales(dateRange);
      
      res.json(sales);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Add a new sale
  app.post('/api/sales', async (req, res) => {
    try {
      const saleData = insertSaleSchema.parse(req.body);
      const newSale = await storage.addSale(saleData);
      res.status(201).json(newSale);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // CUSTOMER ROUTES
  
  // Get all customers
  app.get('/api/customers', async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Get a single customer
  app.get('/api/customers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid customer ID" });
      }
      
      const customer = await storage.getCustomerById(id);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      res.json(customer);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Add a new customer
  app.post('/api/customers', async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const newCustomer = await storage.addCustomer(customerData);
      res.status(201).json(newCustomer);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // REPORTING ROUTES
  
  // Expiry alerts API
  app.get('/api/expiry_alerts', async (req, res) => {
    try {
      // Get days threshold from query params or use default (60)
      const daysThreshold = req.query.days ? parseInt(req.query.days as string) : 60;
      
      const expiringProducts = await storage.getExpiringProducts(daysThreshold);
      
      // Map to expected format
      const expiryItems = expiringProducts.map(product => ({
        name: product.name,
        expiry_date: product.expiryDate ? new Date(product.expiryDate).toISOString().split('T')[0] : 'Unknown',
        quantity: product.quantity
      }));
      
      res.json(expiryItems);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Low stock alerts API
  app.get('/api/low_stock', async (req, res) => {
    try {
      const lowStockProducts = await storage.getLowStockProducts();
      
      // Map to expected format
      const lowStockItems = lowStockProducts.map(product => ({
        name: product.name,
        quantity: product.quantity,
        threshold: product.threshold
      }));
      
      res.json(lowStockItems);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Monthly sales data for reports and dashboard
  app.get('/api/monthly_sales', async (req, res) => {
    try {
      const monthlySalesData = await storage.getMonthlySalesData();
      res.json(monthlySalesData);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Sales trend analysis and prediction
  app.get('/api/sales_prediction', async (req, res) => {
    try {
      // Get monthly sales data
      const monthlySalesData = await storage.getMonthlySalesData();
      
      // Perform a simple prediction (in a real app, this would use the ML model)
      // Here we're just calculating an average growth rate for demonstration
      if (monthlySalesData.length < 2) {
        return res.json({
          prediction: 0,
          explanation: "Not enough historical data for prediction"
        });
      }
      
      // Calculate average month-over-month growth
      let totalGrowth = 0;
      let growthCount = 0;
      
      for (let i = 1; i < monthlySalesData.length; i++) {
        const currentMonth = monthlySalesData[i].total_amount;
        const prevMonth = monthlySalesData[i-1].total_amount;
        
        if (prevMonth > 0) {
          totalGrowth += (currentMonth - prevMonth) / prevMonth;
          growthCount++;
        }
      }
      
      const avgGrowthRate = growthCount > 0 ? totalGrowth / growthCount : 0;
      const lastMonthSales = monthlySalesData[monthlySalesData.length - 1].total_amount;
      const prediction = lastMonthSales * (1 + avgGrowthRate);
      
      res.json({
        prediction: Math.round(prediction),
        explanation: `Based on historical data, a growth rate of ${(avgGrowthRate * 100).toFixed(2)}% is predicted for the next month, estimating sales of approximately ${Math.round(prediction)}.`
      });
    } catch (error) {
      handleError(res, error);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
