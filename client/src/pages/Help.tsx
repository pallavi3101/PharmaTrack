import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Book, MessageSquare, Phone, FileText, Mail } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Help = () => {
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

  const supportOptions = [
    {
      title: "Documentation",
      description: "Browse our comprehensive documentation",
      icon: <Book className="h-10 w-10 text-primary" />,
      action: "Browse Docs"
    },
    {
      title: "Chat Support",
      description: "Live chat with our support team",
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      action: "Start Chat"
    },
    {
      title: "Phone Support",
      description: "Call our 24/7 support line",
      icon: <Phone className="h-10 w-10 text-primary" />,
      action: "Call Now"
    }
  ];

  const faqs = [
    {
      question: "How do I add a new product to inventory?",
      answer: "To add a new product, navigate to the Inventory page and click on the 'Add Product' button. Fill in the required details such as product name, batch number, quantity, price, expiry date, and supplier information. Click 'Save' to add the product to your inventory."
    },
    {
      question: "How can I process a sales transaction?",
      answer: "To process a sale, go to the Counter & Sales page and click on an available counter or create a new one. Enter customer details, then search and add products to the cart. The system will automatically calculate the total. Finalize the sale by selecting a payment method and clicking 'Save' or 'Print' for a receipt."
    },
    {
      question: "How do I generate reports?",
      answer: "To generate reports, go to the Reports page and select the type of report you want (Sales, Purchase, or Profit). You can customize the date range and other parameters. Once set, click 'Generate Report'. You can view the report on screen or download it as Excel/CSV."
    },
    {
      question: "How can I set up alerts for low stock?",
      answer: "You can set up low stock alerts in the Inventory section. Go to a product's details, find the 'Threshold' field and enter the minimum quantity. When stock falls below this number, the system will automatically display alerts on your dashboard."
    },
    {
      question: "How do I add a regular customer?",
      answer: "Regular customers are automatically identified based on their purchase patterns. Add customers through the Customers page, and the system will move them to the 'Regular Customers' tab when they have recurring purchases or ongoing medicine courses."
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
            <p className="text-gray-600 mt-1">Find answers to common questions and get support</p>
          </div>
          
          {/* Support Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {supportOptions.map((option, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <div className="mb-4">
                  {option.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                  {option.action}
                </button>
              </motion.div>
            ))}
          </div>
          
          {/* FAQs */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-primary" />
              Frequently Asked Questions
            </h2>
            
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-primary" />
              Contact Us
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input 
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input 
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="How can we help?"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={5}
                    placeholder="Describe your issue or question in detail"
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                    Send Message
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

export default Help;