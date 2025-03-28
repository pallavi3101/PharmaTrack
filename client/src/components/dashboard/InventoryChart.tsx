import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface InventoryStatus {
  in_stock: number;
  low_stock: number;
  out_of_stock: number;
}

interface InventoryChartProps {
  inventoryStatusData?: InventoryStatus;
}

const InventoryChart = ({ inventoryStatusData }: InventoryChartProps) => {
  const [chartData, setChartData] = useState<{ name: string; value: number; color: string }[]>([]);
  
  // Default data if none provided
  const defaultData: InventoryStatus = {
    in_stock: 142,
    low_stock: 37,
    out_of_stock: 18
  };

  useEffect(() => {
    const data = inventoryStatusData || defaultData;
    
    const formattedData = [
      { name: 'In Stock', value: data.in_stock, color: '#16a34a' },
      { name: 'Low Stock', value: data.low_stock, color: '#f59e0b' },
      { name: 'Out of Stock', value: data.out_of_stock, color: '#dc2626' }
    ];
    
    setChartData(formattedData);
  }, []);

  const totalItems = chartData.reduce((sum, item) => sum + item.value, 0);

  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-100">
          <p className="font-medium text-sm">{`${data.name}: ${data.value}`}</p>
          <p className="text-xs text-gray-500">{`${((data.value / totalItems) * 100).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <div className="flex justify-center mt-2 space-x-5">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-1"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-5 h-full"
      variants={chartVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Inventory Status</h3>
        <p className="text-sm text-gray-500">Current stock levels</p>
      </div>
      
      <div className="text-center mt-4 mb-2">
        <div className="text-3xl font-bold text-gray-800">{totalItems}</div>
        <div className="text-sm text-gray-500">Total Products</div>
      </div>
      
      <div className="h-[200px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              animationDuration={1500}
              animationBegin={300}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke={entry.color}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
        {chartData.map((item, index) => (
          <div key={index} className="text-center">
            <div className="text-sm font-medium" style={{ color: item.color }}>{item.value}</div>
            <div className="text-xs text-gray-500">{item.name}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default InventoryChart;