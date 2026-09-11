import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Calendar, Target, Award, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';

interface WorkoutDay {
  dayName: string;
  focus: string;
  mainMovements: string[];
  finisher: string;
}

export const WorkoutPlannerPage: React.FC = () => {
  const [goal, setGoal] = useState<'fat-loss' | 'muscle-gain' | 'strength' | 'general'>('fat-loss');
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [days, setDays] = useState<number>(4);

  useEffect(() => {
    document.title = "Interactive Workout Split Planner | D FITNESS Godda";
    window.scrollTo(0, 0);
  }, []);

  const generateSplit = (): WorkoutDay[] => {
    if (days === 2) {
      return [
        {
          dayName: 'Day 1: Full Body Foundation A',
          focus: 'Compound Squat & Upper Push/Pull Mechanics',
          mainMovements: ['Goblet Squat (3 sets x 10 reps)', 'Dumbbell Flat Bench Press (3 x 10)', 'Lat Pulldowns (3 x 12)', 'Plank Holds (3 x 45s)'],
          finisher: '12 min steady treadmill incline walk'
        },
        {
          dayName: 'Day 2: Full Body Foundation B',
          focus: 'Hinge Movement & Shoulder Stability',
          mainMovements: ['Romanian Deadlift with Dumbbells (3 x 10)', 'Seated Dumbbell Overhead Press (3 x 10)', 'Cable Seated Rows (3 x 12)', 'Walking Lunges (3 x 12/leg)'],
          finisher: '10 min stationary cycling intervals'
        }
      ];
    }

    if (days === 3) {
      return [
        {
          dayName: 'Day 1: Push & Core',
          focus: 'Chest, Front Delts, Triceps',
          mainMovements: ['Barbell or DB Bench Press (4 x 8-10)', 'Incline DB Press (3 x 10)', 'Overhead Dumbbell Extension (3 x 12)', 'Cable Chest Flyes (3 x 15)'],
          finisher: 'Hanging knee raises / core hollow hold'
        },
        {
          dayName: 'Day 2: Pull & Biceps',
          focus: 'Lat Width, Mid-Back Thickness, Biceps',
          mainMovements: ['Lat Pulldowns (4 x 10-12)', 'Barbell / T-Bar Row (4 x 8)', 'Face Pulls (3 x 15)', 'Incline Bicep Curls (3 x 12)'],
          finisher: 'Assault bike / sprint intervals (8 mins)'
        },
        {
          dayName: 'Day 3: Legs & Posterior Chain',
          focus: 'Quadriceps, Hamstrings, Glutes',
          mainMovements: ['Barbell Back Squats or Hack Squat (4 x 8)', 'Leg Press (3 x 12)', 'Lying Hamstring Curls (4 x 12)', 'Standing Calf Raises (4 x 15)'],
          finisher: 'Farmers carry with heavy dumbbells (4 laps)'
        }
      ];
    }

    if (days === 5 || days === 6) {
      return [
        {
          dayName: 'Day 1: Upper Power & Hypertrophy',
          focus: 'Horizontal Push/Pull Strength',
          mainMovements: ['Flat Barbell Bench (4 x 6)', 'Weighted / Assisted Pull-ups (4 x 8)', 'Incline Dumbbell Press (3 x 10)', 'Chest-Supported Rows (3 x 10)'],
          finisher: 'Band pull-aparts & tricep rope pushdowns'
        },
        {
          dayName: 'Day 2: Lower Power (Quad Dominant)',
          focus: 'Knee Flexion & Calves',
          mainMovements: ['Olympic Barbell Squats (4 x 6)', 'Bulgarian Split Squats (3 x 10/leg)', 'Leg Extension (3 x 15)', 'Seated Calf Raises (4 x 15)'],
          finisher: 'Prowler sled push / weighted lunges'
        },
        {
          dayName: 'Day 3: Push Hypertrophy',
          focus: 'Shoulders, Chest & Triceps Pump',
          mainMovements: ['Seated Overhead DB Press (4 x 10)', 'Cable Flyes (4 x 12)', 'Dumbbell Lateral Raises (4 x 15)', 'Dips / Skull Crushers (3 x 12)'],
          finisher: '15 min steady aerobic flush on treadmill'
        },
        {
          dayName: 'Day 4: Pull & Hamstrings (Posterior Chain)',
          focus: 'Deadlift variations, Upper Back, Biceps',
          mainMovements: ['Conventional or Trap Bar Deadlift (4 x 6)', 'Neutral Grip Lat Pulldown (4 x 10)', 'Cable Face Pulls (4 x 15)', 'Barbell Bicep Curls (3 x 10)'],
          finisher: 'Abdominal cable woodchoppers (3 x 15)'
        },
        {
          dayName: 'Day 5: Metabolic Conditioning & Weak Points',
          focus: 'Full-Body Athletic Capacity',
          mainMovements: ['Kettlebell Swings (4 x 15)', 'Dumbbell Thrusters (4 x 10)', 'Medicine Ball Slams (4 x 12)', 'Battle Ropes (4 x 30s)'],
          finisher: 'Full mobility decompression on gym floor'
        }
      ];
    }

    // Default 4 days: Upper / Lower Split
    return [
      {
        dayName: 'Day 1: Upper Body Focus A',
        focus: 'Chest, Lats & Triceps Overload',
        mainMovements: ['Barbell / DB Flat Bench (4 x 8)', 'Lat Pulldowns (4 x 10)', 'Incline DB Press (3 x 10)', 'Tricep Rope Pushdowns (3 x 12)'],
        finisher: '10 min incline walk on treadmill'
      },
      {
        dayName: 'Day 2: Lower Body Focus A',
        focus: 'Squat Biomechanics & Hamstring Control',
        mainMovements: ['Barbell Back Squat (4 x 8)', 'Romanian Deadlifts (4 x 10)', 'Leg Press (3 x 12)', 'Standing Calf Raise (4 x 15)'],
        finisher: 'Hanging knee raises (3 x 15)'
      },
      {
        dayName: 'Day 3: Upper Body Focus B',
        focus: 'Shoulders, Upper Back & Biceps',
        mainMovements: ['Seated DB Overhead Press (4 x 10)', 'Seated Cable Rows (4 x 10)', 'DB Lateral Raises (4 x 15)', 'Incline Dumbbell Curls (3 x 12)'],
        finisher: 'Face pulls (3 x 20) for rotator cuff posture'
      },
      {
        dayName: 'Day 4: Lower Body Focus B & Conditioning',
        focus: 'Quad Hypertrophy & Posterior Power',
        mainMovements: ['Goblet or Front Squats (4 x 10)', 'Lying Leg Curls (4 x 12)', 'Walking DB Lunges (3 x 12/leg)', 'Plank Holds (3 x 60s)'],
        finisher: '12 min HIIT intervals on stationary bike'
      }
    ];
  };

  const schedule = generateSplit();

  return (
    <div className="pt-24 pb-20 bg-[#050505]">
      {/* Header */}
      <section className="py-16 sm:py-20 bg-[#0A0A0A] border-b border-white/10 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#151515] border border-[#FFD400]/30 text-[#FFD400] text-xs font-heading font-semibold uppercase tracking-wider mb-6">
            <Dumbbell className="w-3.5 h-3.5" />
            PROGRAM ARCHITECTURE
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-[1.08] mb-6">
            Workout Split Planner
          </h1>

          <p className="text-base sm:text-xl text-[#BDBDBD] max-w-2xl mx-auto leading-relaxed">
            Generate a balanced weekly training blueprint matched to your weekly availability and primary physique target.
          </p>
        </div>
      </section>

      {/* Main Builder */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Selector Bar */}
        <div className="glass-card rounded-3xl bg-[#121212] border border-white/10 p-6 sm:p-8 mb-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Goal */}
            <div>
              <label className="block text-xs font-heading font-bold text-[#FFD400] uppercase tracking-wider mb-2">
                1. Primary Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/15 text-white text-sm outline-none focus:border-[#FFD400]"
              >
                <option value="fat-loss">Fat Loss & Calorie Burn</option>
                <option value="muscle-gain">Muscle Gain & Hypertrophy</option>
                <option value="strength">Raw Strength & Power</option>
                <option value="general">General Athletic Fitness</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-xs font-heading font-bold text-[#FFD400] uppercase tracking-wider mb-2">
                2. Experience Level
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/15 text-white text-sm outline-none focus:border-[#FFD400]"
              >
                <option value="beginner">Beginner (&lt; 1 Year)</option>
                <option value="intermediate">Intermediate (1 – 3 Years)</option>
                <option value="advanced">Advanced (3+ Years)</option>
              </select>
            </div>

            {/* Days Per Week */}
            <div>
              <label className="block text-xs font-heading font-bold text-[#FFD400] uppercase tracking-wider mb-2">
                3. Gym Frequency
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[2, 3, 4, 5].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDays(d)}
                    className={`py-3 rounded-xl text-xs font-heading font-bold transition-all border ${
                      days === d
                        ? 'bg-[#FFD400] text-black border-[#FFD400] shadow-[0_0_15px_rgba(255,212,0,0.3)]'
                        : 'bg-[#1a1a1a] text-[#BDBDBD] border-white/10 hover:border-white/30'
                    }`}
                  >
                    {d} Days
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Generated Schedule Cards */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-xl text-white">
              Generated {days}-Day Training Split
            </h3>
            <span className="text-xs text-[#00FF84] font-mono bg-[#00FF84]/10 px-3 py-1 rounded-full border border-[#00FF84]/30">
              Optimal Recovery Ratio
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schedule.map((item, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl bg-[#121212] border border-white/10 p-6 flex flex-col justify-between hover:border-[#FFD400]/40 transition-colors shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-[#FFD400] font-bold uppercase">
                      Session 0{idx + 1}
                    </span>
                    <span className="text-[10px] text-[#BDBDBD] uppercase">D FITNESS GODDA</span>
                  </div>

                  <h4 className="font-heading font-bold text-lg text-white mb-1">
                    {item.dayName}
                  </h4>
                  <p className="text-xs text-[#00FF84] mb-4 font-medium">
                    {item.focus}
                  </p>

                  <div className="space-y-2 py-3 border-t border-white/5 mb-4">
                    <span className="text-[10px] uppercase font-bold text-[#BDBDBD] tracking-wider block">
                      Core Movements
                    </span>
                    {item.mainMovements.map((move, mIdx) => (
                      <div key={mIdx} className="flex items-start gap-2 text-xs text-white/90">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FFD400] shrink-0 mt-0.5" />
                        <span>{move}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 text-xs text-[#BDBDBD]">
                  <strong className="text-white">Finisher / Cardio:</strong> {item.finisher}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer & CTA */}
        <div className="p-4 rounded-xl bg-[#101010] border border-white/10 flex items-start gap-3 text-xs text-[#BDBDBD]/80 mb-12 leading-relaxed">
          <AlertCircle className="w-5 h-5 text-[#FFD400] shrink-0 mt-0.5" />
          <span>
            Educational Disclaimer: This planner produces generalized split templates for healthy adults. Form, progressive overload, and joint mobility should always be monitored. For tailored 1-on-1 coaching, consult our floor trainers in Godda.
          </span>
        </div>

        <div className="rounded-3xl bg-[#0E0E0E] border border-[#FFD400]/30 p-8 sm:p-12 text-center">
          <h3 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase mb-3">
            Run This Program on the D FITNESS Floor
          </h3>
          <p className="text-xs sm:text-sm text-[#BDBDBD] max-w-lg mx-auto mb-6">
            Book a complimentary trial workout. A certified coach will guide your form through your chosen split in Godda.
          </p>
          <Link
            to="/free-trial"
            className="button-shine inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#FFD400] text-black font-heading font-bold text-sm tracking-wider hover:bg-[#FFE600] transition-colors shadow-xl"
          >
            <span>BOOK TRIAL WORKOUT PASS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
