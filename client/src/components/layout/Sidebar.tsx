import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, 
  BarChart3, Settings, HelpCircle, LogOut
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [location] = useLocation();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Updated menu items according to the requirements
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/dashboard'
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: <Package size={20} />,
      path: '/inventory'
    },
    {
      id: 'counter-sales',
      label: 'Counter & Sales',
      icon: <ShoppingCart size={20} />,
      path: '/counter-sales'
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: <Users size={20} />,
      path: '/customers'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <BarChart3 size={20} />,
      path: '/reports'
    }
  ];

  const bottomMenuItems = [
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={20} />,
      path: '/settings'
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: <HelpCircle size={20} />,
      path: '/help'
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: <LogOut size={20} />,
      path: '/'
    }
  ];

  const isLinkActive = (path: string) => {
    return location === path;
  };

  return (
    <motion.div
      className={`h-screen bg-white border-r border-gray-200 flex flex-col sidebar-transition ${
        isCollapsed ? 'w-[70px]' : 'w-[250px]'
      } z-40`}
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Sidebar Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <i className="fas fa-pills text-white"></i>
            </div>
            <span className="text-lg font-bold ml-2">PharmaTrack</span>
          </div>
        )}
        
        <button 
          onClick={toggleCollapse}
          className={`p-1 rounded-md hover:bg-gray-100 transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
        >
          <i className={`fas fa-chevron-${isCollapsed ? 'right' : 'left'} text-gray-500`}></i>
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link href={item.path}>
                <div
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center' : ''
                  } p-2 rounded-md transition-colors ${
                    isLinkActive(item.path)
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 hover:bg-gray-100'
                  } cursor-pointer`}
                  onClick={() => setActiveMenu(item.id)}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Menu */}
      <div className="border-t border-gray-200 py-4 px-3">
        <ul className="space-y-1">
          {bottomMenuItems.map((item) => (
            <li key={item.id}>
              <Link href={item.path}>
                <div
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center' : ''
                  } p-2 rounded-md transition-colors text-gray-700 hover:bg-gray-100 cursor-pointer`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default Sidebar;