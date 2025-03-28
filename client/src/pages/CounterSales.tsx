import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, ShoppingCart } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

const CounterSales = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const pageVariants = {
    initial: { opacity: 0 },
    in: { 
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    out: { 
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <motion.main 
          className="flex-1 overflow-y-auto p-4 md:p-6"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Counter & Sales</h1>
            <p className="text-gray-600 mt-1">Manage sales counters and process customer purchases</p>
          </div>
          
          {/* Counter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {/* Sample Counters */}
            {[...Array(8)].map((_, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">Counter {index + 1}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Closed
                    </span>
                  </div>
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="h-8 w-8 text-gray-400" />
                    </div>
                    <button className="w-full mt-4 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                      Open Counter
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add Counter Button */}
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <PlusCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-gray-700">Add Counter</h3>
                <p className="text-sm text-gray-500 mt-1">Create a new sales counter</p>
              </div>
            </div>
          </div>
          
          {/* Recent Transactions */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-800">Recent Transactions</h3>
              <button className="text-primary hover:underline text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">No Recent Transactions</h3>
              <p className="text-gray-500 mt-2">
                Open a counter and process sales to see transaction history
              </p>
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default CounterSales;