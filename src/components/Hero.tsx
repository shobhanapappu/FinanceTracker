import React from 'react';
import { ArrowRight, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

export const Hero: React.FC = () => {
  const handleGetStarted = () => {
    window.location.href = '/auth';
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 min-h-screen flex items-center justify-center py-20 px-8 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-teal-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Fun Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">✨ Smart Finance Made Simple</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Turn Your 
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Money Chaos
              </span>
              Into 
              <span className="inline-flex items-center gap-3">
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Success!</span>
                <Zap className="w-12 h-12 md:w-16 md:h-16 text-yellow-400 animate-bounce" />
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 dark:text-gray-200 mb-8 leading-relaxed">
              🚀 <strong>Stop stressing</strong> about spreadsheets! Track income, expenses, and investments like a pro. 
              <span className="text-cyan-400 font-semibold">Perfect for freelancers & small businesses</span> who want to 
              <em className="text-green-400">actually enjoy</em> managing money! 💰
            </p>

            {/* Fun Stats */}
            <div className="flex flex-wrap gap-6 mb-8 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">10K+</div>
                <div className="text-sm text-gray-400">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">$2M+</div>
                <div className="text-sm text-gray-400">Money Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">99%</div>
                <div className="text-sm text-gray-400">Love It!</div>
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={handleGetStarted}
                className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">🎯 Start Winning With Money</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              
              <button className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                <span>📺 Watch 2-min Demo</span>
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex items-center gap-4 justify-center lg:justify-start text-sm text-gray-400">
              <span>✅ Free Forever</span>
              <span>✅ No Credit Card</span>
              <span>✅ Setup in 30 seconds</span>
            </div>
          </div>

          {/* Right Side - Hero Images with 3D Effects */}
          <div className="relative">
            {/* Main Dashboard Image */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              
              {/* Main Hero Image */}
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-cyan-500/20 shadow-2xl transform group-hover:scale-105 group-hover:rotate-1 transition-all duration-500">
                <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 border border-slate-600">
                  {/* Mock Dashboard Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white font-semibold">FinanceTracker</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>

                  {/* Mock Dashboard Content */}
                  <div className="space-y-4">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30">
                        <div className="text-green-400 text-sm font-medium">Total Income</div>
                        <div className="text-white text-2xl font-bold">$12,450</div>
                        <div className="text-green-400 text-xs">+15% this month</div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-500/30">
                        <div className="text-blue-400 text-sm font-medium">Savings</div>
                        <div className="text-white text-2xl font-bold">$3,280</div>
                        <div className="text-blue-400 text-xs">Goal: $5,000</div>
                      </div>
                    </div>

                    {/* Chart Area */}
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-600">
                      <div className="text-white text-sm font-medium mb-3">Monthly Overview</div>
                      <div className="flex items-end gap-2 h-20">
                        {[40, 65, 45, 80, 60, 90, 75].map((height, i) => (
                          <div
                            key={i}
                            className="bg-gradient-to-t from-cyan-500 to-blue-400 rounded-t flex-1 transition-all duration-1000 hover:from-cyan-400 hover:to-blue-300"
                            style={{ height: `${height}%` }}
                          ></div>
                        ))}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-600">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white text-sm">Financial Health</span>
                        <span className="text-cyan-400 font-bold">85%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-3 shadow-lg transform rotate-12 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
                <div className="text-white text-sm font-bold">+$2,500</div>
                <div className="text-green-100 text-xs">New Income!</div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl p-3 shadow-lg transform -rotate-12 group-hover:-rotate-6 group-hover:scale-110 transition-all duration-500">
                <div className="text-white text-sm font-bold">Goal Reached!</div>
                <div className="text-purple-100 text-xs">🎉 Vacation Fund</div>
              </div>

              <div className="absolute top-1/2 -right-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full p-4 shadow-lg transform group-hover:scale-125 group-hover:rotate-180 transition-all duration-700">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-8 left-8 w-32 h-32 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-8 right-8 w-40 h-40 bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>

        {/* Bottom Progress Section */}
        <div className="mt-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="mb-4">
                <span className="text-cyan-400 font-semibold">🎯 Your Financial Journey Starts Here</span>
              </div>
              <ProgressBar percentage={75} label="Ready to Transform Your Finances?" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};