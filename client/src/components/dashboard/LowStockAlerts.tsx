import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertCircle } from 'lucide-react';

interface LowStockItem {
  name: string;
  quantity: number;
  threshold: number;
}

const LowStockAlerts = () => {
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call to fetch low stock items
    setTimeout(() => {
      const mockItems: LowStockItem[] = [
        {
          name: 'Metformin 500mg',
          quantity: 8,
          threshold: 20
        },
        {
          name: 'Loratadine 10mg',
          quantity: 5,
          threshold: 15
        },
        {
          name: 'Omeprazole 20mg',
          quantity: 12,
          threshold: 25
        },
        {
          name: 'Vitamin D3 2000IU',
          quantity: 3,
          threshold: 10
        },
        {
          name: 'Ferrous Sulfate 325mg',
          quantity: 7,
          threshold: 20
        }
      ];
      
      setLowStockItems(mockItems);
      setLoading(false);
    }, 1000);
  }, []);

  const getStockLevel = (quantity: number, threshold: number) => {
    const ratio = quantity / threshold;
    
    if (ratio <= 0.2) return 'critical';
    if (ratio <= 0.5) return 'warning';
    return 'normal';
  };

  const getProgressColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-amber-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-5 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Package className="h-5 w-5 text-amber-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Low Stock Items</h3>
        </div>
        <div className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800">
          {lowStockItems.length} items
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-[240px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
          {lowStockItems.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No low stock items found</p>
            </div>
          ) : (
            lowStockItems.map((item, index) => {
              const level = getStockLevel(item.quantity, item.threshold);
              const progressColor = getProgressColor(level);
              const progressWidth = Math.max(5, (item.quantity / item.threshold) * 100);
              
              return (
                <motion.div 
                  key={index}
                  className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    <div className="text-xs font-medium text-gray-500">
                      {item.quantity} / {item.threshold}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${progressColor}`}
                      style={{ width: `${progressWidth}%` }}
                    ></div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}
      
      {!loading && lowStockItems.length > 0 && (
        <div className="mt-4 pt-2 border-t border-gray-100 text-center">
          <button className="text-sm text-primary hover:underline font-medium">
            Order inventory
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default LowStockAlerts;