import React, { useRef, useEffect, useState } from 'react';
import { ArrowRight, TrendingUp, DollarSign, PieChart, Target } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x, y });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handleGetStarted = () => {
    window.location.href = '/auth';
  };

  const floatingIcons = [
    { icon: DollarSign, delay: '0s', position: 'top-1/4 left-1/4' },
    { icon: PieChart, delay: '1s', position: 'top-1/3 right-1/4' },
    { icon: TrendingUp, delay: '2s', position: 'bottom-1/3 left-1/3' },
    { icon: Target, delay: '3s', position: 'bottom-1/4 right-1/3' },
  ];

  return (
    <section 
      ref={heroRef}
      className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 min-h-screen flex items-center justify-center py-20 px-8 overflow-hidden"
      style={{
        transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      {/* Animated background elements with 3D depth */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary floating orbs */}
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-float"
          style={{
            transform: `translateZ(${mousePosition.x * 50}px) translateX(${mousePosition.x * 30}px)`,
            animationDelay: '0s',
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-float"
          style={{
            transform: `translateZ(${mousePosition.y * 40}px) translateY(${mousePosition.y * 25}px)`,
            animationDelay: '2s',
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-teal-400/15 to-cyan-400/15 rounded-full blur-3xl animate-float"
          style={{
            transform: `translateZ(${mousePosition.x * mousePosition.y * 30}px) translate(-50%, -50%)`,
            animationDelay: '4s',
          }}
        ></div>

        {/* Floating finance icons */}
        {floatingIcons.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`absolute ${item.position} opacity-10 dark:opacity-20`}
              style={{
                transform: `translateZ(${mousePosition.x * (index + 1) * 20}px) translateX(${mousePosition.x * (index + 1) * 10}px) translateY(${mousePosition.y * (index + 1) * 10}px)`,
                animationDelay: item.delay,
              }}
            >
              <Icon className="w-16 h-16 text-cyan-400 animate-float" />
            </div>
          );
        })}

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translateZ(${mousePosition.x * 10}px)`,
          }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Main content card with 3D effects */}
        <div
          ref={cardRef}
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            transform: `
              perspective(1000px) 
              rotateX(${isHovered ? mousePosition.y * -5 : 0}deg) 
              rotateY(${isHovered ? mousePosition.x * 5 : 0}deg)
              translateZ(${isHovered ? 20 : 0}px)
            `,
            transition: 'transform 0.2s ease-out',
          }}
        >
          {/* Backdrop blur card */}
          <div className="absolute inset-0 bg-white/5 dark:bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 dark:border-white/10 shadow-2xl"></div>
          
          {/* Content */}
          <div className="relative p-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Simplify Your Finances with{' '}
              <span 
                className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-glow relative"
                style={{
                  textShadow: isHovered ? '0 0 30px rgba(6, 182, 212, 0.5)' : 'none',
                  transition: 'text-shadow 0.3s ease',
                }}
              >
                Smart Tracking Tools
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 dark:text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed">
              Track income, expenses, investments, and savings with ease—designed for freelancers and small businesses.
            </p>
            
            {/* 3D Button */}
            <div className="relative inline-block">
              <button
                onClick={handleGetStarted}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25"
                style={{
                  transform: `
                    perspective(1000px) 
                    rotateX(${isHovered ? mousePosition.y * -3 : 0}deg) 
                    rotateY(${isHovered ? mousePosition.x * 3 : 0}deg)
                    translateZ(${isHovered ? 10 : 0}px)
                  `,
                  boxShadow: isHovered 
                    ? '0 20px 40px rgba(6, 182, 212, 0.3), 0 0 20px rgba(6, 182, 212, 0.2)' 
                    : '0 10px 20px rgba(0, 0, 0, 0.2)',
                }}
                aria-label="Get started for free"
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                
                <span className="relative z-10">Get Started for Free</span>
                <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
        
        {/* 3D Progress Bar Section */}
        <div 
          className="mt-20 max-w-md mx-auto"
          style={{
            transform: `
              perspective(1000px) 
              rotateX(${mousePosition.y * 2}deg) 
              rotateY(${mousePosition.x * -2}deg)
              translateZ(${mousePosition.x * 15}px)
            `,
            transition: 'transform 0.2s ease-out',
          }}
        >
          <div className="relative">
            {/* Progress bar backdrop */}
            <div className="absolute inset-0 bg-white/10 dark:bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 dark:border-white/20 shadow-lg"></div>
            
            <div className="relative p-6">
              <ProgressBar percentage={75} label="Financial Health" />
            </div>
          </div>
        </div>

        {/* Floating stats cards */}
        <div className="absolute top-1/2 left-8 transform -translate-y-1/2 hidden lg:block">
          <div 
            className="bg-white/10 dark:bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-white/20 shadow-lg"
            style={{
              transform: `
                perspective(1000px) 
                rotateY(${mousePosition.x * 10}deg)
                translateZ(${mousePosition.x * 20}px)
              `,
              transition: 'transform 0.2s ease-out',
            }}
          >
            <div className="text-2xl font-bold text-cyan-400">$12.5K</div>
            <div className="text-sm text-gray-300">Monthly Revenue</div>
          </div>
        </div>

        <div className="absolute top-1/3 right-8 hidden lg:block">
          <div 
            className="bg-white/10 dark:bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-white/20 shadow-lg"
            style={{
              transform: `
                perspective(1000px) 
                rotateY(${mousePosition.x * -8}deg)
                translateZ(${mousePosition.y * 15}px)
              `,
              transition: 'transform 0.2s ease-out',
            }}
          >
            <div className="text-2xl font-bold text-blue-400">85%</div>
            <div className="text-sm text-gray-300">Savings Rate</div>
          </div>
        </div>

        <div className="absolute bottom-1/3 right-16 hidden lg:block">
          <div 
            className="bg-white/10 dark:bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-white/20 shadow-lg"
            style={{
              transform: `
                perspective(1000px) 
                rotateX(${mousePosition.y * -6}deg)
                translateZ(${mousePosition.x * mousePosition.y * 25}px)
              `,
              transition: 'transform 0.2s ease-out',
            }}
          >
            <div className="text-2xl font-bold text-purple-400">24</div>
            <div className="text-sm text-gray-300">Active Goals</div>
          </div>
        </div>
      </div>
    </section>
  );
};