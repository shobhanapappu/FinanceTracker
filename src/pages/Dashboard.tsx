import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, CreditCard, TrendingUp, Target } from 'lucide-react';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { MetricCard } from '../components/dashboard/MetricCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { AIInsights } from '../components/dashboard/AIInsights';
import { FinancialHealth } from '../components/dashboard/FinancialHealth';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { Charts } from '../components/dashboard/Charts';
import { DemoBanner } from '../components/dashboard/DemoBanner';
import { Footer } from '../components/Footer';
import { Toast } from '../components/Toast';
import { 
  getCurrentUser, 
  getIncome, 
  getExpenses, 
  getInvestments, 
  getSavingsGoals,
  getMonthlyData,
  getExpensesByCategory
} from '../lib/supabase';

export const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [metrics, setMetrics] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalInvestments: 0,
    totalSavings: 0,
  });
  const [chartData, setChartData] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();

  // Demo data for demo users
  const demoMetrics = {
    totalIncome: 5000,
    totalExpenses: 2000,
    totalInvestments: 1000,
    totalSavings: 500,
  };

  const demoChartData = {
    monthlyData: [
      { month: 'Aug', income: 4200, expenses: 2800 },
      { month: 'Sep', income: 4800, expenses: 3200 },
      { month: 'Oct', income: 5200, expenses: 2900 },
      { month: 'Nov', income: 4600, expenses: 3100 },
      { month: 'Dec', income: 5500, expenses: 3400 },
      { month: 'Jan', income: 5000, expenses: 2000 },
    ],
    expenseCategories: [
      { category: 'Marketing', amount: 800, percentage: 40 },
      { category: 'Travel', amount: 600, percentage: 30 },
      { category: 'Supplies', amount: 400, percentage: 20 },
      { category: 'Software', amount: 200, percentage: 10 },
    ],
  };

  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is in demo mode
      const demoMode = localStorage.getItem('isDemoUser') === 'true';
      
      if (demoMode) {
        setIsDemoUser(true);
        setMetrics(demoMetrics);
        setChartData(demoChartData);
        setLoading(false);
        return;
      }

      // Check for authenticated user
      const { user } = await getCurrentUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      
      setUser(user);
      await loadDashboardData(user.id);
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const loadDashboardData = async (userId: string) => {
    try {
      // Load all financial data
      const [incomeResult, expensesResult, investmentsResult, savingsResult] = await Promise.all([
        getIncome(userId),
        getExpenses(userId),
        getInvestments(userId),
        getSavingsGoals(userId)
      ]);

      // Calculate totals
      const totalIncome = incomeResult.data?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
      const totalExpenses = expensesResult.data?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
      const totalInvestments = investmentsResult.data?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
      const totalSavings = savingsResult.data?.reduce((sum, item) => sum + Number(item.current_amount), 0) || 0;

      setMetrics({
        totalIncome,
        totalExpenses,
        totalInvestments,
        totalSavings,
      });

      // Load chart data
      const [monthlyResult, categoryResult] = await Promise.all([
        getMonthlyData(userId),
        getExpensesByCategory(userId)
      ]);

      // Process monthly data
      const monthlyData = processMonthlyData(monthlyResult.incomeData, monthlyResult.expenseData);
      
      // Process category data
      const expenseCategories = processCategoryData(categoryResult.data);

      setChartData({
        monthlyData,
        expenseCategories,
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const processMonthlyData = (incomeData: any[], expenseData: any[]) => {
    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    const monthlyTotals = months.map(month => {
      const monthIndex = new Date().getMonth() - (months.length - 1 - months.indexOf(month));
      const targetDate = new Date();
      targetDate.setMonth(monthIndex);
      const monthStr = targetDate.toISOString().slice(0, 7);

      const income = incomeData?.filter(item => item.date.startsWith(monthStr))
        .reduce((sum, item) => sum + Number(item.amount), 0) || 0;
      
      const expenses = expenseData?.filter(item => item.date.startsWith(monthStr))
        .reduce((sum, item) => sum + Number(item.amount), 0) || 0;

      return { month, income, expenses };
    });

    return monthlyTotals;
  };

  const processCategoryData = (expenseData: any[]) => {
    if (!expenseData || expenseData.length === 0) return [];

    const categoryTotals = expenseData.reduce((acc, expense) => {
      const category = expense.category;
      acc[category] = (acc[category] || 0) + Number(expense.amount);
      return acc;
    }, {});

    const total = Object.values(categoryTotals).reduce((sum: number, amount: any) => sum + amount, 0);

    return Object.entries(categoryTotals).map(([category, amount]: [string, any]) => ({
      category,
      amount,
      percentage: Math.round((amount / total) * 100)
    }));
  };

  const handleQuickActionSuccess = (message: string) => {
    setToast({ message, type: 'success' });
    // Reload dashboard data
    if (user) {
      loadDashboardData(user.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader />
        
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Demo Banner */}
          {isDemoUser && <DemoBanner />}

          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {isDemoUser ? 'Demo User' : user?.email?.split('@')[0] || 'User'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isDemoUser 
                ? "You're viewing the demo version. Sign up to start tracking your finances."
                : "Here's an overview of your financial activity"
              }
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Income"
              amount={metrics.totalIncome}
              icon={DollarSign}
              color="bg-gradient-to-br from-green-500 to-green-600"
            />
            <MetricCard
              title="Total Expenses"
              amount={metrics.totalExpenses}
              icon={CreditCard}
              color="bg-gradient-to-br from-red-500 to-red-600"
            />
            <MetricCard
              title="Total Investments"
              amount={metrics.totalInvestments}
              icon={TrendingUp}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <MetricCard
              title="Total Savings"
              amount={metrics.totalSavings}
              icon={Target}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <QuickActions 
              isDemoUser={isDemoUser} 
              onSuccess={handleQuickActionSuccess}
            />
          </div>

          {/* AI Insights and Financial Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AIInsights />
            <FinancialHealth 
              totalIncome={metrics.totalIncome} 
              totalExpenses={metrics.totalExpenses} 
            />
          </div>

          {/* Recent Transactions */}
          <div className="mb-8">
            <RecentTransactions 
              isDemoUser={isDemoUser}
              onExportSuccess={(message) => setToast({ message, type: 'success' })}
            />
          </div>

          {/* Charts */}
          <div className="mb-8">
            <Charts 
              isDemoUser={isDemoUser}
              chartData={chartData}
            />
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