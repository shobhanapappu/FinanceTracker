import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus, Filter, Download, Eye } from 'lucide-react';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Footer } from '../components/Footer';
import { AddInvestmentModal } from '../components/dashboard/modals/AddInvestmentModal';
import { Toast } from '../components/Toast';
import { getInvestments, getCurrentUser, exportToCSV } from '../lib/supabase';

export const Investments: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const mockInvestmentData = [
    {
      id: 1,
      type: 'Stocks',
      amount: 1500,
      date: '2025-01-15',
      platform: 'Robinhood',
      notes: 'Tech stock portfolio',
      created_at: '2025-01-15T10:00:00Z'
    },
    {
      id: 2,
      type: 'ETFs',
      amount: 2000,
      date: '2025-01-10',
      platform: 'Vanguard',
      notes: 'S&P 500 index fund',
      created_at: '2025-01-10T14:30:00Z'
    },
    {
      id: 3,
      type: 'Cryptocurrency',
      amount: 800,
      date: '2025-01-08',
      platform: 'Coinbase',
      notes: 'Bitcoin investment',
      created_at: '2025-01-08T09:15:00Z'
    }
  ];

  useEffect(() => {
    const loadInvestments = async () => {
      const demoMode = localStorage.getItem('isDemoUser') === 'true';
      
      if (demoMode) {
        setIsDemoUser(true);
        setInvestments(mockInvestmentData);
        setLoading(false);
        return;
      }

      try {
        const { user } = await getCurrentUser();
        if (user) {
          const { data, error } = await getInvestments(user.id);
          if (!error && data) {
            setInvestments(data);
          }
        }
      } catch (error) {
        console.error('Error loading investments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInvestments();
  }, []);

  const handleInvestmentSuccess = () => {
    setToast({ message: 'Investment added successfully!', type: 'success' });
    // Reload investments data
    const loadInvestments = async () => {
      try {
        const { user } = await getCurrentUser();
        if (user) {
          const { data, error } = await getInvestments(user.id);
          if (!error && data) {
            setInvestments(data);
          }
        }
      } catch (error) {
        console.error('Error reloading investments:', error);
      }
    };
    loadInvestments();
  };

  const handleExport = () => {
    if (investments.length === 0) {
      setToast({ message: 'No data to export', type: 'error' });
      return;
    }

    const exportData = investments.map(investment => ({
      Type: investment.type,
      Amount: investment.amount,
      Date: investment.date,
      Platform: investment.platform,
      Notes: investment.notes,
      'Created At': new Date(investment.created_at).toLocaleString()
    }));

    const today = new Date().toISOString().split('T')[0];
    exportToCSV(exportData, `investments_export_${today}.csv`);
    setToast({ message: 'Investments data exported successfully!', type: 'success' });
  };

  const totalInvestments = investments.reduce((sum, investment) => sum + Number(investment.amount), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading investments...</p>
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
              Investment Tracking
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor and manage your investment portfolio
            </p>
          </div>

          {/* Summary Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Portfolio Summary
              </h2>
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              ${totalInvestments.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Total Investment Value
            </p>
          </div>

          {/* Action Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <button
                onClick={() => setShowModal(true)}
                disabled={isDemoUser}
                className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 ${
                  isDemoUser ? 'cursor-not-allowed opacity-75' : ''
                }`}
                title={isDemoUser ? 'Sign up to add investments' : ''}
              >
                <Plus className="w-5 h-5" />
                Add Investment
              </button>

              <div className="flex gap-3">
                <button className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button 
                  onClick={handleExport}
                  disabled={investments.length === 0}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Investments Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Investment Records
                </h2>
              </div>
            </div>

            {investments.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">No investments recorded yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Start by adding your first investment
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Platform
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {investments.map((investment) => (
                      <tr key={investment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                            {investment.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                            ${Number(investment.amount).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(investment.date).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {investment.platform}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate block">
                            {investment.notes}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            disabled={isDemoUser}
                            className={`text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors ${
                              isDemoUser ? 'cursor-not-allowed opacity-75' : ''
                            }`}
                            title={isDemoUser ? 'Sign up to view details' : ''}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
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

      {/* Add Investment Modal */}
      {showModal && (
        <AddInvestmentModal 
          onClose={() => setShowModal(false)} 
          onSuccess={handleInvestmentSuccess}
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