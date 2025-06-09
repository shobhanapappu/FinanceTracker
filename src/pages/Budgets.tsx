import React, { useState, useEffect } from 'react';
import { Target, Plus, Eye } from 'lucide-react';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Footer } from '../components/Footer';
import { AddBudgetModal } from '../components/dashboard/modals/AddBudgetModal';
import { Toast } from '../components/Toast';
import { getBudgets, getExpenses, getCurrentUser } from '../lib/supabase';

export const Budgets: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const mockBudgetData = [
    {
      id: 1,
      category: 'Marketing',
      limit: 500,
      spent: 350,
      progress: 70,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      category: 'Software',
      limit: 300,
      spent: 200,
      progress: 67,
      color: 'bg-purple-500'
    },
    {
      id: 3,
      category: 'Travel',
      limit: 800,
      spent: 450,
      progress: 56,
      color: 'bg-green-500'
    }
  ];

  useEffect(() => {
    const loadBudgets = async () => {
      const demoMode = localStorage.getItem('isDemoUser') === 'true';
      
      if (demoMode) {
        setIsDemoUser(true);
        setBudgets(mockBudgetData);
        setLoading(false);
        return;
      }

      try {
        const { user } = await getCurrentUser();
        if (user) {
          const [budgetResult, expenseResult] = await Promise.all([
            getBudgets(user.id),
            getExpenses(user.id)
          ]);

          if (!budgetResult.error && budgetResult.data) {
            setBudgets(budgetResult.data);
          }

          if (!expenseResult.error && expenseResult.data) {
            setExpenses(expenseResult.data);
          }
        }
      } catch (error) {
        console.error('Error loading budgets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBudgets();
  }, []);

  const calculateSpent = (category: string) => {
    if (isDemoUser) {
      const mockBudget = mockBudgetData.find(b => b.category === category);
      return mockBudget?.spent || 0;
    }

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    return expenses
      .filter(expense => 
        expense.category === category && 
        expense.date.startsWith(currentMonth)
      )
      .reduce((sum, expense) => sum + Number(expense.amount), 0);
  };

  const handleBudgetSuccess = () => {
    setToast({ message: 'Budget created successfully!', type: 'success' });
    // Reload budgets
    const loadBudgets = async () => {
      try {
        const { user } = await getCurrentUser();
        if (user) {
          const { data, error } = await getBudgets(user.id);
          if (!error && data) {
            setBudgets(data);
          }
        }
      } catch (error) {
        console.error('Error reloading budgets:', error);
      }
    };
    loadBudgets();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading budgets...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader />
        
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Budget Planning
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Set and track your spending limits by category
            </p>
          </div>

          {/* Action Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <button
              onClick={() => setShowModal(true)}
              disabled={isDemoUser}
              className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 ${
                isDemoUser ? 'cursor-not-allowed opacity-75' : ''
              }`}
              title={isDemoUser ? 'Sign up to create budgets' : ''}
            >
              <Plus className="w-5 h-5" />
              Create Budget
            </button>
          </div>

          {/* Budget Cards */}
          {budgets.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">No budgets created yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Create your first budget to start tracking your spending
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map((budget) => {
                const spent = calculateSpent(budget.category);
                const progress = Math.round((spent / Number(budget.limit)) * 100);
                
                return (
                  <div key={budget.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 ${budget.color || 'bg-gradient-to-br from-blue-500 to-blue-600'} rounded-lg`}>
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {budget.category}
                        </h3>
                      </div>
                      <button
                        disabled={isDemoUser}
                        className={`p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ${
                          isDemoUser ? 'cursor-not-allowed opacity-75' : ''
                        }`}
                        title={isDemoUser ? 'Sign up to view details' : ''}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Spent</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          ${spent.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Limit</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          ${Number(budget.limit).toLocaleString()}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                          <span className={`text-sm font-bold ${
                            progress > 80 
                              ? 'text-red-600 dark:text-red-400' 
                              : progress > 60 
                              ? 'text-yellow-600 dark:text-yellow-400' 
                              : 'text-green-600 dark:text-green-400'
                          }`}>
                            {progress}%
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg h-3 overflow-hidden">
                          <div
                            className={`h-full rounded-lg transition-all duration-1000 ease-out ${
                              progress > 80 
                                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                                : progress > 60 
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' 
                                : 'bg-gradient-to-r from-green-500 to-green-600'
                            }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Remaining: ${Math.max(0, Number(budget.limit) - spent).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {isDemoUser && (
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Demo Mode:</strong> Sign up to create and manage your own budgets with real data.
              </p>
            </div>
          )}
        </main>

        <Footer />
      </div>

      {/* Add Budget Modal */}
      {showModal && (
        <AddBudgetModal 
          onClose={() => setShowModal(false)} 
          onSuccess={handleBudgetSuccess}
        />
      )}

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