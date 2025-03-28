import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, LineChart, PieChart, Download } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

const Reports = () => {
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

  const reportCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const reports = [
    {
      id: 'sales',
      title: 'Sales Report',
      description: 'View sales trends, revenue, and best-selling products',
      icon: <LineChart className="h-10 w-10 text-blue-500" />,
      color: 'bg-blue-50 border-blue-200',
      path: '/reports/sales'
    },
    {
      id: 'purchase',
      title: 'Purchase Report',
      description: 'Track purchases, suppliers, and inventory costs',
      icon: <BarChart3 className="h-10 w-10 text-green-500" />,
      color: 'bg-green-50 border-green-200',
      path: '/reports/purchases'
    },
    {
      id: 'profit',
      title: 'Profit Report',
      description: 'Analyze profit margins and revenue growth',
      icon: <PieChart className="h-10 w-10 text-purple-500" />,
      color: 'bg-purple-50 border-purple-200',
      path: '/reports/profits'
    }
  ];

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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Monitor your pharmacy's performance and make data-driven decisions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                className={`border rounded-lg shadow-sm overflow-hidden ${report.color}`}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={reportCardVariants}
              >
                <div className="p-6">
                  <div className="mb-4">
                    {report.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{report.title}</h3>
                  <p className="text-gray-600 mb-4">{report.description}</p>
                  <div className="flex justify-between items-center">
                    <button className="text-primary hover:underline text-sm font-medium">
                      View Report
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <Download className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>
                <div className="h-32 bg-white p-4 border-t">
                  {/* Placeholder for chart preview */}
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span>Chart preview will appear here</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-800">Quick Report Generation</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Date Range Report</h4>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input 
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input 
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="sales">Sales Report</option>
                      <option value="purchases">Purchase Report</option>
                      <option value="profit">Profit Report</option>
                    </select>
                  </div>
                  <button className="mt-2 w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                    Generate Report
                  </button>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Predefined Reports</h4>
                <div className="space-y-3">
                  <button className="w-full flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 transition-colors">
                    <span className="font-medium">Today's Sales Summary</span>
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="w-full flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 transition-colors">
                    <span className="font-medium">This Week's Performance</span>
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="w-full flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 transition-colors">
                    <span className="font-medium">Monthly Revenue Report</span>
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="w-full flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 transition-colors">
                    <span className="font-medium">Top Selling Products</span>
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default Reports;