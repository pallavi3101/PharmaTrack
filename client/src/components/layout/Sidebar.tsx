import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, CreditCard,
  BarChart3, Settings, HelpCircle, LogOut, ChevronDown, 
  AlertOctagon, Calendar
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);
  const [location] = useLocation();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSubmenu = (menu: string) => {
    if (expandedSubmenu === menu) {
      setExpandedSubmenu(null);
    } else {
      setExpandedSubmenu(menu);
    }
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/dashboard',
      submenu: null
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: <Package size={20} />,
      path: '/inventory',
      submenu: [
        { id: 'products', label: 'Products', path: '/inventory/products' },
        { id: 'categories', label: 'Categories', path: '/inventory/categories' },
        { id: 'suppliers', label: 'Suppliers', path: '/inventory/suppliers' },
        { id: 'stock-alerts', label: 'Stock Alerts', path: '/inventory/alerts' }
      ]
    },
    {
      id: 'sales',
      label: 'Sales & Orders',
      icon: <ShoppingCart size={20} />,
      path: '/sales',
      submenu: [
        { id: 'new-sale', label: 'New Sale', path: '/sales/new' },
        { id: 'orders', label: 'Orders', path: '/sales/orders' },
        { id: 'returns', label: 'Returns', path: '/sales/returns' },
        { id: 'invoices', label: 'Invoices', path: '/sales/invoices' }
      ]
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: <Users size={20} />,
      path: '/customers',
      submenu: null
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: <CreditCard size={20} />,
      path: '/payments',
      submenu: null
    },
    {
      id: 'prescriptions',
      label: 'Prescriptions',
      icon: <AlertOctagon size={20} />,
      path: '/prescriptions',
      submenu: null
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: <Calendar size={20} />,
      path: '/appointments',
      submenu: null
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <BarChart3 size={20} />,
      path: '/reports',
      submenu: [
        { id: 'sales-reports', label: 'Sales Reports', path: '/reports/sales' },
        { id: 'inventory-reports', label: 'Inventory Reports', path: '/reports/inventory' },
        { id: 'customer-reports', label: 'Customer Reports', path: '/reports/customers' },
        { id: 'financial-reports', label: 'Financial Reports', path: '/reports/financial' }
      ]
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
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.id)}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center' : 'justify-between'
                    } p-2 rounded-md transition-colors ${
                      activeMenu === item.id ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="flex-shrink-0">{item.icon}</span>
                      {!isCollapsed && <span className="ml-3">{item.label}</span>}
                    </div>
                    {!isCollapsed && item.submenu && (
                      <ChevronDown
                        size={18}
                        className={`transform transition-transform ${
                          expandedSubmenu === item.id ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>
                  
                  {!isCollapsed && expandedSubmenu === item.id && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-1 ml-6 space-y-1"
                    >
                      {item.submenu.map((subItem) => (
                        <li key={subItem.id}>
                          <Link href={subItem.path}>
                            <a
                              className={`block p-2 text-sm rounded-md transition-colors ${
                                isLinkActive(subItem.path)
                                  ? 'bg-primary/10 text-primary'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {subItem.label}
                            </a>
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </div>
              ) : (
                <Link href={item.path}>
                  <a
                    className={`flex items-center ${
                      isCollapsed ? 'justify-center' : ''
                    } p-2 rounded-md transition-colors ${
                      isLinkActive(item.path)
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveMenu(item.id)}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!isCollapsed && <span className="ml-3">{item.label}</span>}
                  </a>
                </Link>
              )}
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
                <a
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center' : ''
                  } p-2 rounded-md transition-colors text-gray-700 hover:bg-gray-100`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default Sidebar;