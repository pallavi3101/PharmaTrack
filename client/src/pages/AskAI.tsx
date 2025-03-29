import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, Search, RefreshCw, Sparkles, User, Pill, Package } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryAI, analyzeMedicineData, analyzeCustomerData } from '@/utils/aiUtils';

// Sample medicine data for AI analysis
const sampleMedicines = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Analgesics",
    company: "GlaxoSmithKline",
    batchNo: "PCM22001",
    expiryDate: "2025-06-30",
    price: 5.99,
    stock: 120,
    threshold: 20
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    category: "Antibiotics",
    company: "Cipla",
    batchNo: "AMX22045",
    expiryDate: "2024-11-15",
    price: 12.50,
    stock: 45,
    threshold: 15
  },
  {
    id: 3,
    name: "Lisinopril 10mg",
    category: "Antihypertensives",
    company: "Sun Pharma",
    batchNo: "LIS22078",
    expiryDate: "2025-03-22",
    price: 15.75,
    stock: 60,
    threshold: 20
  },
  {
    id: 4,
    name: "Metformin 500mg",
    category: "Antidiabetics",
    company: "Zydus",
    batchNo: "MET22103",
    expiryDate: "2025-08-10",
    price: 8.25,
    stock: 75,
    threshold: 25
  },
  {
    id: 5,
    name: "Atorvastatin 20mg",
    category: "Statins",
    company: "Pfizer",
    batchNo: "ATV22022",
    expiryDate: "2025-01-18",
    price: 18.99,
    stock: 30,
    threshold: 10
  }
];

// Sample customer data for AI analysis
const sampleCustomers = [
  {
    id: 1,
    name: "John Smith",
    phone: "123-456-7890",
    email: "john.smith@example.com",
    address: "123 Main St",
    loyalty_points: 150,
    registration_date: "2023-01-15"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    phone: "987-654-3210",
    email: "sarah.j@example.com",
    address: "456 Oak Ave",
    loyalty_points: 350,
    registration_date: "2022-07-22"
  }
];

// Sample sales data for AI analysis
const sampleSales = [
  {
    id: 1,
    customer_id: 1,
    date: "2024-02-15",
    total: 45.99,
    items: [
      { product_id: 1, quantity: 2, price: 5.99 },
      { product_id: 3, quantity: 1, price: 15.75 }
    ]
  },
  {
    id: 2,
    customer_id: 2,
    date: "2024-02-20",
    total: 27.49,
    items: [
      { product_id: 2, quantity: 1, price: 12.50 },
      { product_id: 4, quantity: 1, price: 8.25 }
    ]
  }
];

// Sample recent queries for display
const recentQueries = [
  "Can patients take Ibuprofen with Paracetamol?",
  "What's the shelf life of Amoxicillin?",
  "Delivery schedule for Abbott supplies",
  "Storage requirements for insulin",
  "Generic alternatives to Lipitor"
];

const AskAI = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('medicine');
  const [conversations, setConversations] = useState<any[]>([]);
  const [previousQueries, setPreviousQueries] = useState<string[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load previous conversations from localStorage if available
  useEffect(() => {
    const savedConversations = localStorage.getItem('pharmaai_conversations');
    const savedQueries = localStorage.getItem('pharmaai_queries');
    
    if (savedConversations) {
      try {
        setConversations(JSON.parse(savedConversations));
      } catch (e) {
        console.error("Error parsing saved conversations:", e);
      }
    }
    
    if (savedQueries) {
      try {
        setPreviousQueries(JSON.parse(savedQueries));
      } catch (e) {
        console.error("Error parsing saved queries:", e);
      }
    }
  }, []);

  // Save conversations to localStorage when they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('pharmaai_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Save queries to localStorage when they change
  useEffect(() => {
    if (previousQueries.length > 0) {
      localStorage.setItem('pharmaai_queries', JSON.stringify(previousQueries));
    }
  }, [previousQueries]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Add user query to the conversation
    setConversations(prev => [
      ...prev,
      {
        type: 'user',
        message: query
      }
    ]);
    
    // Save query to previous queries
    setPreviousQueries(prev => {
      const newQueries = [query, ...prev.filter(q => q !== query)].slice(0, 10);
      return newQueries;
    });
    
    setIsLoading(true);
    setApiError(null);
    
    try {
      let response;
      let source = "PharmaTrack AI, " + new Date().toLocaleDateString();
      
      // Use different AI functions based on the active tab
      if (activeTab === 'medicine') {
        response = await analyzeMedicineData(sampleMedicines, query);
      } else if (activeTab === 'suppliers') {
        response = await queryAI({ 
          question: query,
          systemPrompt: "You are a pharmaceutical supplier relations expert. Answer questions about suppliers, delivery terms, payment schedules, and product availability based on the data in the PharmaTrack system."
        });
      } else if (activeTab === 'inventory') {
        response = await analyzeCustomerData(sampleCustomers, sampleSales, query);
      } else {
        response = await queryAI({ question: query });
      }
      
      // Add AI response to the conversation
      setConversations(prev => [
        ...prev,
        {
          type: 'ai',
          message: response,
          source: source
        }
      ]);
    } catch (error) {
      console.error("Error querying AI:", error);
      setApiError("Failed to get response from AI. Please try again.");
      
      toast({
        title: "Connection Error",
        description: "Could not connect to the AI service. Please try again later.",
        variant: "destructive",
      });
      
      // Add error message to conversation
      setConversations(prev => [
        ...prev,
        {
          type: 'ai',
          message: "I'm sorry, I couldn't process your request at this time. Please try again later.",
          source: "System"
        }
      ]);
    } finally {
      setQuery('');
      setIsLoading(false);
    }
  };

  const handleQuickQuery = (question: string) => {
    setQuery(question);
    // Focus on the input field
    const inputField = document.getElementById('query-input');
    if (inputField) {
      inputField.focus();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <motion.main 
          className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Ask PharmAI</h1>
            <p className="text-gray-600 mt-1">Get instant answers to your queries about medicines, suppliers, and inventory</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chat Section */}
            <div className="lg:col-span-2 flex flex-col">
              <Tabs defaultValue="medicine" className="w-full" onValueChange={(value) => setActiveTab(value)}>
                <div className="bg-white p-4 rounded-t-lg border border-gray-200">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="medicine" className="flex items-center justify-center">
                      <Pill className="h-4 w-4 mr-2" />
                      <span>Medicines</span>
                    </TabsTrigger>
                    <TabsTrigger value="suppliers" className="flex items-center justify-center">
                      <Package className="h-4 w-4 mr-2" />
                      <span>Suppliers</span>
                    </TabsTrigger>
                    <TabsTrigger value="inventory" className="flex items-center justify-center">
                      <Search className="h-4 w-4 mr-2" />
                      <span>Inventory</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="bg-white border-x border-b border-gray-200 rounded-b-lg flex-1 flex flex-col h-[calc(100vh-280px)]">
                  <TabsContent value="medicine" className="flex-1 flex flex-col h-full m-0">
                    <div className="p-4 border-b">
                      <p className="text-sm text-gray-600">
                        Ask questions about medicines, dosages, side effects, interactions, and more.
                      </p>
                    </div>
                    <ChatArea conversations={conversations} />
                  </TabsContent>
                  
                  <TabsContent value="suppliers" className="flex-1 flex flex-col h-full m-0">
                    <div className="p-4 border-b">
                      <p className="text-sm text-gray-600">
                        Ask about supplier information, delivery schedules, payment terms, and contacts.
                      </p>
                    </div>
                    <ChatArea conversations={conversations} />
                  </TabsContent>
                  
                  <TabsContent value="inventory" className="flex-1 flex flex-col h-full m-0">
                    <div className="p-4 border-b">
                      <p className="text-sm text-gray-600">
                        Ask about inventory management practices, stock optimization, and storage requirements.
                      </p>
                    </div>
                    <ChatArea conversations={conversations} />
                  </TabsContent>
                  
                  <div className="p-3 border-t">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                      <Input
                        id="query-input"
                        placeholder="Type your question here..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1"
                        disabled={isLoading}
                      />
                      <Button type="submit" disabled={isLoading || !query.trim()} className="shrink-0">
                        {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </form>
                  </div>
                </div>
              </Tabs>
            </div>
            
            {/* Sidebar with Suggested Queries */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-medium flex items-center">
                    <Sparkles className="h-4 w-4 text-primary mr-2" />
                    Suggested Queries
                  </h3>
                </div>
                
                <div className="p-4">
                  <div className="space-y-3">
                    <button
                      className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                      onClick={() => handleQuickQuery("What are the side effects of Paracetamol?")}
                    >
                      What are the side effects of Paracetamol?
                    </button>
                    <button
                      className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                      onClick={() => handleQuickQuery("How should I store insulin?")}
                    >
                      How should I store insulin?
                    </button>
                    <button
                      className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                      onClick={() => handleQuickQuery("What are the payment terms for Sun Pharma?")}
                    >
                      What are the payment terms for Sun Pharma?
                    </button>
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <h3 className="font-medium flex items-center">
                    <RefreshCw className="h-4 w-4 text-primary mr-2" />
                    Recent Queries
                  </h3>
                </div>
                
                <div className="p-4">
                  <div className="space-y-2">
                    {(previousQueries.length > 0 ? previousQueries : recentQueries).map((q, index) => (
                      <div 
                        key={index}
                        className="flex items-center text-sm text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-50 rounded-md"
                        onClick={() => handleQuickQuery(q)}
                      >
                        <Search className="h-3 w-3 mr-2 text-gray-400" />
                        {q}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
};

interface ChatAreaProps {
  conversations: Array<{
    type: 'user' | 'ai';
    message: string;
    source?: string;
  }>;
}

const ChatArea = ({ conversations }: ChatAreaProps) => {
  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Bot className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Ask PharmAI</h3>
        <p className="text-gray-500 max-w-md">
          I can help with information about medicines, suppliers, and inventory management. Ask me a question to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {conversations.map((msg, index) => (
        <div 
          key={index}
          className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`
            max-w-[80%] rounded-lg p-3
            ${msg.type === 'user' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-800'
            }
          `}>
            <div className="flex items-center mb-1">
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center
                ${msg.type === 'user' 
                  ? 'bg-white/20' 
                  : 'bg-primary/10'
                }
                mr-2
              `}>
                {msg.type === 'user' 
                  ? <User className="h-3 w-3 text-white" /> 
                  : <Bot className="h-3 w-3 text-primary" />
                }
              </div>
              <span className="text-xs font-medium">
                {msg.type === 'user' ? 'You' : 'PharmAI'}
              </span>
            </div>
            <div className="whitespace-pre-line text-sm">
              {msg.message}
            </div>
            {msg.source && (
              <div className="mt-2 pt-2 border-t border-gray-200/20 text-xs">
                <span className={`font-medium ${msg.type === 'user' ? 'text-white/80' : 'text-gray-500'}`}>
                  Source: {msg.source}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AskAI;