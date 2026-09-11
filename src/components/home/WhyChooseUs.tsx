import React from 'react';
import {
  Award,
  Dumbbell,
  UserCheck,
  Apple,
  Zap,
  Flame,
  Activity,
  HeartPulse
} from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: Award,
      title: 'Certified Trainers',
      desc: 'Expert coaches with deep biomechanical knowledge to keep your lifts safe, efficient, and progressive.'
    },
    {
      icon: Dumbbell,
      title: 'Premium Equipment',
      desc: 'Imported commercial plate-loaded machinery, heavy-duty power cages, and precision dumbbell racks up to 50 kg.'
    },
    {
      icon: UserCheck,
      title: 'Personal Training',
      desc: 'Dedicated 1-on-1 coaching customized to your unique schedule, fitness baseline, and physique ambitions.'
    },
    {
      icon: Apple,
      title: 'Nutrition Guidance',
      desc: 'Clear macro breakdowns and realistic caloric recommendations to fuel workouts and accelerate fat loss.'
    },
    {
      icon: Zap,
      title: 'Strength Training',
      desc: 'Deadlift platforms, Olympic barbells, and calibrated bumper plates built for serious raw powerlifters.'
    },
    {
      icon: Flame,
      title: 'Weight Loss Focus',
      desc: 'Calculated metabolic conditioning protocols engineered to shed stubborn body fat while keeping lean muscle.'
    },
    {
      icon: Activity,
      title: 'Functional Fitness',
      desc: 'Dynamic turf zones, kettlebells, and mobility drills to develop real-world athletic durability and pain-free joints.'
    },
    {
      icon: HeartPulse,
      title: 'Cardio Zone',
      desc: 'Commercial shock-absorbing treadmills, cross-trainers, and spin bikes with live heart-rate monitoring.'
    }
  ];

  return (
    <section id="why-choose-dfitness" className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#FFD400]/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="WHY CHOOSE D FITNESS"
          title="Engineered For High-Performance Results"
          subtitle="We combine world-class gym facilities with systematic coaching so every hour you spend on our floor translates directly into tangible physical progress."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="glass-card p-6 rounded-xl border border-white/10 hover:border-[#FFD400]/50 bg-[#121212]/90 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[#1a1a1a] border border-white/10 group-hover:border-[#FFD400]/40 group-hover:bg-[#FFD400]/10 flex items-center justify-center mb-5 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-[#FFD400] transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-[#FFD400] transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#BDBDBD] leading-relaxed">
                    {feature.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-[#BDBDBD]/60 group-hover:text-[#FFD400] transition-colors">
                  <span>D FITNESS STANDARD</span>
                  <span>0{idx + 1}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
