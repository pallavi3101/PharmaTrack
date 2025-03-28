import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface AlertBannerProps {
  message: string;
  count?: number;
  onClose?: () => void;
}

const AlertBanner = ({ message, count = 0, onClose }: AlertBannerProps) => {
  return (
    <motion.div 
      className="bg-amber-50 border border-amber-200 rounded-lg p-4 relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-amber-800">
              {message}
              {count > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-200 text-amber-800">
                  {count} {count === 1 ? 'item' : 'items'}
                </span>
              )}
            </p>
            {onClose && (
              <button
                type="button"
                className="inline-flex bg-amber-50 rounded-md p-1.5 text-amber-500 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                onClick={onClose}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="mt-1 text-sm text-amber-700">
            Please review these items promptly to ensure inventory accuracy and compliance.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AlertBanner;