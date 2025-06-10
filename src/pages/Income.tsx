import React, { useState, useEffect } from 'react';
import { DollarSign, Filter, Download, Plus } from 'lucide-react';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Footer } from '../components/Footer';
import { AddIncomeModal } from '../components/dashboard/modals/AddIncomeModal';
import { Toast } from '../components/Toast';
import { getIncome, getCurrentUser, exportToCSV } from '../lib/supabase';

export const Income: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [income, setIncome] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const mockIncomeData = [
    {
      id: 1,
      amount: 2500,
      source: 'Freelance Project',
      date: '2025-01-15',
      category: 'Freelance Work',
      notes: 'Website development for Client X',
      created_at: '2025-01-15T10:00:00Z'
    },
    {
      id: 2,
      amount: 1500,
      source: 'Consulting',
      date: '2025-01-10',
      category: 'Consulting',
      notes: 'Strategy consultation',
      created_at: '2025-01-10T14:30:00Z'
    },
    {
      id: 3,
      amount: 800,
      source: 'Side Project',
      date: '2025-01-08',
      category: 'Freelance Work',
      notes: 'Mobile app development',
      created_at: '2025-01-08T09:15:00Z'
    },
    {
      id: 4,
      amount: 1200,
      source: 'Client Y',
      date: '2025-01-05',
      category: 'Freelance Work',
      notes: 'E-commerce platform',
      created_at: '2025-01-05T16:45:00Z'
    },
    {
      id: 5,
      amount: 950,
      source: 'Retainer Fee',
      date: '2025-01-01',
      category: 'Business Revenue',
      notes: 'Monthly maintenance fee',
      created_at: '2025-01-01T11:20:00Z'
    }
  ];

  useEffect(() => {
    const loadIncome = async () => {
      const demoMode = localStorage.getItem('isDemoUser') === 'true';
      
      if (demoMode) {
        setIsDemoUser(true);
        setIncome(mockIncomeData);
        setLoading(false);
        return;
      }

      try {
        const { user } = await getCurrentUser();
        if (user) {
          const { data, error } = await getIncome(user.id);
          if (!error && data) {
            setIncome(data);
          }
        }
      } catch (error) {
        console.error('Error loading income:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIncome();
  }, []);

  const handleIncomeSuccess = () => {
    setToast({ message: 'Income added successfully!', type: 'success' });
    // Reload income data
    const loadIncome = async () => {
      try {
        const { user } = await getCurrentUser();
        if (user) {
          const { data, error } = await getIncome(user.id);
          if (!error && data) {
            setIncome(data);
          }
        }
      } catch (error) {
        console.error('Error reloading income:', error);
      }
    };
    loadIncome();
  };

  const handleExport = () => {
    if (income.length === 0) {
      setToast({ message: 'No data to export', type: 'error' });
      return;
    }

    const exportData = income.map(item => ({
      Amount: item.amount,
      Source: item.source,
      Date: item.date,
      Category: item.category,
      Notes: item.notes,
      'Created At': new Date(item.created_at).toLocaleString()
    }));

    const today = new Date().toISOString().split('T')[0];
    exportToCSV(exportData, `income_export_${today}.csv`);
    setToast({ message: 'Income data exported successfully!', type: 'success' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading income data...</p>
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
              Income Tracking
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor and manage your income sources
            </p>
          </div>

          {/* Action Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <button
                onClick={() => setShowModal(true)}
                disabled={isDemoUser}
                className={`bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 ${
                  isDemoUser ? 'cursor-not-allowed opacity-75' : ''
                }`}
                title={isDemoUser ? 'Sign up to add income' : ''}
              >
                <Plus className="w-5 h-5" />
                Add Income
              </button>

              <div className="flex gap-3">
                <button className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button 
                  onClick={handleExport}
                  disabled={income.length === 0}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Income Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Income Records
                </h2>
              </div>
            </div>

            {income.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">No income recorded yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Start by adding your first income entry
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {income.map((incomeItem) => (
                      <tr key={incomeItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                            ${Number(incomeItem.amount).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {incomeItem.source}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(incomeItem.date).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                            {incomeItem.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate block">
                            {incomeItem.notes}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(incomeItem.created_at).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>

      {/* Add Income Modal */}
      {showModal && (
        <AddIncomeModal 
          onClose={() => setShowModal(false)} 
          onSuccess={handleIncomeSuccess}
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