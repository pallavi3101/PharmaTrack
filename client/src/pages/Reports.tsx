import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, LineChart, PieChart, Download, TrendingUp, 
  DollarSign, Calendar, FileText, ArrowUpRight, 
  ChevronDown, BarChart, Printer, Activity 
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, BarChart as ReBarChart, Bar,
  PieChart as RePieChart, Pie, Cell
} from 'recharts';
import { useToast } from "@/hooks/use-toast";
import { exportToExcel, exportToCSV } from '@/utils/fileUtils';
import { generateSalesForecast } from '@/utils/aiUtils';

// Sample data for the reports
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Daily sales data
const dailySalesData = [
  { date: '2024-03-01', revenue: 12500, units: 120 },
  { date: '2024-03-02', revenue: 11200, units: 105 },
  { date: '2024-03-03', revenue: 9800, units: 90 },
  { date: '2024-03-04', revenue: 15200, units: 140 },
  { date: '2024-03-05', revenue: 13800, units: 125 },
  { date: '2024-03-06', revenue: 14500, units: 135 },
  { date: '2024-03-07', revenue: 16200, units: 150 },
  { date: '2024-03-08', revenue: 17500, units: 165 },
  { date: '2024-03-09', revenue: 16800, units: 155 },
  { date: '2024-03-10', revenue: 14200, units: 130 },
  { date: '2024-03-11', revenue: 13900, units: 125 },
  { date: '2024-03-12', revenue: 15600, units: 145 },
  { date: '2024-03-13', revenue: 16100, units: 150 },
  { date: '2024-03-14', revenue: 17200, units: 160 }
];

// Monthly sales growth comparison
const salesGrowthData = [
  { month: 'Jan', currentYear: 42000, previousYear: 35000 },
  { month: 'Feb', currentYear: 44500, previousYear: 37200 },
  { month: 'Mar', currentYear: 48000, previousYear: 39100 },
  { month: 'Apr', currentYear: 46500, previousYear: 40500 },
  { month: 'May', currentYear: 49700, previousYear: 41200 },
  { month: 'Jun', currentYear: 52300, previousYear: 43500 },
  { month: 'Jul', currentYear: 54800, previousYear: 45200 },
  { month: 'Aug', currentYear: 56100, previousYear: 46800 },
  { month: 'Sep', currentYear: 57400, previousYear: 47500 },
  { month: 'Oct', currentYear: 59800, previousYear: 49200 },
  { month: 'Nov', currentYear: 62100, previousYear: 50800 },
  { month: 'Dec', currentYear: 65500, previousYear: 52300 }
];

// Purchases by supplier
const purchaseBySupplierData = [
  { name: 'Sun Pharma', value: 35000 },
  { name: 'Cipla', value: 28000 },
  { name: 'GSK', value: 22000 },
  { name: 'Abbott', value: 18000 },
  { name: 'Pfizer', value: 25000 },
  { name: 'Others', value: 12000 }
];

// Purchases by product category
const purchaseByProductCategoryData = [
  { name: 'Antibiotics', value: 28000 },
  { name: 'Analgesics', value: 22000 },
  { name: 'Antidiabetics', value: 18000 },
  { name: 'Cardiovascular', value: 25000 },
  { name: 'Supplements', value: 15000 },
  { name: 'Others', value: 12000 }
];

// Profit by product category
const profitByProductCategoryData = [
  { name: 'Antibiotics', revenue: 48000, cogs: 28000, profit: 20000, margin: 41.67 },
  { name: 'Analgesics', revenue: 42000, cogs: 22000, profit: 20000, margin: 47.62 },
  { name: 'Antidiabetics', revenue: 38000, cogs: 18000, profit: 20000, margin: 52.63 },
  { name: 'Cardiovascular', revenue: 55000, cogs: 25000, profit: 30000, margin: 54.55 },
  { name: 'Supplements', revenue: 32000, cogs: 15000, profit: 17000, margin: 53.13 },
  { name: 'Others', revenue: 25000, cogs: 12000, profit: 13000, margin: 52.00 }
];

// Profit margin over time
const profitMarginOverTimeData = [
  { month: 'Jan', margin: 42.3 },
  { month: 'Feb', margin: 43.1 },
  { month: 'Mar', margin: 44.2 },
  { month: 'Apr', margin: 43.8 },
  { month: 'May', margin: 45.1 },
  { month: 'Jun', margin: 46.5 },
  { month: 'Jul', margin: 45.9 },
  { month: 'Aug', margin: 47.2 },
  { month: 'Sep', margin: 48.4 },
  { month: 'Oct', margin: 49.1 },
  { month: 'Nov', margin: 50.3 },
  { month: 'Dec', margin: 51.8 }
];

const Reports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState('this-month');
  const [selectedReportFormat, setSelectedReportFormat] = useState('excel');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [salesPrediction, setSalesPrediction] = useState<{prediction: number, explanation: string} | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    // Set default dates to current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(lastDay.toISOString().split('T')[0]);
    
    // Generate a sales prediction using the ML model
    generateSalesForecast(salesGrowthData.map(item => ({
      month: item.month,
      sales: item.currentYear
    }))).then(result => {
      setSalesPrediction(result);
    }).catch(error => {
      console.error("Error generating prediction:", error);
    });
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleReportClick = (reportId: string) => {
    setActiveReport(reportId);
  };

  const closeReportDetail = () => {
    setActiveReport(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleExportReport = (reportType: string, format: 'excel' | 'csv') => {
    setIsGeneratingReport(true);
    
    // Simulate processing delay
    setTimeout(() => {
      let data: any[] = [];
      let columns: { key: string, header: string }[] = [];
      let filename = '';
      
      // Configure export based on report type
      if (reportType === 'sales') {
        data = dailySalesData;
        columns = [
          { key: 'date', header: 'Date' },
          { key: 'revenue', header: 'Revenue (INR)' },
          { key: 'units', header: 'Units Sold' }
        ];
        filename = 'PharmaTrack_Sales_Report';
      } else if (reportType === 'purchase') {
        data = purchaseBySupplierData.map(item => ({
          supplier: item.name,
          amount: item.value
        }));
        columns = [
          { key: 'supplier', header: 'Supplier' },
          { key: 'amount', header: 'Purchase Amount (INR)' }
        ];
        filename = 'PharmaTrack_Purchase_Report';
      } else if (reportType === 'profit') {
        data = profitByProductCategoryData;
        columns = [
          { key: 'name', header: 'Category' },
          { key: 'revenue', header: 'Revenue (INR)' },
          { key: 'cogs', header: 'Cost of Goods (INR)' },
          { key: 'profit', header: 'Profit (INR)' },
          { key: 'margin', header: 'Margin (%)' }
        ];
        filename = 'PharmaTrack_Profit_Report';
      }
      
      // Export the data in the selected format
      if (format === 'excel') {
        exportToExcel(data, columns, filename);
      } else {
        exportToCSV(data, columns, filename);
      }
      
      setIsGeneratingReport(false);
      
      toast({
        title: "Report Generated",
        description: `Your ${reportType} report has been downloaded in ${format.toUpperCase()} format.`,
      });
    }, 1500);
  };

  const handlePrintReport = () => {
    window.print();
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

  const reportCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const reports = [
    {
      id: 'sales',
      title: 'Sales Report',
      description: 'View sales trends, revenue, and best-selling products',
      icon: <LineChart className="h-10 w-10 text-blue-500" />,
      color: 'bg-blue-50 border-blue-200',
      path: '/reports/sales'
    },
    {
      id: 'purchase',
      title: 'Purchase Report',
      description: 'Track purchases, suppliers, and inventory costs',
      icon: <BarChart3 className="h-10 w-10 text-green-500" />,
      color: 'bg-green-50 border-green-200',
      path: '/reports/purchases'
    },
    {
      id: 'profit',
      title: 'Profit Report',
      description: 'Analyze profit margins and revenue growth',
      icon: <PieChart className="h-10 w-10 text-purple-500" />,
      color: 'bg-purple-50 border-purple-200',
      path: '/reports/profits'
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
          {activeReport ? (
            <>
              {/* Detailed Report View */}
              <div className="mb-4 flex items-center">
                <Button 
                  variant="ghost" 
                  className="mr-2" 
                  onClick={closeReportDetail}
                >
                  <ChevronDown className="h-4 w-4 mr-1 transform rotate-90" />
                  <span>Back to Reports</span>
                </Button>
                <h1 className="text-2xl font-bold text-gray-800">
                  {reports.find(r => r.id === activeReport)?.title}
                </h1>
              </div>
              
              {/* Detailed Report Content */}
              {activeReport === 'sales' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-xl font-semibold">Sales Reports</h2>
                      <p className="text-gray-600">Analyze sales trends and performance metrics</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center" 
                        onClick={() => handleExportReport('sales', 'excel')}
                        disabled={isGeneratingReport}
                      >
                        {isGeneratingReport ? (
                          <><RefreshCw className="h-4 w-4 mr-1 animate-spin" /> Processing...</>
                        ) : (
                          <><Download className="h-4 w-4 mr-1" /> Excel</>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center"
                        onClick={() => handleExportReport('sales', 'csv')}
                        disabled={isGeneratingReport}
                      >
                        {isGeneratingReport ? (
                          <><RefreshCw className="h-4 w-4 mr-1 animate-spin" /> Processing...</>
                        ) : (
                          <><Download className="h-4 w-4 mr-1" /> CSV</>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center"
                        onClick={handlePrintReport}
                      >
                        <Printer className="h-4 w-4 mr-1" /> Print
                      </Button>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="daily-sales">
                    <TabsList className="mb-4">
                      <TabsTrigger value="daily-sales">Daily Sales Trends</TabsTrigger>
                      <TabsTrigger value="sales-growth">Sales Growth Comparison</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="daily-sales" className="space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Daily Sales Trends</CardTitle>
                          <CardDescription>Total revenue and units sold per day</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <ReLineChart
                                data={dailySalesData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                  dataKey="date" 
                                  tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return `${date.getDate()}/${date.getMonth() + 1}`;
                                  }}
                                />
                                <YAxis 
                                  yAxisId="left"
                                  tickFormatter={(value) => `₹${value/1000}k`}
                                />
                                <YAxis 
                                  yAxisId="right" 
                                  orientation="right" 
                                  tickFormatter={(value) => `${value} units`}
                                />
                                <Tooltip 
                                  formatter={(value, name) => {
                                    if (name === 'revenue') {
                                      return [`₹${value}`, 'Revenue'];
                                    }
                                    return [`${value} units`, 'Units Sold'];
                                  }}
                                  labelFormatter={(label) => {
                                    const date = new Date(label);
                                    return date.toLocaleDateString('en-US', { 
                                      weekday: 'short', 
                                      year: 'numeric', 
                                      month: 'short', 
                                      day: 'numeric' 
                                    });
                                  }}
                                />
                                <Legend />
                                <Line 
                                  yAxisId="left"
                                  type="monotone" 
                                  dataKey="revenue" 
                                  name="Revenue" 
                                  stroke="#0088FE" 
                                  activeDot={{ r: 8 }} 
                                />
                                <Line 
                                  yAxisId="right"
                                  type="monotone" 
                                  dataKey="units" 
                                  name="Units Sold" 
                                  stroke="#00C49F" 
                                />
                              </ReLineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="sales-growth" className="space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Sales Growth Comparison</CardTitle>
                          <CardDescription>Compare sales between current and previous year</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <ReBarChart
                                data={salesGrowthData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis tickFormatter={(value) => `₹${value/1000}k`} />
                                <Tooltip 
                                  formatter={(value) => [`₹${value}`, '']}
                                />
                                <Legend />
                                <Bar 
                                  dataKey="currentYear" 
                                  name="Current Year" 
                                  fill="#0088FE" 
                                />
                                <Bar 
                                  dataKey="previousYear" 
                                  name="Previous Year" 
                                  fill="#00C49F" 
                                />
                              </ReBarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {salesPrediction && (
                        <Card className="bg-blue-50">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center">
                              <Activity className="h-5 w-5 mr-2 text-blue-500" />
                              AI-Powered Sales Prediction
                            </CardTitle>
                            <CardDescription>ML model forecast for next month's sales</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-white p-4 rounded-lg shadow-sm border">
                              <div className="flex items-center mb-2">
                                <div className="text-2xl font-bold text-blue-600 mr-2">
                                  {formatCurrency(salesPrediction.prediction)}
                                </div>
                                <Badge className="bg-blue-500">+4.3%</Badge>
                              </div>
                              <p className="text-gray-600">{salesPrediction.explanation}</p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              )}
              
              {activeReport === 'purchase' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-xl font-semibold">Purchase Reports</h2>
                      <p className="text-gray-600">Track inventory purchases and supplier performance</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center" 
                        onClick={() => handleExportReport('purchase', 'excel')}
                        disabled={isGeneratingReport}
                      >
                        {isGeneratingReport ? (
                          <><RefreshCw className="h-4 w-4 mr-1 animate-spin" /> Processing...</>
                        ) : (
                          <><Download className="h-4 w-4 mr-1" /> Excel</>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center"
                        onClick={() => handleExportReport('purchase', 'csv')}
                        disabled={isGeneratingReport}
                      >
                        {isGeneratingReport ? (
                          <><RefreshCw className="h-4 w-4 mr-1 animate-spin" /> Processing...</>
                        ) : (
                          <><Download className="h-4 w-4 mr-1" /> CSV</>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center"
                        onClick={handlePrintReport}
                      >
                        <Printer className="h-4 w-4 mr-1" /> Print
                      </Button>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="by-supplier">
                    <TabsList className="mb-4">
                      <TabsTrigger value="by-supplier">Purchase by Supplier</TabsTrigger>
                      <TabsTrigger value="by-category">Purchase by Category</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="by-supplier" className="space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Purchase by Supplier</CardTitle>
                          <CardDescription>Breakdown of purchases by supplier</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <RePieChart>
                                <Pie
                                  data={purchaseBySupplierData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={true}
                                  outerRadius={130}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, value, percent }) => `${name}: ${formatCurrency(value)} (${(percent * 100).toFixed(0)}%)`}
                                >
                                  {purchaseBySupplierData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  formatter={(value) => formatCurrency(value as number)}
                                />
                              </RePieChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Purchase Details</CardTitle>
                          <CardDescription>Total purchases by supplier</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 gap-4">
                            {purchaseBySupplierData.map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center">
                                  <div 
                                    className="w-4 h-4 rounded-full mr-3" 
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                  ></div>
                                  <span className="font-medium">{item.name}</span>
                                </div>
                                <span className="font-semibold">{formatCurrency(item.value)}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="by-category" className="space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Purchase by Product Category</CardTitle>
                          <CardDescription>Breakdown of purchases by category</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <ReBarChart
                                data={purchaseByProductCategoryData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                layout="vertical"
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" tickFormatter={(value) => `₹${value/1000}k`} />
                                <YAxis type="category" dataKey="name" width={120} />
                                <Tooltip 
                                  formatter={(value) => formatCurrency(value as number)}
                                />
                                <Bar 
                                  dataKey="value" 
                                  fill="#8884d8"
                                >
                                  {purchaseByProductCategoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Bar>
                              </ReBarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
              
              {activeReport === 'profit' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-xl font-semibold">Profit Reports</h2>
                      <p className="text-gray-600">Analyze profit margins and financial performance</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center" 
                        onClick={() => handleExportReport('profit', 'excel')}
                        disabled={isGeneratingReport}
                      >
                        {isGeneratingReport ? (
                          <><RefreshCw className="h-4 w-4 mr-1 animate-spin" /> Processing...</>
                        ) : (
                          <><Download className="h-4 w-4 mr-1" /> Excel</>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center"
                        onClick={() => handleExportReport('profit', 'csv')}
                        disabled={isGeneratingReport}
                      >
                        {isGeneratingReport ? (
                          <><RefreshCw className="h-4 w-4 mr-1 animate-spin" /> Processing...</>
                        ) : (
                          <><Download className="h-4 w-4 mr-1" /> CSV</>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center"
                        onClick={handlePrintReport}
                      >
                        <Printer className="h-4 w-4 mr-1" /> Print
                      </Button>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="by-category">
                    <TabsList className="mb-4">
                      <TabsTrigger value="by-category">Profit by Category</TabsTrigger>
                      <TabsTrigger value="margin-over-time">Profit Margin Over Time</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="by-category" className="space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Profit by Product Category</CardTitle>
                          <CardDescription>Revenue, cost, and profit margin per category</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <ReBarChart
                                data={profitByProductCategoryData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(value) => `₹${value/1000}k`} />
                                <Tooltip 
                                  formatter={(value, name) => {
                                    if (name === 'margin') {
                                      return [`${value}%`, 'Margin'];
                                    }
                                    return [formatCurrency(value as number), ''];
                                  }}
                                />
                                <Legend />
                                <Bar dataKey="revenue" name="Revenue" fill="#0088FE" />
                                <Bar dataKey="cogs" name="Cost of Goods" fill="#FFBB28" />
                                <Bar dataKey="profit" name="Profit" fill="#00C49F" />
                              </ReBarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Profit Margins by Category</CardTitle>
                          <CardDescription>Profit margin percentage by product category</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 gap-4">
                            {profitByProductCategoryData.map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  <span className="font-medium w-32">{item.name}</span>
                                  <div className="w-40 bg-gray-200 rounded-full h-2.5">
                                    <div 
                                      className="bg-purple-600 h-2.5 rounded-full" 
                                      style={{ width: `${item.margin}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <span className="font-semibold w-20 text-right">{item.margin.toFixed(1)}%</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="margin-over-time" className="space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Profit Margin Over Time</CardTitle>
                          <CardDescription>Profit margin trends over the past year</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <ReLineChart
                                data={profitMarginOverTimeData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis 
                                  domain={[40, 55]} 
                                  tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip 
                                  formatter={(value) => [`${value}%`, 'Profit Margin']}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="margin"
                                  stroke="#8884d8"
                                  activeDot={{ r: 8 }}
                                  strokeWidth={2}
                                />
                                <Legend />
                              </ReLineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-purple-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Profit Margin Analysis</CardTitle>
                          <CardDescription>Year-to-date profit margin performance</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="flex items-center mb-2">
                              <div className="text-2xl font-bold text-purple-600 mr-2">
                                48.6%
                              </div>
                              <Badge className="bg-green-500">+3.2% YoY</Badge>
                            </div>
                            <p className="text-gray-600">Average profit margin across all categories has increased by 3.2% compared to the previous year. Cardiovascular products show the highest margin at 54.55%.</p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Reports Dashboard View */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
                <p className="text-gray-600 mt-1">Monitor your pharmacy's performance and make data-driven decisions</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {reports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    className={`border rounded-lg shadow-sm overflow-hidden ${report.color} cursor-pointer hover:shadow-md transition-shadow`}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={reportCardVariants}
                    onClick={() => handleReportClick(report.id)}
                  >
                    <div className="p-6">
                      <div className="mb-4">
                        {report.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{report.title}</h3>
                      <p className="text-gray-600 mb-4">{report.description}</p>
                      <div className="flex justify-between items-center">
                        <button className="text-primary hover:underline text-sm font-medium">
                          View Report
                        </button>
                        <button 
                          className="p-2 rounded-full hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExportReport(report.id, 'excel');
                          }}
                        >
                          <Download className="h-5 w-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    {report.id === 'sales' && (
                      <div className="h-32 bg-white p-4 border-t">
                        {/* Sales Chart Preview */}
                        <div className="w-full h-full flex items-center">
                          <div className="flex-1 h-full flex items-end space-x-2">
                            <div className="bg-blue-500 w-1/12 h-[30%] rounded-t"></div>
                            <div className="bg-blue-500 w-1/12 h-[40%] rounded-t"></div>
                            <div className="bg-blue-500 w-1/12 h-[35%] rounded-t"></div>
                            <div className="bg-blue-500 w-1/12 h-[60%] rounded-t"></div>
                            <div className="bg-blue-500 w-1/12 h-[50%] rounded-t"></div>
                            <div className="bg-blue-500 w-1/12 h-[70%] rounded-t"></div>
                            <div className="bg-blue-500 w-1/12 h-[65%] rounded-t"></div>
                            <div className="bg-blue-500 w-1/12 h-[90%] rounded-t"></div>
                            <div className="bg-blue-500 w-1/12 h-[85%] rounded-t"></div>
                            <div className="bg-blue-500 w-1/12 h-[75%] rounded-t"></div>
                            <div className="bg-blue-500 w-1/12 h-[60%] rounded-t"></div>
                            <div className="bg-blue-500 w-1/12 h-[80%] rounded-t"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {report.id === 'purchase' && (
                      <div className="h-32 bg-white p-4 border-t">
                        {/* Purchase Chart Preview */}
                        <div className="w-full h-full flex items-center">
                          <div className="flex-1 h-full flex items-end space-x-2">
                            <div className="bg-green-500 w-1/12 h-[65%] rounded-t"></div>
                            <div className="bg-green-500 w-1/12 h-[45%] rounded-t"></div>
                            <div className="bg-green-500 w-1/12 h-[55%] rounded-t"></div>
                            <div className="bg-green-500 w-1/12 h-[40%] rounded-t"></div>
                            <div className="bg-green-500 w-1/12 h-[60%] rounded-t"></div>
                            <div className="bg-green-500 w-1/12 h-[50%] rounded-t"></div>
                            <div className="bg-green-500 w-1/12 h-[55%] rounded-t"></div>
                            <div className="bg-green-500 w-1/12 h-[70%] rounded-t"></div>
                            <div className="bg-green-500 w-1/12 h-[65%] rounded-t"></div>
                            <div className="bg-green-500 w-1/12 h-[55%] rounded-t"></div>
                            <div className="bg-green-500 w-1/12 h-[70%] rounded-t"></div>
                            <div className="bg-green-500 w-1/12 h-[60%] rounded-t"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {report.id === 'profit' && (
                      <div className="h-32 bg-white p-4 border-t">
                        {/* Profit Chart Preview */}
                        <div className="w-full h-full">
                          <div className="flex h-full items-center justify-center">
                            <div className="relative h-24 w-24 rounded-full">
                              <div className="absolute inset-0 rounded-full border-8 border-purple-500" style={{ 
                                clipPath: 'polygon(50% 50%, 0% 0%, 100% 0%, 100% 100%, 75% 100%, 50% 75%, 25% 100%, 0% 100%)'
                              }}></div>
                              <div className="absolute inset-0 rounded-full border-8 border-purple-200"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-sm font-bold text-purple-500">65%</div>
                              </div>
                            </div>
                            <div className="ml-4 text-xs space-y-1">
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-purple-500 rounded-sm mr-1"></div>
                                <span>Gross Profit</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-purple-200 rounded-sm mr-1"></div>
                                <span>Expenses</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-800">Quick Report Generation</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Date Range Report</h4>
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                          <input 
                            type="date"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                          <input 
                            type="date"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                        <Select defaultValue="sales" onValueChange={(value) => console.log(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sales">Sales Report</SelectItem>
                            <SelectItem value="purchase">Purchase Report</SelectItem>
                            <SelectItem value="profit">Profit Report</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                        <Select 
                          defaultValue="excel" 
                          onValueChange={(value) => setSelectedReportFormat(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excel">Excel (.xls)</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={() => handleExportReport('sales', selectedReportFormat as 'excel' | 'csv')}
                        disabled={isGeneratingReport}
                        className="mt-2"
                      >
                        {isGeneratingReport ? (
                          <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                        ) : (
                          <>Generate Report</>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Predefined Reports</h4>
                    <div className="space-y-3">
                      <button 
                        className="w-full flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 transition-colors"
                        onClick={() => handleExportReport('sales', 'excel')}
                      >
                        <span className="font-medium">Today's Sales Summary</span>
                        <Download className="h-4 w-4" />
                      </button>
                      <button 
                        className="w-full flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 transition-colors"
                        onClick={() => handleExportReport('sales', 'excel')}
                      >
                        <span className="font-medium">This Week's Performance</span>
                        <Download className="h-4 w-4" />
                      </button>
                      <button 
                        className="w-full flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 transition-colors"
                        onClick={() => handleExportReport('purchase', 'excel')}
                      >
                        <span className="font-medium">Monthly Purchase Report</span>
                        <Download className="h-4 w-4" />
                      </button>
                      <button 
                        className="w-full flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 transition-colors"
                        onClick={() => handleExportReport('profit', 'excel')}
                      >
                        <span className="font-medium">Profit Analysis Report</span>
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.main>
      </div>
    </div>
  );
};

export default Reports;