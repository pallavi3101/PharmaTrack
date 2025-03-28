import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Plus, Filter, ArrowUpDown, Download, Upload,
  Package, AlertTriangle, RefreshCw, MoreVertical
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dummy inventory data
const inventoryItems = [
  { 
    id: 1, 
    name: 'Paracetamol 500mg', 
    category: 'Analgesics',
    batchNo: 'B12345',
    expiryDate: '12/2026',
    stock: 150,
    reorderLevel: 30,
    price: 25,
    manufacturer: 'Cipla',
    status: 'in-stock'
  },
  { 
    id: 2, 
    name: 'Cough Syrup 100ml', 
    category: 'Cough & Cold',
    batchNo: 'B98765',
    expiryDate: '08/2025',
    stock: 42,
    reorderLevel: 20,
    price: 120,
    manufacturer: 'Sun Pharma',
    status: 'in-stock'
  },
  { 
    id: 3, 
    name: 'Amoxicillin 250mg', 
    category: 'Antibiotics',
    batchNo: 'B56789',
    expiryDate: '06/2027',
    stock: 85,
    reorderLevel: 25,
    price: 75,
    manufacturer: 'Pfizer',
    status: 'in-stock'
  },
  { 
    id: 4, 
    name: 'Cetrizine 10mg', 
    category: 'Antihistamines',
    batchNo: 'B23456',
    expiryDate: '03/2026',
    stock: 15,
    reorderLevel: 20,
    price: 35,
    manufacturer: 'Cipla',
    status: 'low-stock'
  },
  { 
    id: 5, 
    name: 'Vitamin C 500mg', 
    category: 'Vitamins',
    batchNo: 'B34567',
    expiryDate: '11/2025',
    stock: 0,
    reorderLevel: 15,
    price: 150,
    manufacturer: 'Abbott',
    status: 'out-of-stock'
  },
  { 
    id: 6, 
    name: 'Aspirin 100mg', 
    category: 'Analgesics',
    batchNo: 'B45678',
    expiryDate: '05/2026',
    stock: 28,
    reorderLevel: 30,
    price: 18,
    manufacturer: 'GSK',
    status: 'low-stock'
  },
  { 
    id: 7, 
    name: 'Ibuprofen 400mg', 
    category: 'Analgesics',
    batchNo: 'B67890',
    expiryDate: '04/2025',
    stock: 5,
    reorderLevel: 25,
    price: 40,
    manufacturer: 'Sun Pharma',
    status: 'low-stock'
  },
  { 
    id: 8, 
    name: 'Multivitamin Tablets', 
    category: 'Vitamins',
    batchNo: 'B78901',
    expiryDate: '02/2026',
    stock: 65,
    reorderLevel: 20,
    price: 220,
    manufacturer: 'Himalaya',
    status: 'in-stock'
  },
];

// Categories dummy data
const categories = [
  'All',
  'Analgesics',
  'Antibiotics',
  'Antihistamines',
  'Cough & Cold',
  'Vitamins',
];

const Inventory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('all');

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

  // Filter items based on search query, category and status
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.batchNo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'low-stock' && item.status === 'low-stock') ||
      (filterStatus === 'out-of-stock' && item.status === 'out-of-stock') ||
      (filterStatus === 'in-stock' && item.status === 'in-stock');
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    let valueA = a[sortBy as keyof typeof a];
    let valueB = b[sortBy as keyof typeof b];
    
    // Convert to string for consistent comparison
    valueA = valueA?.toString().toLowerCase();
    valueB = valueB?.toString().toLowerCase();
    
    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
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
            <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
            <p className="text-gray-600 mt-1">Manage your pharmacy inventory and stock levels</p>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="products" className="w-full mb-6">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="batches">Batches</TabsTrigger>
              <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products" className="pt-4">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input 
                    type="text"
                    placeholder="Search by name, batch, manufacturer..."
                    className="pl-10 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center">
                        <Filter className="h-4 w-4 mr-2" />
                        <span>Category: {selectedCategory}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {categories.map((category) => (
                        <DropdownMenuItem 
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={selectedCategory === category ? 'bg-primary/10' : ''}
                        >
                          {category}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        <span>Sort</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleSort('name')}>
                        Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort('price')}>
                        Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort('stock')}>
                        Stock {sortBy === 'stock' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort('expiryDate')}>
                        Expiry Date {sortBy === 'expiryDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center">
                        <Package className="h-4 w-4 mr-2" />
                        <span>Status</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setFilterStatus('all')}
                        className={filterStatus === 'all' ? 'bg-primary/10' : ''}
                      >
                        All
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setFilterStatus('in-stock')}
                        className={filterStatus === 'in-stock' ? 'bg-primary/10' : ''}
                      >
                        In Stock
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setFilterStatus('low-stock')}
                        className={filterStatus === 'low-stock' ? 'bg-primary/10' : ''}
                      >
                        Low Stock
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setFilterStatus('out-of-stock')}
                        className={filterStatus === 'out-of-stock' ? 'bg-primary/10' : ''}
                      >
                        Out of Stock
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button variant="outline" className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    <span>Reset</span>
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-sm text-gray-500">Showing {sortedItems.length} of {inventoryItems.length} items</span>
                </div>
                <div className="flex gap-2">
                  <Button className="flex items-center">
                    <Plus className="h-4 w-4 mr-1" />
                    <span>Add Product</span>
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <Upload className="h-4 w-4 mr-1" />
                    <span>Import</span>
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <Download className="h-4 w-4 mr-1" />
                    <span>Export</span>
                  </Button>
                </div>
              </div>
              
              {/* Inventory Table */}
              <div className="bg-white shadow-md rounded-lg overflow-hidden border">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center">
                            <span>Product Name</span>
                            {sortBy === 'name' && <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('category')}
                        >
                          <div className="flex items-center">
                            <span>Category</span>
                            {sortBy === 'category' && <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('batchNo')}
                        >
                          <div className="flex items-center">
                            <span>Batch No</span>
                            {sortBy === 'batchNo' && <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('expiryDate')}
                        >
                          <div className="flex items-center">
                            <span>Expiry Date</span>
                            {sortBy === 'expiryDate' && <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('stock')}
                        >
                          <div className="flex items-center">
                            <span>Stock</span>
                            {sortBy === 'stock' && <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('price')}
                        >
                          <div className="flex items-center">
                            <span>Price</span>
                            {sortBy === 'price' && <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.manufacturer}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.batchNo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.expiryDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm">{item.stock}</span>
                              {item.stock < item.reorderLevel && (
                                <AlertTriangle className="h-4 w-4 text-amber-500 ml-2" />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{item.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              className={`
                                ${item.status === 'in-stock' ? 'bg-green-500' : ''}
                                ${item.status === 'low-stock' ? 'bg-amber-500' : ''}
                                ${item.status === 'out-of-stock' ? 'bg-red-500' : ''}
                              `}
                            >
                              {item.status === 'in-stock' && 'In Stock'}
                              {item.status === 'low-stock' && 'Low Stock'}
                              {item.status === 'out-of-stock' && 'Out of Stock'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Product</DropdownMenuItem>
                                <DropdownMenuItem>Adjust Stock</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500">
                                  Delete Product
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {sortedItems.length === 0 && (
                  <div className="text-center py-6">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search or filter to find what you're looking for.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg shadow">
                <div className="flex flex-1 justify-between sm:hidden">
                  <Button variant="outline">Previous</Button>
                  <Button variant="outline">Next</Button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                      <span className="font-medium">{inventoryItems.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <Button variant="outline" className="rounded-l-md">
                        Previous
                      </Button>
                      <Button variant="outline" className="bg-primary text-white">
                        1
                      </Button>
                      <Button variant="outline">
                        2
                      </Button>
                      <Button variant="outline" className="rounded-r-md">
                        Next
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="batches" className="pt-4">
              <div className="bg-white shadow-md rounded-lg p-8 text-center">
                <h2 className="text-xl font-semibold mb-2">Batch Management</h2>
                <p className="text-gray-500 mb-4">Track and manage your product batches by batch number, manufacturing date, and expiry.</p>
                <Button>View Batches</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="expiring" className="pt-4">
              <div className="bg-white shadow-md rounded-lg p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Expiring Products</h2>
                <p className="text-gray-500 mb-4">Monitor products that are nearing their expiry date. Set up alerts and manage soon-to-expire inventory.</p>
                <Button>View Expiring Products</Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.main>
      </div>
    </div>
  );
};

export default Inventory;