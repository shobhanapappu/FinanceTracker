import React, { useState, useEffect } from 'react';
import { Target, Plus, Eye, Calendar, Download } from 'lucide-react';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Footer } from '../components/Footer';
import { AddSavingsModal } from '../components/dashboard/modals/AddSavingsModal';
import { Toast } from '../components/Toast';
import { getSavingsGoals, getCurrentUser, exportToCSV } from '../lib/supabase';

export const Savings: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [savingsGoals, setSavingsGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const mockSavingsData = [
    {
      id: 1,
      goal_name: 'Emergency Fund',
      target_amount: 10000,
      current_amount: 6000,
      deadline: '2025-12-31',
      notes: 'Six months of expenses',
      created_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 2,
      goal_name: 'Vacation Fund',
      target_amount: 5000,
      current_amount: 2500,
      deadline: '2025-08-15',
      notes: 'Trip to Europe',
      created_at: '2025-01-05T00:00:00Z'
    },
    {
      id: 3,
      goal_name: 'New Equipment',
      target_amount: 3000,
      current_amount: 1200,
      deadline: null,
      notes: 'Laptop and camera upgrade',
      created_at: '2025-01-10T00:00:00Z'
    }
  ];

  useEffect(() => {
    const loadSavingsGoals = async () => {
      const demoMode = localStorage.getItem('isDemoUser') === 'true';
      
      if (demoMode) {
        setIsDemoUser(true);
        setSavingsGoals(mockSavingsData);
        setLoading(false);
        return;
      }

      try {
        const { user } = await getCurrentUser();
        if (user) {
          const { data, error } = await getSavingsGoals(user.id);
          if (!error && data) {
            setSavingsGoals(data);
          }
        }
      } catch (error) {
        console.error('Error loading savings goals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSavingsGoals();
  }, []);

  const handleSavingsSuccess = () => {
    setToast({ message: 'Savings goal added successfully!', type: 'success' });
    // Reload savings goals data
    const loadSavingsGoals = async () => {
      try {
        const { user } = await getCurrentUser();
        if (user) {
          const { data, error } = await getSavingsGoals(user.id);
          if (!error && data) {
            setSavingsGoals(data);
          }
        }
      } catch (error) {
        console.error('Error reloading savings goals:', error);
      }
    };
    loadSavingsGoals();
  };

  const handleExport = () => {
    if (savingsGoals.length === 0) {
      setToast({ message: 'No data to export', type: 'error' });
      return;
    }

    const exportData = savingsGoals.map(goal => ({
      'Goal Name': goal.goal_name,
      'Target Amount': goal.target_amount,
      'Current Amount': goal.current_amount,
      'Progress': `${Math.round((Number(goal.current_amount) / Number(goal.target_amount)) * 100)}%`,
      'Deadline': goal.deadline || 'No deadline',
      'Notes': goal.notes,
      'Created At': new Date(goal.created_at).toLocaleString()
    }));

    const today = new Date().toISOString().split('T')[0];
    exportToCSV(exportData, `savings_goals_export_${today}.csv`);
    setToast({ message: 'Savings goals data exported successfully!', type: 'success' });
  };

  const totalSaved = savingsGoals.reduce((sum, goal) => sum + Number(goal.current_amount), 0);
  const totalTarget = savingsGoals.reduce((sum, goal) => sum + Number(goal.target_amount), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading savings goals...</p>
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
              Savings Goals
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Set and track your financial savings goals
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Saved</h3>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${totalSaved.toLocaleString()}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Target</h3>
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ${totalTarget.toLocaleString()}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Goals</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {savingsGoals.length}
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <button
                onClick={() => setShowModal(true)}
                disabled={isDemoUser}
                className={`bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 ${
                  isDemoUser ? 'cursor-not-allowed opacity-75' : ''
                }`}
                title={isDemoUser ? 'Sign up to add savings goals' : ''}
              >
                <Plus className="w-5 h-5" />
                Add Savings Goal
              </button>

              <button 
                onClick={handleExport}
                disabled={savingsGoals.length === 0}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Savings Goals Grid */}
          {savingsGoals.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">No savings goals yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Create your first savings goal to start tracking your progress
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savingsGoals.map((goal) => {
                const progress = Math.round((Number(goal.current_amount) / Number(goal.target_amount)) * 100);
                const isOverdue = goal.deadline && new Date(goal.deadline) < new Date();
                
                return (
                  <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {goal.goal_name}
                        </h3>
                      </div>
                      <button 
                        disabled={isDemoUser}
                        className={`text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ${
                          isDemoUser ? 'cursor-not-allowed opacity-75' : ''
                        }`}
                        title={isDemoUser ? 'Sign up to view details' : ''}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                        <span className={`text-lg font-bold ${
                          progress >= 100 
                            ? 'text-green-600 dark:text-green-400' 
                            : progress >= 75 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-purple-600 dark:text-purple-400'
                        }`}>
                          {progress}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-lg transition-all duration-1000 ease-out ${
                            progress >= 100 
                              ? 'bg-gradient-to-r from-green-500 to-green-600' 
                              : progress >= 75 
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                              : 'bg-gradient-to-r from-purple-500 to-purple-600'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            ${Number(goal.current_amount).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Target</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            ${Number(goal.target_amount).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {goal.deadline && (
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className={`text-xs ${
                            isOverdue 
                              ? 'text-red-600 dark:text-red-400' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {isOverdue ? 'Overdue: ' : 'Due: '}
                            {new Date(goal.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {goal.notes && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                          {goal.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        <Footer />
      </div>

      {/* Add Savings Goal Modal */}
      {showModal && (
        <AddSavingsModal 
          onClose={() => setShowModal(false)} 
          onSuccess={handleSavingsSuccess}
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