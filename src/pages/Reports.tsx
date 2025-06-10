import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, Download, Calendar, TrendingUp } from 'lucide-react';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Footer } from '../components/Footer';
import { Toast } from '../components/Toast';
import { getIncome, getExpenses, getInvestments, getSavingsGoals, getCurrentUser, exportToCSV } from '../lib/supabase';

export const Reports: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [reportData, setReportData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalInvestments: 0,
    totalSavings: 0,
    monthlyData: [] as any[],
    expenseCategories: [] as any[]
  });

  const mockReportData = {
    totalIncome: 12500,
    totalExpenses: 6800,
    totalInvestments: 4300,
    totalSavings: 8700,
    monthlyData: [
      { month: 'Aug', income: 4200, expenses: 2800 },
      { month: 'Sep', income: 4800, expenses: 3200 },
      { month: 'Oct', income: 5200, expenses: 2900 },
      { month: 'Nov', income: 4600, expenses: 3100 },
      { month: 'Dec', income: 5500, expenses: 3400 },
      { month: 'Jan', income: 5000, expenses: 2000 },
    ],
    expenseCategories: [
      { category: 'Marketing', amount: 2800, percentage: 41 },
      { category: 'Software', amount: 2000, percentage: 29 },
      { category: 'Travel', amount: 1200, percentage: 18 },
      { category: 'Supplies', amount: 800, percentage: 12 },
    ]
  };

  useEffect(() => {
    const loadReportData = async () => {
      const demoMode = localStorage.getItem('isDemoUser') === 'true';
      
      if (demoMode) {
        setIsDemoUser(true);
        setReportData(mockReportData);
        setLoading(false);
        return;
      }

      try {
        const { user } = await getCurrentUser();
        if (user) {
          const [incomeResult, expensesResult, investmentsResult, savingsResult] = await Promise.all([
            getIncome(user.id),
            getExpenses(user.id),
            getInvestments(user.id),
            getSavingsGoals(user.id)
          ]);

          const totalIncome = incomeResult.data?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
          const totalExpenses = expensesResult.data?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
          const totalInvestments = investmentsResult.data?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
          const totalSavings = savingsResult.data?.reduce((sum, item) => sum + Number(item.current_amount), 0) || 0;

          setReportData({
            totalIncome,
            totalExpenses,
            totalInvestments,
            totalSavings,
            monthlyData: mockReportData.monthlyData, // Use mock data for charts
            expenseCategories: mockReportData.expenseCategories
          });
        }
      } catch (error) {
        console.error('Error loading report data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, []);

  const handleExportPDF = () => {
    setToast({ message: 'PDF export feature coming soon!', type: 'error' });
  };

  const handleExportCSV = () => {
    const summaryData = [
      { Metric: 'Total Income', Value: reportData.totalIncome },
      { Metric: 'Total Expenses', Value: reportData.totalExpenses },
      { Metric: 'Total Investments', Value: reportData.totalInvestments },
      { Metric: 'Total Savings', Value: reportData.totalSavings },
      { Metric: 'Net Worth', Value: reportData.totalIncome - reportData.totalExpenses + reportData.totalInvestments + reportData.totalSavings },
      { Metric: 'Savings Rate (%)', Value: reportData.totalIncome > 0 ? Math.round(((reportData.totalIncome - reportData.totalExpenses) / reportData.totalIncome) * 100) : 0 }
    ];

    const today = new Date().toISOString().split('T')[0];
    exportToCSV(summaryData, `financial_report_${today}.csv`);
    setToast({ message: 'Financial report exported successfully!', type: 'success' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading reports...</p>
        </div>
      </div>
    );
  }

  const netWorth = reportData.totalIncome - reportData.totalExpenses + reportData.totalInvestments + reportData.totalSavings;
  const savingsRate = reportData.totalIncome > 0 ? Math.round(((reportData.totalIncome - reportData.totalExpenses) / reportData.totalIncome) * 100) : 0;

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader />
        
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Financial Reports
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive analysis of your financial performance
            </p>
          </div>

          {/* Action Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Report Period: Last 6 Months
                </span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleExportPDF}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
                <button 
                  onClick={handleExportCSV}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Worth</h3>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${netWorth.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Total assets minus liabilities
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Savings Rate</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {savingsRate}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Income saved vs spent
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Avg Income</h3>
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ${Math.round(reportData.totalIncome / 6).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Average over 6 months
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Avg Expenses</h3>
              </div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                ${Math.round(reportData.totalExpenses / 6).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Average over 6 months
              </p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Income vs Expenses Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Income vs Expenses Trend
                </h3>
              </div>

              <div className="space-y-4">
                {reportData.monthlyData.map((month, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {month.month}
                      </span>
                      <div className="flex gap-4 text-sm">
                        <span className="text-green-600 dark:text-green-400">
                          ${month.income.toLocaleString()}
                        </span>
                        <span className="text-red-600 dark:text-red-400">
                          ${month.expenses.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 h-4">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 rounded-l"
                        style={{ width: `${(month.income / Math.max(...reportData.monthlyData.map(m => m.income))) * 100}%` }}
                      />
                      <div 
                        className="bg-gradient-to-r from-red-500 to-red-600 rounded-r"
                        style={{ width: `${(month.expenses / Math.max(...reportData.monthlyData.map(m => m.income))) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Expenses</span>
                </div>
              </div>
            </div>

            {/* Expense Categories Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Expense Breakdown
                </h3>
              </div>

              <div className="space-y-4">
                {reportData.expenseCategories.map((category, index) => {
                  const colors = [
                    'from-blue-500 to-blue-600',
                    'from-purple-500 to-purple-600',
                    'from-green-500 to-green-600',
                    'from-orange-500 to-orange-600'
                  ];
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {category.category}
                        </span>
                        <div className="flex gap-2 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {category.percentage}%
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            ${category.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg h-3 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${colors[index]} rounded-lg transition-all duration-1000 ease-out`}
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    ${reportData.totalExpenses.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Health Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Financial Health Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {savingsRate >= 20 ? 'Excellent' : savingsRate >= 10 ? 'Good' : 'Needs Improvement'}
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">Savings Rate</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {savingsRate >= 20 ? 'You\'re saving well!' : savingsRate >= 10 ? 'Keep it up!' : 'Try to save more'}
                </p>
              </div>

              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {reportData.totalInvestments > reportData.totalExpenses ? 'Strong' : 'Growing'}
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">Investment Portfolio</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  ${reportData.totalInvestments.toLocaleString()} invested
                </p>
              </div>

              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {netWorth > 0 ? 'Positive' : 'Building'}
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">Net Worth</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  {netWorth > 0 ? 'Great progress!' : 'Keep building!'}
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};