import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import AlertBanner from '@/components/dashboard/AlertBanner';
import StatCards from '@/components/dashboard/StatCards';
import SalesChart from '@/components/dashboard/SalesChart';
import InventoryChart from '@/components/dashboard/InventoryChart';
import ExpiryAlerts from '@/components/dashboard/ExpiryAlerts';
import LowStockAlerts from '@/components/dashboard/LowStockAlerts';
import QuickActions from '@/components/dashboard/QuickActions';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAlert, setShowAlert] = useState(true);
  const [alertMessage, setAlertMessage] = useState('You have medications expiring soon and items with low stock.');
  const [alertCount, setAlertCount] = useState(7);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

  useEffect(() => {
    // Set page title on component mount
    document.title = 'Dashboard - PharmaTrack';

    // Add global click event listener to close sidebars/menus when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      // Add logic to close your menus here
    };
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="container mx-auto"
          >
            {/* Alerts */}
            {showAlert && (
              <div className="mb-4">
                <AlertBanner 
                  message={alertMessage} 
                  count={alertCount}
                  onClose={() => setShowAlert(false)}
                />
              </div>
            )}
            
            {/* Stats Overview */}
            <div className="mb-6">
              <StatCards />
            </div>
            
            {/* Charts & Alerts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <SalesChart />
              </div>
              <div className="lg:col-span-1">
                <InventoryChart />
              </div>
            </div>
            
            {/* Alerts & Actions Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ExpiryAlerts />
              </div>
              <div className="lg:col-span-1">
                <LowStockAlerts />
              </div>
              <div className="lg:col-span-1">
                <QuickActions />
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;