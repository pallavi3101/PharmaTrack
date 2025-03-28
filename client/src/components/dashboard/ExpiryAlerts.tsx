import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, isWithinInterval, addDays } from 'date-fns';
import { CalendarClock, AlertCircle } from 'lucide-react';

interface ExpiryItem {
  name: string;
  expiry_date: string;
  quantity: number;
}

const ExpiryAlerts = () => {
  const [expiryItems, setExpiryItems] = useState<ExpiryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call to fetch expiry items
    setTimeout(() => {
      const mockItems: ExpiryItem[] = [
        {
          name: 'Amoxicillin 500mg',
          expiry_date: '2025-04-15',
          quantity: 32
        },
        {
          name: 'Ibuprofen 200mg',
          expiry_date: '2025-04-03',
          quantity: 45
        },
        {
          name: 'Paracetamol Syrup',
          expiry_date: '2025-04-21',
          quantity: 18
        },
        {
          name: 'Cetirizine 10mg',
          expiry_date: '2025-04-10',
          quantity: 24
        },
        {
          name: 'Vitamin C 1000mg',
          expiry_date: '2025-05-07',
          quantity: 56
        }
      ];
      
      setExpiryItems(mockItems);
      setLoading(false);
    }, 800);
  }, []);

  const getExpiryStatus = (expiryDateStr: string) => {
    const today = new Date();
    const expiryDate = new Date(expiryDateStr);
    
    // Within 7 days
    if (isWithinInterval(expiryDate, { start: today, end: addDays(today, 7) })) {
      return 'critical';
    }
    // Within 30 days
    if (isWithinInterval(expiryDate, { start: today, end: addDays(today, 30) })) {
      return 'warning';
    }
    // More than 30 days
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-amber-600 bg-amber-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM d, yyyy');
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-5 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <CalendarClock className="h-5 w-5 text-amber-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Expiring Items</h3>
        </div>
        <div className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800">
          {expiryItems.length} items
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-[240px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
          {expiryItems.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No expiring items found</p>
            </div>
          ) : (
            expiryItems.map((item, index) => {
              const status = getExpiryStatus(item.expiry_date);
              const statusColor = getStatusColor(status);
              
              return (
                <motion.div 
                  key={index}
                  className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColor}`}>
                          Expires: {formatDate(item.expiry_date)}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}
      
      {!loading && expiryItems.length > 0 && (
        <div className="mt-4 pt-2 border-t border-gray-100 text-center">
          <button className="text-sm text-primary hover:underline font-medium">
            View all expiring items
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ExpiryAlerts;