import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, PlusCircle, RefreshCw, Users, Filter, Download,
  Edit, Trash2, MoreVertical, Star, ShoppingCart, Pill,
  Phone, Mail, MapPin, ChevronDown, ChevronUp, Calendar
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Dummy customers data
const dummyCustomers = [
  {
    id: 1,
    name: 'Rahul Sharma',
    phone: '+91 9876543210',
    email: 'rahul.s@gmail.com',
    address: '42 Park Street, Mumbai',
    type: 'regular',
    lastVisit: '2024-03-18',
    totalVisits: 12,
    totalSpent: 18750,
    prescription: [
      { name: 'Metformin 500mg', frequency: 'Twice daily', duration: '3 months' },
      { name: 'Atorvastatin 10mg', frequency: 'Once daily', duration: 'Continuing' }
    ],
    lastPurchase: [
      { name: 'Metformin 500mg', quantity: 180, date: '2024-03-18' },
      { name: 'Atorvastatin 10mg', quantity: 30, date: '2024-03-18' },
      { name: 'Vitamin B Complex', quantity: 60, date: '2024-03-18' }
    ]
  },
  {
    id: 2,
    name: 'Priya Mehta',
    phone: '+91 8765432109',
    email: 'priya.m@yahoo.com',
    address: '17 Gandhi Road, Delhi',
    type: 'regular',
    lastVisit: '2024-03-20',
    totalVisits: 8,
    totalSpent: 12340,
    prescription: [
      { name: 'Levothyroxine 25mcg', frequency: 'Once daily', duration: 'Continuing' },
    ],
    lastPurchase: [
      { name: 'Levothyroxine 25mcg', quantity: 90, date: '2024-03-20' },
      { name: 'Calcium + Vitamin D3', quantity: 30, date: '2024-03-20' }
    ]
  },
  {
    id: 3,
    name: 'Arjun Patel',
    phone: '+91 7654321098',
    email: 'arjun.p@hotmail.com',
    address: '8 Sector 9, Ahmedabad',
    type: 'occasional',
    lastVisit: '2024-02-15',
    totalVisits: 3,
    totalSpent: 5680,
    prescription: [],
    lastPurchase: [
      { name: 'Paracetamol 500mg', quantity: 20, date: '2024-02-15' },
      { name: 'Cetirizine 10mg', quantity: 10, date: '2024-02-15' },
      { name: 'Cough Syrup', quantity: 1, date: '2024-02-15' }
    ]
  },
  {
    id: 4,
    name: 'Kavita Singh',
    phone: '+91 6543210987',
    email: 'kavita.s@gmail.com',
    address: '56 MG Road, Bangalore',
    type: 'regular',
    lastVisit: '2024-03-22',
    totalVisits: 15,
    totalSpent: 25400,
    prescription: [
      { name: 'Amlodipine 5mg', frequency: 'Once daily', duration: 'Continuing' },
      { name: 'Aspirin 75mg', frequency: 'Once daily', duration: 'Continuing' }
    ],
    lastPurchase: [
      { name: 'Amlodipine 5mg', quantity: 30, date: '2024-03-22' },
      { name: 'Aspirin 75mg', quantity: 30, date: '2024-03-22' }
    ]
  },
  {
    id: 5,
    name: 'Suresh Kumar',
    phone: '+91 5432109876',
    email: 'suresh.k@outlook.com',
    address: '23 Church Street, Chennai',
    type: 'occasional',
    lastVisit: '2024-01-30',
    totalVisits: 2,
    totalSpent: 1890,
    prescription: [],
    lastPurchase: [
      { name: 'Multivitamin', quantity: 60, date: '2024-01-30' }
    ]
  },
  {
    id: 6,
    name: 'Neha Gupta',
    phone: '+91 4321098765',
    email: 'neha.g@gmail.com',
    address: '12 Civil Lines, Jaipur',
    type: 'regular',
    lastVisit: '2024-03-15',
    totalVisits: 9,
    totalSpent: 14680,
    prescription: [
      { name: 'Pantoprazole 40mg', frequency: 'Once daily', duration: '1 month' }
    ],
    lastPurchase: [
      { name: 'Pantoprazole 40mg', quantity: 30, date: '2024-03-15' },
      { name: 'Antacid Syrup', quantity: 1, date: '2024-03-15' }
    ]
  }
];

const Customers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customers, setCustomers] = useState(dummyCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Form state for new customer
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  
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
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredCustomers = customers.filter(customer => {
    const query = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.address.toLowerCase().includes(query)
    );
  });
  
  const regularCustomers = filteredCustomers.filter(customer => customer.type === 'regular');
  
  const handleViewDetails = (customer: any) => {
    setSelectedCustomer(customer);
  };
  
  const handleCloseDetails = () => {
    setSelectedCustomer(null);
  };
  
  const handleAddCustomer = () => {
    // Form validation would go here
    const newId = Math.max(...customers.map(c => c.id)) + 1;
    
    const customerToAdd = {
      id: newId,
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email,
      address: newCustomer.address,
      type: 'occasional',
      lastVisit: new Date().toISOString().split('T')[0],
      totalVisits: 1,
      totalSpent: 0,
      prescription: [],
      lastPurchase: []
    };
    
    setCustomers([...customers, customerToAdd]);
    setShowAddDialog(false);
    
    // Reset form
    setNewCustomer({
      name: '',
      phone: '',
      email: '',
      address: ''
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer({
      ...newCustomer,
      [name]: value
    });
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
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center">
                      <PlusCircle className="h-5 w-5 mr-2" />
                      Add Customer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Customer</DialogTitle>
                      <DialogDescription>
                        Enter customer details below to add them to your system.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="name" className="text-right font-medium col-span-1">
                          Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={newCustomer.name}
                          onChange={handleInputChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="phone" className="text-right font-medium col-span-1">
                          Phone
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          value={newCustomer.phone}
                          onChange={handleInputChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="email" className="text-right font-medium col-span-1">
                          Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={newCustomer.email}
                          onChange={handleInputChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="address" className="text-right font-medium col-span-1">
                          Address
                        </label>
                        <Input
                          id="address"
                          name="address"
                          value={newCustomer.address}
                          onChange={handleInputChange}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                      <Button 
                        onClick={handleAddCustomer}
                        disabled={!newCustomer.name || !newCustomer.phone}
                      >
                        Add Customer
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" className="flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            
            {/* Search and Filter Bar */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input 
                  type="text"
                  placeholder="Search by name, phone, or email..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <span>Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Last Visit Date</DropdownMenuItem>
                    <DropdownMenuItem>Total Visits</DropdownMenuItem>
                    <DropdownMenuItem>Total Spent</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button variant="outline" className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  <span>Reset</span>
                </Button>
              </div>
            </div>
            
            {/* Customer List */}
            <TabsContent value="all">
              {filteredCustomers.length > 0 ? (
                <div className="rounded-lg overflow-hidden bg-white shadow-md">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact Info
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Visit
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Spent
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCustomers.map((customer) => (
                          <tr key={customer.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                                  <span className="text-gray-600 font-medium">
                                    {customer.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                  <div className="text-sm text-gray-500 truncate max-w-[200px]">{customer.address}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{customer.phone}</div>
                              <div className="text-sm text-gray-500">{customer.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{customer.lastVisit}</div>
                              <div className="text-sm text-gray-500">{customer.totalVisits} visits total</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge
                                className={
                                  customer.type === 'regular'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }
                              >
                                {customer.type === 'regular' ? 'Regular' : 'Occasional'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{customer.totalSpent.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="flex items-center" 
                                  onClick={() => handleViewDetails(customer)}
                                >
                                  <span>View</span>
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" />
                                      <span>Edit</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <ShoppingCart className="h-4 w-4 mr-2" />
                                      <span>New Sale</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      <span>Delete</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                  <div className="py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No Customers Found</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      No customers match your search criteria. Try adjusting your search or add a new customer.
                    </p>
                    <Button onClick={() => setShowAddDialog(true)}>
                      <PlusCircle className="h-5 w-5 mr-2" />
                      Add New Customer
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="regular">
              {regularCustomers.length > 0 ? (
                <div className="rounded-lg overflow-hidden bg-white shadow-md">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Prescription Items
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Visit
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Spent
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {regularCustomers.map((customer) => (
                          <tr key={customer.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-primary font-medium">
                                    {customer.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="flex items-center">
                                    <div className="text-sm font-medium text-gray-900 mr-1">{customer.name}</div>
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                  </div>
                                  <div className="text-sm text-gray-500">{customer.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="max-w-[250px]">
                                {customer.prescription.length > 0 ? (
                                  <div className="flex flex-col gap-1">
                                    {customer.prescription.map((med, idx) => (
                                      <div key={idx} className="flex items-center text-sm">
                                        <Pill className="h-3 w-3 text-primary mr-1" />
                                        <span className="text-gray-900">{med.name}</span>
                                        <span className="text-gray-500 text-xs ml-2">({med.frequency})</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-500">No active prescriptions</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{customer.lastVisit}</div>
                              <div className="text-sm text-gray-500">{customer.totalVisits} visits total</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{customer.totalSpent.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="flex items-center" 
                                  onClick={() => handleViewDetails(customer)}
                                >
                                  <span>View</span>
                                </Button>
                                <Button variant="outline" size="sm" className="flex items-center">
                                  <ShoppingCart className="h-4 w-4 mr-1" />
                                  <span>New Sale</span>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                  <div className="py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No Regular Customers Found</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Regular customers with recurring medicine refills or ongoing courses will appear here.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {/* Customer Details Dialog */}
          {selectedCustomer && (
            <Dialog open={!!selectedCustomer} onOpenChange={handleCloseDetails}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <span className="mr-2">{selectedCustomer.name}</span>
                    {selectedCustomer.type === 'regular' && (
                      <Badge className="bg-green-100 text-green-800">Regular</Badge>
                    )}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <Phone className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                          <div>
                            <div className="text-sm font-medium">{selectedCustomer.phone}</div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Mail className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                          <div>
                            <div className="text-sm font-medium">{selectedCustomer.email}</div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                          <div>
                            <div className="text-sm font-medium">{selectedCustomer.address}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Customer Summary</h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <Calendar className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                          <div>
                            <div className="text-sm text-gray-700">Last Visit: <span className="font-medium">{selectedCustomer.lastVisit}</span></div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Users className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                          <div>
                            <div className="text-sm text-gray-700">Total Visits: <span className="font-medium">{selectedCustomer.totalVisits}</span></div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <ShoppingCart className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                          <div>
                            <div className="text-sm text-gray-700">Total Spent: <span className="font-medium">₹{selectedCustomer.totalSpent.toLocaleString()}</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                      <Pill className="h-4 w-4 mr-2" />
                      Active Prescriptions
                    </h3>
                    {selectedCustomer.prescription.length > 0 ? (
                      <div className="bg-gray-50 rounded-md p-3">
                        <div className="space-y-2">
                          {selectedCustomer.prescription.map((med: any, idx: number) => (
                            <div key={idx} className="flex justify-between">
                              <div>
                                <span className="font-medium text-sm">{med.name}</span>
                                <span className="text-xs text-gray-500 ml-2">({med.frequency})</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                Duration: {med.duration}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">No active prescriptions</div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Last Purchase
                    </h3>
                    <div className="bg-gray-50 rounded-md p-3">
                      {selectedCustomer.lastPurchase.length > 0 ? (
                        <div className="space-y-2">
                          {selectedCustomer.lastPurchase.map((purchase: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <div className="font-medium">{purchase.name}</div>
                              <div className="text-gray-500">
                                Qty: {purchase.quantity} · {purchase.date}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No purchase history</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleCloseDetails}>Close</Button>
                  <div className="space-x-2">
                    <Button variant="outline" className="flex items-center">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button className="flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      New Sale
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </motion.main>
      </div>
    </div>
  );
};

export default Customers;