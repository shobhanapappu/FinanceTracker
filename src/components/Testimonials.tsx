import React, { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Graphic Designer',
    content: 'This app made managing my freelance income so easy! The automatic categorization saves me hours every month.',
    rating: 5
  },
  {
    name: 'Mike Rodriguez',
    role: 'E-commerce Store Owner',
    content: 'Perfect for tracking my online store profits and expenses. The investment tracking feature is incredibly detailed.',
    rating: 5
  },
  {
    name: 'Emma Thompson',
    role: 'Marketing Consultant',
    content: 'The savings goals feature helped me save for my dream vacation. The progress visualization keeps me motivated!',
    rating: 5
  }
];

export const Testimonials: React.FC = () => {
  const [visibleTestimonials, setVisibleTestimonials] = useState<boolean[]>(
    new Array(testimonials.length).fill(false)
  );
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleTestimonials(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    const testimonialElements = testimonialsRef.current?.querySelectorAll('.testimonial-card');
    testimonialElements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 px-8 bg-gradient-to-b from-dark-900 to-dark-800" ref={testimonialsRef}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
          Trusted by Thousands of{' '}
          <span className="bg-gradient-to-r from-primary-400 to-teal-400 bg-clip-text text-transparent">
            Professionals
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              data-index={index}
              className={`testimonial-card bg-card-gradient backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-teal-800/30 transition-all duration-700 hover:border-primary-500/50 hover:shadow-primary-500/10 ${
                visibleTestimonials[index]
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-primary-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="border-t border-teal-700/50 pt-4">
                <p className="font-bold text-white">
                  {testimonial.name}
                </p>
                <p className="text-sm text-gray-400">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};