import React, { useState } from 'react';
import { Plus, DollarSign, CreditCard, TrendingUp, Target } from 'lucide-react';
import { AddIncomeModal } from './modals/AddIncomeModal';
import { AddExpenseModal } from './modals/AddExpenseModal';
import { AddInvestmentModal } from './modals/AddInvestmentModal';
import { AddSavingsModal } from './modals/AddSavingsModal';

interface QuickActionsProps {
  isDemoUser?: boolean;
  onSuccess?: (message: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ 
  isDemoUser = false, 
  onSuccess 
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const actions = [
    {
      id: 'income',
      label: 'Add Income',
      icon: DollarSign,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      successMessage: 'Income added successfully!'
    },
    {
      id: 'expense',
      label: 'Add Expense',
      icon: CreditCard,
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      successMessage: 'Expense added successfully!'
    },
    {
      id: 'investment',
      label: 'Add Investment',
      icon: TrendingUp,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      successMessage: 'Investment added successfully!'
    },
    {
      id: 'savings',
      label: 'Add Savings Goal',
      icon: Target,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      successMessage: 'Savings goal added successfully!'
    },
  ];

  const handleActionClick = (actionId: string) => {
    if (isDemoUser) {
      return;
    }
    setActiveModal(actionId);
  };

  const handleSuccess = (actionId: string) => {
    const action = actions.find(a => a.id === actionId);
    if (action && onSuccess) {
      onSuccess(action.successMessage);
    }
    setActiveModal(null);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.id)}
              className={`${action.color} text-white p-4 rounded-lg font-medium hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 w-full ${
                isDemoUser ? 'cursor-not-allowed opacity-75' : ''
              }`}
              disabled={isDemoUser}
              title={isDemoUser ? 'Sign up to add entries' : ''}
            >
              <action.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{action.label}</span>
              <span className="sm:hidden">
                <Plus className="w-4 h-4" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'income' && (
        <AddIncomeModal 
          onClose={closeModal} 
          onSuccess={() => handleSuccess('income')}
        />
      )}
      {activeModal === 'expense' && (
        <AddExpenseModal 
          onClose={closeModal}
          onSuccess={() => handleSuccess('expense')}
        />
      )}
      {activeModal === 'investment' && (
        <AddInvestmentModal 
          onClose={closeModal}
          onSuccess={() => handleSuccess('investment')}
        />
      )}
      {activeModal === 'savings' && (
        <AddSavingsModal 
          onClose={closeModal}
          onSuccess={() => handleSuccess('savings')}
        />
      )}
    </>
  );
};