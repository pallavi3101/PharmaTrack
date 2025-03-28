import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Plus, X, Search, CreditCard, Receipt,
  Trash2, CheckCircle, Ban, RefreshCw
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Dummy data for counters
const initialCounters = [
  { id: 1, number: 'Counter 1', customerName: 'Rahul Sharma', status: 'active' },
  { id: 2, number: 'Counter 2', customerName: '', status: 'closed' },
  { id: 3, number: 'Counter 3', customerName: 'Priya Mehta', status: 'active' },
  { id: 4, number: 'Counter 4', customerName: '', status: 'closed' },
];

// Dummy data for medicines
const medicinesList = [
  { id: 1, name: 'Paracetamol', batchNo: 'B12345', expiryDate: '12/2026', price: 25, company: 'Cipla', stock: 150 },
  { id: 2, name: 'Cough Syrup', batchNo: 'B98765', expiryDate: '08/2025', price: 120, company: 'Sun Pharma', stock: 42 },
  { id: 3, name: 'Amoxicillin', batchNo: 'B56789', expiryDate: '06/2027', price: 75, company: 'Pfizer', stock: 85 },
  { id: 4, name: 'Cetrizine', batchNo: 'B23456', expiryDate: '03/2026', price: 35, company: 'Cipla', stock: 65 },
  { id: 5, name: 'Vitamin C', batchNo: 'B34567', expiryDate: '11/2025', price: 150, company: 'Abbott', stock: 27 },
  { id: 6, name: 'Aspirin', batchNo: 'B45678', expiryDate: '05/2026', price: 18, company: 'GSK', stock: 92 },
];

// Counter component
interface CounterProps {
  counter: {
    id: number;
    number: string;
    customerName: string;
    status: string;
  };
  onSelect: (id: number) => void;
}

const Counter: React.FC<CounterProps> = ({ counter, onSelect }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`border rounded-md p-4 cursor-pointer shadow-sm ${
        counter.status === 'active' 
          ? 'border-green-500 bg-green-50' 
          : 'border-gray-300 bg-gray-50'
      }`}
      onClick={() => onSelect(counter.id)}
    >
      <div className="text-center">
        <h3 className="font-medium">{counter.number}</h3>
        {counter.status === 'active' ? (
          <>
            <p className="text-sm text-gray-600 truncate mt-1">{counter.customerName}</p>
            <Badge className="mt-2 bg-green-500">Active</Badge>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-400 mt-1">Empty</p>
            <Badge className="mt-2 bg-gray-400">Closed</Badge>
          </>
        )}
      </div>
    </motion.div>
  );
};

// Cart Item interface
interface CartItem {
  id: number;
  name: string;
  batchNo: string;
  expiryDate: string;
  price: number;
  company: string;
  quantity: number;
  discount: number;
  tax: number;
  total: number;
}

const CounterSales = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counters, setCounters] = useState(initialCounters);
  const [selectedCounter, setSelectedCounter] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [medicineSearch, setMedicineSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [activeCounter, setActiveCounter] = useState<any>(null);

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

  const handleCounterSelect = (id: number) => {
    setSelectedCounter(id);
    const counter = counters.find(c => c.id === id);
    if (counter) {
      setCustomerName(counter.customerName || '');
      setActiveCounter(counter);
    }
  };

  const handleAddCounter = () => {
    const newId = counters.length > 0 ? Math.max(...counters.map(c => c.id)) + 1 : 1;
    const newCounter = {
      id: newId,
      number: `Counter ${newId}`,
      customerName: '',
      status: 'closed'
    };
    setCounters([...counters, newCounter]);
  };

  const filteredMedicines = medicinesList.filter(medicine => 
    medicine.name.toLowerCase().includes(medicineSearch.toLowerCase())
  );

  const handleAddToCart = (medicine: any) => {
    const existingItem = cart.find(item => item.id === medicine.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === medicine.id 
          ? {
              ...item, 
              quantity: item.quantity + 1,
              total: (item.quantity + 1) * (item.price * (1 - item.discount/100) * (1 + item.tax/100))
            } 
          : item
      ));
    } else {
      const discount = 5; // Default discount percentage
      const tax = 12; // Default tax percentage
      const total = medicine.price * (1 - discount/100) * (1 + tax/100);
      
      setCart([...cart, {
        ...medicine,
        quantity: 1,
        discount,
        tax,
        total
      }]);
    }
  };

  const handleRemoveFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity < 1) return;
    
    setCart(cart.map(item => 
      item.id === id 
        ? {
            ...item, 
            quantity,
            total: quantity * (item.price * (1 - item.discount/100) * (1 + item.tax/100))
          } 
        : item
    ));
  };

  const handleDiscountChange = (id: number, discount: number) => {
    setCart(cart.map(item => 
      item.id === id 
        ? {
            ...item, 
            discount,
            total: item.quantity * (item.price * (1 - discount/100) * (1 + item.tax/100))
          } 
        : item
    ));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSaveTransaction = () => {
    // Processing the transaction
    if (selectedCounter) {
      // Update counter status
      setCounters(counters.map(counter => 
        counter.id === selectedCounter
          ? { ...counter, customerName, status: 'active' }
          : counter
      ));
      
      // Show receipt dialog
      setShowReceiptModal(true);
    }
  };

  const handleCloseCounter = () => {
    if (selectedCounter) {
      // Reset the counter
      setCounters(counters.map(counter => 
        counter.id === selectedCounter
          ? { ...counter, customerName: '', status: 'closed' }
          : counter
      ));
      
      // Clear the form
      setSelectedCounter(null);
      setCustomerName('');
      setPhoneNumber('');
      setCart([]);
      setActiveCounter(null);
    }
  };

  const handleCompleteTransaction = () => {
    // Close the receipt modal
    setShowReceiptModal(false);
    
    // Close the counter and reset
    handleCloseCounter();
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
            <p className="text-gray-600 mt-1">Manage sales transactions and customer checkout</p>
          </div>
          
          {/* Counters Grid */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Sales Counters</h2>
              <Button onClick={handleAddCounter} className="flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                <span>Add Counter</span>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {counters.map(counter => (
                <Counter 
                  key={counter.id} 
                  counter={counter} 
                  onSelect={handleCounterSelect} 
                />
              ))}
            </div>
          </div>
          
          {/* Counter Sale Module */}
          {selectedCounter ? (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    {activeCounter?.number} {activeCounter?.status === 'active' ? '- Active' : '- New Transaction'}
                  </h2>
                  <Button variant="outline" onClick={handleCloseCounter}>
                    <X className="h-4 w-4 mr-1" />
                    <span>Close Counter</span>
                  </Button>
                </div>
                
                {/* Customer Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                    <Input 
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <Input 
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                
                {/* Medicine Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Add Medicine</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      type="text"
                      className="pl-10"
                      value={medicineSearch}
                      onChange={(e) => setMedicineSearch(e.target.value)}
                      placeholder="Search medicine by name"
                    />
                  </div>
                  
                  {medicineSearch && (
                    <div className="mt-2 bg-white border border-gray-300 rounded-md shadow-sm max-h-48 overflow-y-auto">
                      {filteredMedicines.length > 0 ? (
                        filteredMedicines.map((medicine) => (
                          <div 
                            key={medicine.id}
                            className="p-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex justify-between items-center"
                            onClick={() => {
                              handleAddToCart(medicine);
                              setMedicineSearch('');
                            }}
                          >
                            <div>
                              <div className="font-medium">{medicine.name}</div>
                              <div className="text-sm text-gray-500">
                                {medicine.company} - ₹{medicine.price} - Batch: {medicine.batchNo}
                              </div>
                            </div>
                            <Badge className={medicine.stock < 30 ? "bg-amber-500" : "bg-green-500"}>
                              Stock: {medicine.stock}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-gray-500">No medicines found</div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Cart */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Cart Items</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Medicine
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Batch/Expiry
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Qty
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Disc %
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {cart.length > 0 ? (
                          cart.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="font-medium text-gray-900">{item.name}</div>
                                <div className="text-xs text-gray-500">{item.company}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{item.batchNo}</div>
                                <div className="text-xs text-gray-500">Exp: {item.expiryDate}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-center">
                                <div className="flex items-center justify-center">
                                  <button 
                                    className="h-6 w-6 flex items-center justify-center border rounded-l"
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  >
                                    -
                                  </button>
                                  <input 
                                    type="number" 
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                    className="h-6 w-10 text-center border-t border-b"
                                    min="1"
                                  />
                                  <button 
                                    className="h-6 w-6 flex items-center justify-center border rounded-r"
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right">
                                ₹{item.price.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right">
                                <input 
                                  type="number" 
                                  value={item.discount}
                                  onChange={(e) => handleDiscountChange(item.id, parseInt(e.target.value))}
                                  className="w-12 text-center border rounded"
                                  min="0"
                                  max="100"
                                />
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right font-medium">
                                ₹{item.total.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-center">
                                <button 
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleRemoveFromCart(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                              No items in cart. Search and add medicines above.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Total and Actions */}
                {cart.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="mb-4 md:mb-0">
                        <div className="text-gray-600 mb-1">Subtotal: ₹{calculateTotal().toFixed(2)}</div>
                        <div className="text-xl font-bold">Total: ₹{calculateTotal().toFixed(2)}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          className="border-red-500 text-red-500 hover:bg-red-50"
                          onClick={() => setCart([])}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          <span>Clear Cart</span>
                        </Button>
                        <Button 
                          className="bg-primary hover:bg-primary/90"
                          onClick={handleSaveTransaction}
                          disabled={cart.length === 0 || !customerName.trim()}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>Complete Sale</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-8 text-center">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Counter Selected</h2>
              <p className="text-gray-500 mb-4">Select a counter from above to start a new transaction or view an existing one.</p>
            </div>
          )}
          
          {/* Receipt Dialog */}
          <Dialog open={showReceiptModal} onOpenChange={setShowReceiptModal}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Complete Transaction</DialogTitle>
                <DialogDescription>
                  Choose a payment method and enter payment details to complete this sale.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <div className="flex space-x-2">
                    <Button 
                      variant={paymentMethod === 'cash' ? 'default' : 'outline'} 
                      onClick={() => setPaymentMethod('cash')}
                      className="flex-1"
                    >
                      Cash
                    </Button>
                    <Button 
                      variant={paymentMethod === 'card' ? 'default' : 'outline'} 
                      onClick={() => setPaymentMethod('card')}
                      className="flex-1"
                    >
                      <CreditCard className="h-4 w-4 mr-1" />
                      Card
                    </Button>
                    <Button 
                      variant={paymentMethod === 'upi' ? 'default' : 'outline'} 
                      onClick={() => setPaymentMethod('upi')}
                      className="flex-1"
                    >
                      UPI
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount Received</label>
                  <Input 
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium">₹{calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Amount Received:</span>
                    <span className="font-medium">₹{amountPaid || '0.00'}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium">Balance:</span>
                    <span className="font-bold">
                      ₹{((parseFloat(amountPaid) || 0) - calculateTotal()).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShowReceiptModal(false)}>
                  Cancel
                </Button>
                <div className="space-x-2">
                  <Button 
                    variant="outline"
                    onClick={handleCompleteTransaction}
                  >
                    <Receipt className="h-4 w-4 mr-1" />
                    Print Receipt
                  </Button>
                  <Button 
                    onClick={handleCompleteTransaction}
                    disabled={!amountPaid || parseFloat(amountPaid) < calculateTotal()}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Complete
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.main>
      </div>
    </div>
  );
};

export default CounterSales;