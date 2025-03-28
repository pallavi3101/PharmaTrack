import { motion } from 'framer-motion';
import { Link } from 'wouter';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  link: string;
  linkText: string;
  delay: number;
}

const StatCard = ({
  title,
  value,
  change,
  isPositive,
  icon,
  iconBg,
  iconColor,
  borderColor,
  link,
  linkText,
  delay
}: StatCardProps) => {
  return (
    <motion.div
      className={`stat-card ${borderColor}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay }}
    >
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`${iconBg} p-3 rounded-lg`}>
          <i className={`${icon} ${iconColor} text-lg`}></i>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
          <i className={`fas fa-arrow-${isPositive ? 'up' : 'down'} mr-1`}></i>
          <span>{change} since last month</span>
        </div>
        <Link href={link}>
          <a className="text-sm text-primary hover:underline">{linkText}</a>
        </Link>
      </div>
    </motion.div>
  );
};

const StatCards = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$24,780',
      change: '8.2%',
      isPositive: true,
      icon: 'fas fa-dollar-sign',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'stat-card-primary',
      link: '/sales',
      linkText: 'View sales',
      delay: 0.1
    },
    {
      title: 'Total Orders',
      value: '329',
      change: '5.4%',
      isPositive: true,
      icon: 'fas fa-shopping-cart',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      borderColor: 'stat-card-success',
      link: '/orders',
      linkText: 'View orders',
      delay: 0.2
    },
    {
      title: 'Low Stock Items',
      value: '37',
      change: '12.5%',
      isPositive: false,
      icon: 'fas fa-boxes',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      borderColor: 'stat-card-warning',
      link: '/inventory',
      linkText: 'View inventory',
      delay: 0.3
    },
    {
      title: 'New Customers',
      value: '48',
      change: '9.1%',
      isPositive: true,
      icon: 'fas fa-users',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      borderColor: 'stat-card-info',
      link: '/customers',
      linkText: 'View customers',
      delay: 0.4
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatCards;