import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  
  // Expiry alerts API
  app.get('/api/expiry_alerts', (req, res) => {
    // Mock data for expiry alerts
    const expiryItems = [
      { name: 'Paracetamol 500mg', expiry_date: '2023-08-15', quantity: 120 },
      { name: 'Amoxicillin 250mg', expiry_date: '2023-08-22', quantity: 45 },
      { name: 'Ibuprofen 400mg', expiry_date: '2023-08-30', quantity: 60 }
    ];
    
    res.json(expiryItems);
  });
  
  // Low stock alerts API
  app.get('/api/low_stock', (req, res) => {
    // Mock data for low stock alerts
    const lowStockItems = [
      { name: 'Aspirin 100mg', quantity: 15, threshold: 25 },
      { name: 'Metformin 500mg', quantity: 8, threshold: 20 },
      { name: 'Atorvastatin 10mg', quantity: 5, threshold: 15 },
      { name: 'Omeprazole 20mg', quantity: 3, threshold: 12 },
      { name: 'Cetirizine 10mg', quantity: 4, threshold: 10 }
    ];
    
    res.json(lowStockItems);
  });

  const httpServer = createServer(app);

  return httpServer;
}
