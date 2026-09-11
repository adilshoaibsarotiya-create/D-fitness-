import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, AlertCircle, ArrowRight, Sparkles, PieChart } from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';

export const CalorieCalculatorPage: React.FC = () => {
  const [age, setAge] = useState(26);
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(72);
  const [activity, setActivity] = useState<number>(1.375); // Lightly active default
  const [goal, setGoal] = useState<'maintain' | 'cut' | 'bulk'>('cut');

  useEffect(() => {
    document.title = "Calorie & Macro Calculator | D FITNESS Godda";
    window.scrollTo(0, 0);
  }, []);

  // Mifflin-St Jeor Formula
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  bmr = sex === 'male' ? bmr + 5 : bmr - 161;

  const tdee = Math.round(bmr * activity);

  let targetCalories = tdee;
  if (goal === 'cut') targetCalories = Math.round(tdee - 450); // Safe deficit
  if (goal === 'bulk') targetCalories = Math.round(tdee + 350); // Lean surplus

  // Macro estimates (approx 2g/kg protein, 25% fats, remainder carbs)
  const proteinGrams = Math.round(weightKg * 2.0);
  const fatGrams = Math.round((targetCalories * 0.25) / 9);
  const carbGrams = Math.max(0, Math.round((targetCalories - (proteinGrams * 4 + fatGrams * 9)) / 4));

  return (
    <div className="pt-24 pb-20 bg-[#050505]">
      {/* Header */}
      <section className="py-16 sm:py-20 bg-[#0A0A0A] border-b border-white/10 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#151515] border border-[#FFD400]/30 text-[#FFD400] text-xs font-heading font-semibold uppercase tracking-wider mb-6">
            <Flame className="w-3.5 h-3.5" />
            NUTRITIONAL ESTIMATION
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-[1.08] mb-6">
            Daily Calorie & Macro Needs
          </h1>

          <p className="text-base sm:text-xl text-[#BDBDBD] max-w-2xl mx-auto leading-relaxed">
            Estimate your Total Daily Energy Expenditure (TDEE) to calibrate your caloric intake for fat loss or muscle gain.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-7 rounded-3xl bg-[#121212] border border-white/10 p-6 sm:p-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-2">
                  Biological Sex
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSex('male')}
                    className={`py-2.5 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider border ${
                      sex === 'male' ? 'bg-[#FFD400] text-black border-[#FFD400]' : 'bg-[#1a1a1a] text-[#BDBDBD] border-white/10'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setSex('female')}
                    className={`py-2.5 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider border ${
                      sex === 'female' ? 'bg-[#FFD400] text-black border-[#FFD400]' : 'bg-[#1a1a1a] text-[#BDBDBD] border-white/10'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-2">
                  Age (Years)
                </label>
                <input
                  type="number"
                  min="14"
                  max="90"
                  value={age}
                  onChange={(e) => setAge(+e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-white outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="120"
                  max="230"
                  value={heightCm}
                  onChange={(e) => setHeightCm(+e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="35"
                  max="200"
                  value={weightKg}
                  onChange={(e) => setWeightKg(+e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-2">
                Weekly Activity Level
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(+e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 text-white text-sm outline-none"
              >
                <option value={1.2}>Sedentary (Little or no exercise, desk job)</option>
                <option value={1.375}>Lightly Active (Gym workout 1–3 days/week)</option>
                <option value={1.55}>Moderately Active (Gym workout 3–5 days/week)</option>
                <option value={1.725}>Very Active (Intense training 6–7 days/week)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-2">
                Primary Physique Goal
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cut', label: 'Fat Loss (-450 kcal)' },
                  { id: 'maintain', label: 'Maintenance' },
                  { id: 'bulk', label: 'Muscle Gain (+350 kcal)' }
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGoal(g.id as any)}
                    className={`p-2 rounded-lg text-xs font-heading font-semibold text-center border transition-colors ${
                      goal === g.id ? 'bg-[#FFD400] text-black border-[#FFD400]' : 'bg-[#1a1a1a] text-[#BDBDBD] border-white/10'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#181818] border border-white/10 flex items-start gap-2.5 text-xs text-[#BDBDBD]/80 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-[#FFD400] shrink-0 mt-0.5" />
              <span>
                Educational Notice: These calculations are estimates based on standard metabolic formulas. Individual metabolic rates vary. This tool does not provide clinical or medical nutrition advice.
              </span>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-5 rounded-3xl bg-[#121212] border border-[#FFD400]/30 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-heading font-bold text-[#FFD400] uppercase tracking-wider block mb-1">
                ESTIMATED DAILY TARGET
              </span>
              <h3 className="font-heading font-bold text-lg text-white">
                Target Daily Calories
              </h3>

              <div className="py-6 text-center my-4 rounded-2xl bg-[#181818] border border-white/10">
                <span className="font-display text-6xl font-black text-[#FFD400] block">
                  {targetCalories}
                </span>
                <span className="text-xs text-[#BDBDBD] uppercase tracking-wider">
                  Calories / Day (TDEE: {tdee})
                </span>
              </div>

              {/* Macro Estimates */}
              <div className="space-y-3">
                <span className="text-xs font-heading font-bold text-white uppercase tracking-wider block">
                  Suggested Macro Split
                </span>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-[#181818] border border-white/5">
                    <span className="text-[10px] text-[#00FF84] uppercase font-bold block">Protein</span>
                    <span className="text-lg font-display font-bold text-white block mt-1">{proteinGrams}g</span>
                    <span className="text-[10px] text-[#BDBDBD]">Muscle repair</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#181818] border border-white/5">
                    <span className="text-[10px] text-[#FFD400] uppercase font-bold block">Carbs</span>
                    <span className="text-lg font-display font-bold text-white block mt-1">{carbGrams}g</span>
                    <span className="text-[10px] text-[#BDBDBD]">Workout fuel</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#181818] border border-white/5">
                    <span className="text-[10px] text-[#FFE600] uppercase font-bold block">Fats</span>
                    <span className="text-lg font-display font-bold text-white block mt-1">{fatGrams}g</span>
                    <span className="text-[10px] text-[#BDBDBD]">Hormone health</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Link
                to="/membership"
                className="button-shine w-full py-3.5 rounded-xl bg-[#FFD400] hover:bg-[#FFE600] text-black font-heading font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <span>GET FULL DIET GUIDANCE IN GYM</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
