import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlySalesData {
  month: number;
  total_amount: number;
}

interface SalesChartProps {
  monthlySalesData?: MonthlySalesData[];
  predictedSales?: number;
}

const SalesChart = ({ monthlySalesData = [], predictedSales }: SalesChartProps) => {
  const [chartData, setChartData] = useState<MonthlySalesData[]>([]);
  const [yearToDate, setYearToDate] = useState<number>(0);
  const [previousYearSame, setPreviousYearSame] = useState<number>(0);
  const [percentChange, setPercentChange] = useState<number>(0);
  const [isPositive, setIsPositive] = useState<boolean>(true);

  // Generate mock data if no data provided
  useEffect(() => {
    if (monthlySalesData.length === 0) {
      const months = [
        { month: 1, total_amount: 12500 },
        { month: 2, total_amount: 14300 },
        { month: 3, total_amount: 15600 },
        { month: 4, total_amount: 13800 },
        { month: 5, total_amount: 16200 },
        { month: 6, total_amount: 18700 },
        { month: 7, total_amount: 17900 },
        { month: 8, total_amount: 19200 },
        { month: 9, total_amount: 21800 },
        { month: 10, total_amount: 23700 },
        { month: 11, total_amount: 25100 },
        { month: 12, total_amount: 27600 }
      ];
      setChartData(months);
      
      // Calculate year to date total (sum of all months)
      const ytd = months.reduce((acc, curr) => acc + curr.total_amount, 0);
      setYearToDate(ytd);
      
      // Mock previous year same period (slightly lower for positive growth)
      const prevYear = ytd * 0.85;
      setPreviousYearSame(prevYear);
      
      // Calculate percent change
      const change = ((ytd - prevYear) / prevYear) * 100;
      setPercentChange(parseFloat(change.toFixed(1)));
      setIsPositive(change > 0);
    } else {
      setChartData(monthlySalesData);
      // Calculate actual metrics from provided data
      // ... (similar calculations using real data)
    }
  }, []);

  const getMonthName = (month: number): string => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[month - 1];
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-5"
      variants={chartVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Sales Overview</h3>
          <p className="text-sm text-gray-500">Monthly revenue performance</p>
        </div>
        <div className="mt-2 md:mt-0 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center">
          <span className="text-sm font-medium text-gray-700 mr-2">YTD:</span>
          <span className="text-sm font-medium text-gray-900">{formatCurrency(yearToDate)}</span>
          <div className={`ml-2 flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            <span className="text-xs font-medium ml-1">{percentChange}%</span>
          </div>
        </div>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a56db" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1a56db" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={getMonthName}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={(value) => `$${value/1000}k`}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), 'Revenue']}
              labelFormatter={(label: number) => `${getMonthName(label)}`}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="total_amount" 
              stroke="#1a56db" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorSales)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {predictedSales && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Predicted Next Month</span>
            <span className="font-semibold text-gray-900">{formatCurrency(predictedSales)}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SalesChart;