import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, Search, RefreshCw, Sparkles, User, Pill, Package } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Sample responses for demo purposes
const dummyResponses = {
  medicine: [
    {
      question: "What are the side effects of Paracetamol?",
      answer: "Paracetamol (acetaminophen) is generally well-tolerated but can cause the following side effects:\n\n- Nausea\n- Stomach pain\n- Headache\n- Skin rash (rare)\n- Liver damage (when taken in excessive amounts)\n\nIf you experience severe side effects or allergic reactions like skin rashes, swelling, or difficulty breathing, seek medical attention immediately.",
      source: "Pharmacy Reference Guide, 2024"
    },
    {
      question: "Can I take Amoxicillin with food?",
      answer: "Yes, Amoxicillin can be taken with or without food. Taking it with food may help reduce stomach upset. However, for optimal absorption, it's best to take it at consistent times each day as prescribed. Complete the full course of antibiotics even if you feel better to ensure the infection is completely treated.",
      source: "International Pharmaceutical Reference"
    },
    {
      question: "Is Vitamin C effective for colds?",
      answer: "Research on Vitamin C for common colds shows mixed results. While Vitamin C supplements don't appear to reduce the risk of getting a cold for most people, they may help reduce the duration and severity of cold symptoms. Regular supplementation might be more effective than taking it after cold symptoms start. The recommended daily allowance for adults is 65-90mg per day.",
      source: "Journal of Clinical Nutrition, 2023"
    }
  ],
  suppliers: [
    {
      question: "Who supplies Cipla products?",
      answer: "Cipla products are supplied directly through Cipla's authorized distribution network. In your region, the primary distributors are:\n\n1. MedSupply Distribution Ltd.\n2. HealthCare Logistics Inc.\n3. Regional Medical Suppliers\n\nFor ordering Cipla products, you can contact their customer service at 1-800-CIPLA-CS or place orders through their B2B portal at business.cipla.com.",
      source: "Supplier Database, 2024"
    },
    {
      question: "What are the delivery terms for Sun Pharma?",
      answer: "Sun Pharma's standard delivery terms include:\n\n- Orders over $1000: Free delivery, 2-3 business days\n- Orders under $1000: $25 delivery fee, 2-3 business days\n- Express delivery: Additional $50, next business day\n- Minimum order value: $250\n- Payment terms: Net 30 days for established customers\n- Returns: Within 14 days with original packaging\n\nThese terms may vary based on your specific contract or region.",
      source: "Sun Pharma Distribution Guide"
    }
  ],
  inventory: [
    {
      question: "Best practices for inventory management?",
      answer: "Best practices for pharmaceutical inventory management include:\n\n1. Implement FEFO (First Expired, First Out) system\n2. Regular cycle counting (weekly/monthly depending on volume)\n3. Set par levels and reorder points for all items\n4. Use barcode/RFID systems for tracking\n5. Monitor expiry dates with automated alerts\n6. Perform regular stock reconciliation\n7. Maintain proper storage conditions monitoring\n8. Document all stock movements with detailed audit trails\n9. Analyze turnover rates to optimize ordering\n10. Segregate expired/damaged items immediately",
      source: "Pharmaceutical Inventory Management Guidelines"
    },
    {
      question: "How to optimize stock levels?",
      answer: "To optimize pharmaceutical stock levels:\n\n1. Analyze historical sales data (minimum 6 months)\n2. Calculate safety stock based on lead times and demand variability\n3. Implement ABC analysis (categorize items by value/criticality)\n4. Set different service levels for different categories\n5. Consider seasonality for products with fluctuating demand\n6. Establish PAR levels (Periodic Automatic Replenishment)\n7. Implement JIT (Just-In-Time) for high-turnover items\n8. Review and adjust stock levels quarterly\n9. Use forecasting software for demand prediction\n10. Collaborate with suppliers on VMI (Vendor Managed Inventory) for key products",
      source: "Healthcare Supply Chain Association"
    }
  ]
};

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Simulate AI processing
    setIsLoading(true);
    
    setTimeout(() => {
      // Get a dummy response based on active tab
      const responsePool = dummyResponses[activeTab as keyof typeof dummyResponses] || [];
      const randomResponse = responsePool[Math.floor(Math.random() * responsePool.length)];
      
      // Add to conversation
      setConversations([
        ...conversations,
        {
          type: 'user',
          message: query
        },
        {
          type: 'ai',
          message: randomResponse.answer,
          source: randomResponse.source
        }
      ]);
      
      setQuery('');
      setIsLoading(false);
    }, 1500);
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
                    {recentQueries.map((q, index) => (
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