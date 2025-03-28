import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, PlusCircle, RefreshCw, Users } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Customers = () => {
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
            <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
            <p className="text-gray-600 mt-1">Manage your customers and track their purchase history</p>
          </div>
          
          {/* Tabs and Content */}
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="all">All Customers</TabsTrigger>
                <TabsTrigger value="regular">Regular Customers</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Add Customer
                </button>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="mb-6 flex">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text"
                  placeholder="Search by name, phone, or email..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-primary focus:border-primary"
                />
              </div>
              <button className="ml-2 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
            
            <TabsContent value="all">
              <div className="bg-white shadow-md rounded-lg p-6 text-center">
                <div className="py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No Customers Added Yet</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Add customers to manage their details and track their purchase history.
                  </p>
                  <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add New Customer
                  </button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="regular">
              <div className="bg-white shadow-md rounded-lg p-6 text-center">
                <div className="py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No Regular Customers Yet</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Regular customers with recurring medicine refills or ongoing courses will appear here.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.main>
      </div>
    </div>
  );
};

export default Customers;