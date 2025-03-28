import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Store, Lock, Bell, Palette } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
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
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <Tabs defaultValue="profile" className="w-full">
              <div className="border-b">
                <div className="px-4">
                  <TabsList className="flex h-12 w-full overflow-x-auto">
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </TabsTrigger>
                    <TabsTrigger value="store" className="flex items-center gap-2">
                      <Store className="h-4 w-4" />
                      <span>Store</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span>Security</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>Notifications</span>
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      <span>Appearance</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
              
              <TabsContent value="profile" className="p-6">
                <div className="max-w-2xl">
                  <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 md:items-center">
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                        <User className="h-12 w-12 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium">Profile Picture</h3>
                        <p className="text-sm text-gray-500 mb-2">Update your profile photo</p>
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md">
                            Upload Photo
                          </button>
                          <button className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input 
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input 
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                          type="email"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="john.doe@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input 
                          type="tel"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={4}
                        placeholder="Tell us about yourself"
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end">
                      <button className="px-4 py-2 bg-primary text-white rounded-md">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="store" className="p-6">
                <h2 className="text-xl font-semibold mb-6">Store Settings</h2>
                <p className="text-gray-500">Configure your pharmacy store settings and preferences.</p>
              </TabsContent>
              
              <TabsContent value="security" className="p-6">
                <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                <p className="text-gray-500">Manage your account security and password.</p>
              </TabsContent>
              
              <TabsContent value="notifications" className="p-6">
                <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>
                <p className="text-gray-500">Control what notifications you receive.</p>
              </TabsContent>
              
              <TabsContent value="appearance" className="p-6">
                <h2 className="text-xl font-semibold mb-6">Appearance Settings</h2>
                <p className="text-gray-500">Customize the look and feel of your dashboard.</p>
              </TabsContent>
            </Tabs>
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default Settings;