import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';

interface QuickActionButtonProps {
  icon: string;
  label: string;
  action: string;
  bgColor: string;
  textColor: string;
  onClick: (action: string) => void;
}

const QuickActionButton = ({
  icon,
  label,
  action,
  bgColor,
  textColor,
  onClick
}: QuickActionButtonProps) => {
  return (
    <motion.button
      className={`${bgColor} ${textColor} p-4 rounded-lg flex flex-col items-center justify-center h-28 w-full`}
      onClick={() => onClick(action)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <i className={`${icon} text-2xl mb-2`}></i>
      <span className="text-sm text-center">{label}</span>
    </motion.button>
  );
};

interface StatusItemProps {
  name: string;
  status: "online" | "syncing" | "offline";
}

const StatusItem = ({ name, status }: StatusItemProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'syncing': return 'bg-amber-500';
      case 'offline': return 'bg-red-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online': return 'Online';
      case 'syncing': return 'Syncing';
      case 'offline': return 'Offline';
    }
  };

  return (
    <div className="flex items-center justify-between p-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-700">{name}</span>
      <div className="flex items-center">
        <span className={`w-2 h-2 rounded-full ${getStatusColor()} mr-2`}></span>
        <span className="text-xs text-gray-500">{getStatusText()}</span>
      </div>
    </div>
  );
};

const QuickActions = () => {
  const [, navigate] = useLocation();
  const [systemStatuses] = useState<StatusItemProps[]>([
    { name: 'Inventory System', status: 'online' },
    { name: 'POS Terminal', status: 'online' },
    { name: 'Backup Service', status: 'online' },
    { name: 'Cloud Sync', status: 'syncing' }
  ]);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-inventory':
        navigate('/inventory');
        break;
      case 'add-customer':
        navigate('/customers');
        break;
      case 'new-sale':
        navigate('/counters');
        break;
      case 'reports':
        navigate('/reports');
        break;
      default:
        break;
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <QuickActionButton
          icon="fas fa-box-open"
          label="Add Inventory"
          action="add-inventory"
          bgColor="bg-blue-50"
          textColor="text-blue-700"
          onClick={handleQuickAction}
        />
        <QuickActionButton
          icon="fas fa-user-plus"
          label="Add Customer"
          action="add-customer"
          bgColor="bg-purple-50"
          textColor="text-purple-700"
          onClick={handleQuickAction}
        />
        <QuickActionButton
          icon="fas fa-cash-register"
          label="New Sale"
          action="new-sale"
          bgColor="bg-green-50"
          textColor="text-green-700"
          onClick={handleQuickAction}
        />
        <QuickActionButton
          icon="fas fa-file-alt"
          label="View Reports"
          action="reports"
          bgColor="bg-amber-50"
          textColor="text-amber-700"
          onClick={handleQuickAction}
        />
      </div>

      <div className="mt-4 pt-2 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-2">System Status</h4>
        <div className="bg-gray-50 rounded-md p-2">
          {systemStatuses.map((item, index) => (
            <StatusItem key={index} name={item.name} status={item.status} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default QuickActions;