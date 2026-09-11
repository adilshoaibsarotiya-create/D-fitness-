import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, AlertCircle, ArrowRight, Sparkles, Activity } from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';

export const BmiCalculatorPage: React.FC = () => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(72);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);
  const [weightLbs, setWeightLbs] = useState<number>(160);

  useEffect(() => {
    document.title = "BMI Calculator | D FITNESS Godda";
    window.scrollTo(0, 0);
  }, []);

  // Calculation
  let calculatedBmi = 0;
  if (unit === 'metric') {
    if (heightCm > 0 && weightKg > 0) {
      const heightM = heightCm / 100;
      calculatedBmi = +(weightKg / (heightM * heightM)).toFixed(1);
    }
  } else {
    const totalInches = heightFt * 12 + heightIn;
    if (totalInches > 0 && weightLbs > 0) {
      calculatedBmi = +((weightLbs / (totalInches * totalInches)) * 703).toFixed(1);
    }
  }

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#FFE600', advice: 'Consider our Muscle Gain & Hypertrophy program to safely build lean tissue and strength.' };
    if (bmi < 25) return { category: 'Normal Weight', color: '#00FF84', advice: 'Great baseline! Focus on strength progression, metabolic endurance, and cardiovascular health.' };
    if (bmi < 30) return { category: 'Overweight', color: '#FFD400', advice: 'Our Weight Loss & Fat Burn program can help calibrate calories and accelerate fat oxidation.' };
    return { category: 'Obesity Class', color: '#FF4C61', advice: 'Structured low-impact cardio and coach supervision will help preserve joints while burning calories.' };
  };

  const bmiInfo = getBmiCategory(calculatedBmi);

  return (
    <div className="pt-24 pb-20 bg-[#050505]">
      <section className="py-16 sm:py-20 bg-[#0A0A0A] border-b border-white/10 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#151515] border border-[#FFD400]/30 text-[#FFD400] text-xs font-heading font-semibold uppercase tracking-wider mb-6">
            <Calculator className="w-3.5 h-3.5" />
            FITNESS SCREENING TOOL
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-[1.08] mb-6">
            Body Mass Index (BMI)
          </h1>

          <p className="text-base sm:text-xl text-[#BDBDBD] max-w-2xl mx-auto leading-relaxed">
            Calculate your Body Mass Index to assess your weight-to-height ratio and determine ideal training tracks at D FITNESS.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs */}
          <div className="lg:col-span-7 rounded-3xl bg-[#121212] border border-white/10 p-6 sm:p-8 space-y-6">
            {/* Unit Toggle */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-white">
                Measurement System
              </span>
              <div className="flex rounded-lg bg-[#1a1a1a] p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => setUnit('metric')}
                  className={`px-4 py-1.5 rounded-md text-xs font-heading font-semibold tracking-wider transition-colors ${
                    unit === 'metric' ? 'bg-[#FFD400] text-black' : 'text-[#BDBDBD] hover:text-white'
                  }`}
                >
                  Metric (cm / kg)
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('imperial')}
                  className={`px-4 py-1.5 rounded-md text-xs font-heading font-semibold tracking-wider transition-colors ${
                    unit === 'imperial' ? 'bg-[#FFD400] text-black' : 'text-[#BDBDBD] hover:text-white'
                  }`}
                >
                  Imperial (ft / lbs)
                </button>
              </div>
            </div>

            {unit === 'metric' ? (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider">
                      Height (cm)
                    </label>
                    <span className="font-display text-2xl text-[#FFD400]">{heightCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="220"
                    value={heightCm}
                    onChange={(e) => setHeightCm(+e.target.value)}
                    className="w-full accent-[#FFD400] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider">
                      Weight (kg)
                    </label>
                    <span className="font-display text-2xl text-[#FFD400]">{weightKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="160"
                    value={weightKg}
                    onChange={(e) => setWeightKg(+e.target.value)}
                    className="w-full accent-[#FFD400] cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-2">
                      Feet
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="7"
                      value={heightFt}
                      onChange={(e) => setHeightFt(+e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-2">
                      Inches
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={heightIn}
                      onChange={(e) => setHeightIn(+e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-2">
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    min="80"
                    max="400"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(+e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 text-white outline-none"
                  />
                </div>
              </div>
            )}

            {/* Educational Disclaimer */}
            <div className="p-4 rounded-xl bg-[#181818] border border-white/10 flex items-start gap-2.5 text-xs text-[#BDBDBD]/80 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-[#FFD400] shrink-0 mt-0.5" />
              <span>
                Disclaimer: BMI is an approximate screening measure and does not distinguish between lean muscle mass and fat mass. It does not replace professional health or medical evaluation.
              </span>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-5 rounded-3xl bg-[#121212] border border-[#FFD400]/30 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-heading font-bold text-[#FFD400] uppercase tracking-wider block mb-1">
                CALCULATED SCORE
              </span>
              <h3 className="font-heading font-bold text-lg text-white">
                Your Body Mass Index
              </h3>

              <div className="py-6 text-center my-4 rounded-2xl bg-[#181818] border border-white/10">
                <span className="font-display text-6xl sm:text-7xl font-black text-[#FFD400] block">
                  {calculatedBmi || '0.0'}
                </span>
                <span
                  className="inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-2"
                  style={{ backgroundColor: `${bmiInfo.color}20`, color: bmiInfo.color }}
                >
                  {bmiInfo.category}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#BDBDBD] leading-relaxed">
                {bmiInfo.advice}
              </p>

              {/* Reference Scale */}
              <div className="space-y-1.5 pt-4 text-[11px] text-[#BDBDBD]">
                <div className="flex justify-between"><span>Underweight:</span> <span className="text-white">&lt; 18.5</span></div>
                <div className="flex justify-between"><span>Normal weight:</span> <span className="text-white">18.5 – 24.9</span></div>
                <div className="flex justify-between"><span>Overweight:</span> <span className="text-white">25.0 – 29.9</span></div>
                <div className="flex justify-between"><span>Obese:</span> <span className="text-white">&ge; 30.0</span></div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Link
                to="/free-trial"
                className="button-shine w-full py-3.5 rounded-xl bg-[#FFD400] hover:bg-[#FFE600] text-black font-heading font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <span>CONSULT A COACH IN GODDA</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
