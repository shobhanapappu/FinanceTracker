import React from 'react';
import { TrendingUp, PieChart, Target, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Smart Financial Insights',
    description: 'Get intelligent analysis of your financial patterns with automated categorization and spending insights.'
  },
  {
    icon: PieChart,
    title: 'Investment Tracking',
    description: 'Monitor your portfolio performance and track investment returns across multiple asset classes.'
  },
  {
    icon: Target,
    title: 'Savings Goals',
    description: 'Set and achieve financial goals with progress tracking and personalized recommendations.'
  },
  {
    icon: BarChart3,
    title: 'Interactive Charts',
    description: 'Visualize your financial data with beautiful, interactive charts and comprehensive reports.'
  }
];

export const Features: React.FC = () => {
  return (
    <section className="py-20 px-8 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-semibold text-center text-gray-900 dark:text-white mb-16">
          Everything You Need to Master Your Finances
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg mb-6">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};