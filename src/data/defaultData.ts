import { Program, Trainer, MembershipPlan, GalleryItem, FAQItem, Testimonial } from '../types';

export const defaultPrograms: Program[] = [
  {
    id: 'prog-weight-loss',
    slug: 'weight-loss',
    title: 'Weight Loss & Fat Burn',
    shortDescription: 'Scientific caloric deficit programming, high-output metabolic conditioning, and structured cardio for sustainable fat loss.',
    overview: 'Our Weight Loss & Fat Burn program is designed specifically for individuals looking to shed excess fat while preserving lean muscle mass. By combining progressive resistance training with calculated metabolic conditioning and structured heart-rate zone cardio, we optimize your metabolic rate for continuous calorie burning.',
    whoItIsFor: [
      'Individuals aiming to drop body fat sustainably',
      'Beginners transitioning into consistent physical activity',
      'Anyone experiencing weight loss plateaus with standard dieting',
      'Members looking to boost cardiovascular health and daily stamina'
    ],
    benefits: [
      'Accelerated resting metabolic rate (EPOC effect)',
      'Lean muscle tone preservation while burning fat',
      'Improved insulin sensitivity and cellular energy',
      'Structured weekly tracking to measure inches and scale progress'
    ],
    trainingApproach: [
      'Compound multi-joint movements for maximum caloric expenditure',
      'High-energy interval and continuous zone-2 cardiovascular work',
      'Core conditioning and functional mobility to prevent injuries',
      'Weekly habit coaching for daily physical activity and hydration'
    ],
    typicalSession: [
      '08 min: Dynamic warm-up and joint mobilization',
      '25 min: Progressive circuit resistance training (dumbbells, cables, bodyweight)',
      '18 min: Target-zone cardiovascular conditioning (treadmill/elliptical intervals)',
      '09 min: Core stability and guided cool-down stretch'
    ],
    difficulty: 'All Levels',
    duration: '12 Weeks',
    frequency: '4–5 Sessions / Week',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    category: 'fat-loss',
    featured: true
  },
  {
    id: 'prog-muscle-gain',
    slug: 'muscle-gain',
    title: 'Muscle Gain & Hypertrophy',
    shortDescription: 'Hypertrophy-focused training designed to build dense lean muscle, muscular symmetry, and substantial physical strength.',
    overview: 'Engineered for dedicated lifters and newcomers alike, the Muscle Gain program focuses on mechanical tension, metabolic stress, and progressive overload. You will utilize our premium biomechanically tuned pin-loaded and plate-loaded machines alongside free weights to stimulate optimal hypertrophy.',
    whoItIsFor: [
      'Anyone seeking to build lean muscle mass and muscular definition',
      'Ectomorphs and hardgainers looking for structured lifting regimens',
      'Lifters wanting to break past strength and size plateaus'
    ],
    benefits: [
      'Significant increase in lean muscle mass and physique density',
      'Bone density enhancement and tendon reinforcement',
      'Optimized muscular symmetry and athletic posture',
      'Enhanced neuromuscular recruitment and lifting efficiency'
    ],
    trainingApproach: [
      'Periodized rep ranges between 6–12 repetitions near muscular failure',
      'Emphasis on eccentric tempo control and mind-muscle contraction',
      'Volume manipulation across push, pull, and legs splits',
      'Strict tracking of working weight, sets, and training volume'
    ],
    typicalSession: [
      '10 min: Active shoulder/hip mobility and movement activation',
      '35 min: Primary compound lifts & secondary hypertrophy supersets',
      '12 min: Isolation pumps with cables and machine overload',
      '05 min: Muscle tissue decompression and stretching'
    ],
    difficulty: 'Intermediate',
    duration: '16 Weeks',
    frequency: '4–5 Sessions / Week',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop',
    category: 'hypertrophy',
    featured: true
  },
  {
    id: 'prog-bodybuilding',
    slug: 'bodybuilding',
    title: 'Advanced Bodybuilding',
    shortDescription: 'Targeted muscle isolation, peak contraction technique, and volume periodization for serious physique sculpture.',
    overview: 'The Advanced Bodybuilding track is built for lifters who view their physique as a craft. Guided by experienced strength coaches, you will learn targeted muscle isolation, angle variation, peak contractions, and intensity multipliers such as drop sets and rest-pause sets.',
    whoItIsFor: [
      'Intermediate to advanced athletes preparing for stage or personal excellence',
      'Lifters who want deep aesthetic symmetry, shoulder caps, and quad sweep',
      'Athletes committed to disciplined, high-volume resistance workouts'
    ],
    benefits: [
      'Sculpted muscle fullness, deep striations, and proportion',
      'Advanced mastery of biomechanical lines of pull',
      'Disciplined mental resilience under intense muscular burn',
      'Targeted correction of lagging muscle groups'
    ],
    trainingApproach: [
      'Targeted split routines (Chest & Triceps, Back & Biceps, Shoulders, Legs)',
      'Utilization of specialized grips, incline variations, and cable crossovers',
      'Intensification techniques including drop sets, isometric holds, and forced reps',
      'Focus on full range of motion under heavy load'
    ],
    typicalSession: [
      '10 min: Specific muscle activation & warm-up sets',
      '40 min: Heavy compound and targeted hypertrophy sets',
      '15 min: Finisher supersets and blood-flow occlusion burnout',
      '05 min: Fascial stretching'
    ],
    difficulty: 'Advanced',
    duration: '24 Weeks',
    frequency: '5–6 Sessions / Week',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    category: 'hypertrophy',
    featured: true
  },
  {
    id: 'prog-cardio',
    slug: 'cardio',
    title: 'High-Performance Cardio',
    shortDescription: 'State-of-the-art commercial treadmills, cross-trainers, and spin bikes to build elite cardiovascular endurance.',
    overview: 'Our cardio arena provides the ideal cardiovascular stimulus for heart health, resting heart rate reduction, stamina, and mental clarity. Whether you prefer steady-state aerobic conditioning or brisk hill-climb intervals, our modern equipment delivers real-time heart rate feedback.',
    whoItIsFor: [
      'Members seeking exceptional lung capacity and heart health',
      'Runners and athletes conditioning for endurance events',
      'Anyone desiring active stress relief and mood enhancement'
    ],
    benefits: [
      'Decreased resting heart rate and optimized blood pressure',
      'Rapid fat oxidation and caloric consumption',
      'High daily energy levels and superior sleep quality',
      'Stronger immune response and reduced physical fatigue'
    ],
    trainingApproach: [
      'Zone 2 endurance training for mitochondrial efficiency',
      'Interval hill sprints on cushioned shock-absorbing treadmills',
      'Stair climbing and low-impact elliptical cross-training',
      'Heart rate variability tracking for optimal recovery'
    ],
    typicalSession: [
      '05 min: Progressive warm-up walk/spin',
      '30 min: Main aerobic conditioning (Variable incline or sprint intervals)',
      '10 min: Aerobic cool-down and pulse stabilization',
      '05 min: Postural decompression and calf/hamstring release'
    ],
    difficulty: 'Beginner',
    duration: 'Ongoing',
    frequency: '3–5 Sessions / Week',
    image: 'https://images.unsplash.com/photo-1434596922112-19c563067271?q=80&w=1200&auto=format&fit=crop',
    category: 'cardio',
    featured: false
  },
  {
    id: 'prog-strength-training',
    slug: 'strength-training',
    title: 'Strength & Powerlifting',
    shortDescription: 'Master the barbell fundamentals — Squat, Bench Press, Deadlift, and Overhead Press — with Olympic barbells and bumper plates.',
    overview: 'Raw, functional power built on time-tested principles. The Strength Training program teaches lifters proper mechanics for the fundamental barbell lifts. With dedicated deadlift platforms, power cages, Olympic bars, and calibrated iron, you will train safely for genuine absolute strength.',
    whoItIsFor: [
      'Lifters eager to lift heavier and develop unstoppable real-world power',
      'Athletes needing explosiveness and structural durability',
      'Anyone passionate about barbell mechanics and technical lifting mastery'
    ],
    benefits: [
      'Massive increases in full-body absolute and relative strength',
      'Tendon and connective tissue fortification',
      'Enhanced central nervous system recruitment efficiency',
      'Impenetrable core stability and spinal resilience'
    ],
    trainingApproach: [
      'Linear periodization (e.g. 5x5, 3x5, submaximal percentages)',
      'Strict emphasis on bar path, bracing, and foot drive',
      'Accessory work targeting weak links (triceps, upper back, glutes)',
      'Sufficient rest intervals (2–4 minutes) between heavy working sets'
    ],
    typicalSession: [
      '12 min: Thoracic spine, hip mobility, and empty-bar technique sets',
      '30 min: Primary power lift with ramping warmup and heavy working sets',
      '15 min: Strength-supporting accessory work (pull-ups, rows, lunges)',
      '08 min: Core bracing and decompressing hanging stretches'
    ],
    difficulty: 'Intermediate',
    duration: '12–16 Weeks',
    frequency: '3–4 Sessions / Week',
    image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1200&auto=format&fit=crop',
    category: 'strength',
    featured: true
  },
  {
    id: 'prog-hiit',
    slug: 'hiit',
    title: 'High-Intensity Interval Training (HIIT)',
    shortDescription: 'Explosive bursts of maximum work followed by short recovery periods to torch calories in minimal time.',
    overview: 'When time is of the essence and intensity is desired, our HIIT program delivers unmatched results. Utilizing battle ropes, kettlebells, plyometrics, rowers, and bodyweight movements, this program accelerates heart rates and elevates the afterburn effect for hours post-workout.',
    whoItIsFor: [
      'Busy professionals wanting an intense, time-effective workout',
      'Individuals who thrive in dynamic, fast-moving circuit environments',
      'Athletes looking to boost VO2 max and anaerobic threshold'
    ],
    benefits: [
      'Maximal caloric burn in short 35–45 minute sessions',
      'Substantial boost to aerobic and anaerobic endurance',
      'Enhanced agility, reaction time, and speed',
      'High endorphin release for superior mental clarity'
    ],
    trainingApproach: [
      'Tabata protocols (20 sec work / 10 sec rest) and AMRAP rounds',
      'Low-impact functional combinations to protect knees and back',
      'Full-body functional coordination exercises',
      'Coach-guided pacing to prevent premature fatigue'
    ],
    typicalSession: [
      '06 min: Movement preparation and heart rate ramp',
      '28 min: High-intensity rotational circuits (ropes, slam balls, burpees, rowers)',
      '06 min: Core stamina blast',
      '05 min: Parasympathetic breathing and deep stretching'
    ],
    difficulty: 'Intermediate',
    duration: '8 Weeks',
    frequency: '3 Sessions / Week',
    image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=1200&auto=format&fit=crop',
    category: 'fat-loss',
    featured: false
  },
  {
    id: 'prog-functional-training',
    slug: 'functional-training',
    title: 'Functional Fitness & Mobility',
    shortDescription: 'Improve mobility, posture, rotational strength, and day-to-day athleticism through multi-planar functional movements.',
    overview: 'Fitness should make everyday life feel effortless. The Functional Fitness program trains your body to move fluidly across all anatomical planes. Perfect for pain-free movement, posture correction, joint longevity, and athletic stamina.',
    whoItIsFor: [
      'Office workers experiencing stiff backs, tight hips, and poor posture',
      'Recreational athletes wanting better coordination and rotational power',
      'Anyone prioritizing pain-free joints and agile longevity'
    ],
    benefits: [
      'Dramatically increased flexibility, mobility, and joint health',
      'Elimination of common postural muscular imbalances',
      'Enhanced balance, rotational power, and proprioception',
      'Reduced injury risk in daily activities and sports'
    ],
    trainingApproach: [
      'Multi-planar lunges, crawls, kettlebell carries, and medicine ball chops',
      'Myofascial release techniques and active joint articular rotations',
      'Anti-rotational core stabilization (Pallof press, planks)',
      'Progressive balance and deceleration drills'
    ],
    typicalSession: [
      '10 min: Dynamic joint mobility and foam rolling',
      '25 min: Functional movement complexes and carry variations',
      '15 min: Core stability and balance integration',
      '10 min: Restorative deep stretching and hip openers'
    ],
    difficulty: 'All Levels',
    duration: 'Ongoing',
    frequency: '3–4 Sessions / Week',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop',
    category: 'functional',
    featured: false
  },
  {
    id: 'prog-personal-training',
    slug: 'personal-training',
    title: '1-on-1 Personal Training',
    shortDescription: 'Dedicated 1-on-1 coach supervision, tailored form correction, custom workout design, and accountability.',
    overview: 'Our premier personal training experience pairs you with an expert trainer who crafts every workout specifically for your body, goals, schedule, and biomechanics. From strict form guidance to progressive periodization, personal training delivers the fastest and safest route to your dream physique.',
    whoItIsFor: [
      'Beginners needing safe, supportive, and error-free instruction',
      'Busy individuals requiring maximum efficiency and guaranteed accountability',
      'Lifters returning from hiatus or working around specific joint limitations',
      'Anyone demanding elite-tier, personalized results'
    ],
    benefits: [
      '100% custom-tailored program adapted to your progress every session',
      'Immediate real-time posture, angle, and safety correction',
      'Consistent motivation, goal tracking, and lifestyle accountability',
      'Priority access to gym floor equipment during training slots'
    ],
    trainingApproach: [
      'Comprehensive baseline assessment: posture, mobility, strength baseline',
      'Goal-specific exercise selection and progression schedule',
      'Session-by-session volume and intensity adjustments',
      'Direct ongoing consultation with your assigned coach'
    ],
    typicalSession: [
      '08 min: Coach-led targeted warm-up and mobility prep',
      '35 min: High-precision 1-on-1 lifting with immediate technique adjustments',
      '12 min: Dedicated metabolic finisher or corrective exercises',
      '05 min: Assisted stretching and session recap'
    ],
    difficulty: 'All Levels',
    duration: 'Custom (1, 3, or 6 Months)',
    frequency: 'Flexible Scheduling',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop',
    category: 'strength',
    featured: true
  }
];

export const defaultTrainers: Trainer[] = [
  {
    id: 'trainer-1',
    name: 'Head Coach & Strength Specialist',
    role: 'Head Strength & Conditioning Coach',
    experience: '8+ Years Coaching Experience',
    specialization: ['Heavy Barbell Mechanics', 'Hypertrophy & Muscle Gain', 'Fat Loss Periodization'],
    achievements: ['Certified Personal Trainer', 'Specialized in Biomechanics & Movement'],
    bio: 'Leads the training philosophy at D FITNESS. Passionate about empowering Godda’s fitness enthusiasts through evidence-based strength protocols, correct lifting form, and relentless discipline.',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=800&auto=format&fit=crop',
    instagram: 'https://instagram.com',
    whatsapp: '919876543210',
    featured: true
  },
  {
    id: 'trainer-2',
    name: 'Cardio & Fat Loss Coach',
    role: 'Senior Cardio & Conditioning Trainer',
    experience: '6+ Years Coaching Experience',
    specialization: ['HIIT & Metabolic Conditioning', 'Sustainable Weight Loss', 'Core & Functional Endurance'],
    achievements: ['Certified Fitness Instructor', 'Hundreds of Clients Guided to Healthier Lifestyles'],
    bio: 'Dedicated to making fitness accessible, energizing, and sustainable. Brings high-tempo energy and personalized cardio plans to members at every stage of their transformation journey.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    instagram: 'https://instagram.com',
    whatsapp: '919876543210',
    featured: true
  },
  {
    id: 'trainer-3',
    name: 'Bodybuilding & Physique Coach',
    role: 'Physique & Functional Coach',
    experience: '5+ Years Coaching Experience',
    specialization: ['Aesthetic Muscle Sculpting', 'Nutritional Habit Guidance', 'Postural Alignment'],
    achievements: ['Certified Strength Coach', 'Competitive Physique Background'],
    bio: 'Focuses on precision hypertrophy, mind-muscle connection, and clean execution. Helps members build symmetrical muscle mass safely without risking joints or lower back strain.',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop',
    instagram: 'https://instagram.com',
    whatsapp: '919876543210',
    featured: true
  }
];

export const defaultMembershipPlans: MembershipPlan[] = [
  {
    id: 'plan-silver',
    name: 'SILVER',
    price: '₹[PRICE]',
    billingPeriod: 'per month',
    tagline: 'Ideal for self-driven individuals seeking unrestricted access to modern gym equipment.',
    features: [
      'Full Gym Floor & Strength Zone Access',
      'Dedicated Cardio Deck & Treadmills',
      'Locker & Clean Changing Room Access',
      'Free Fitness Induction & Safety Briefing',
      'Standard Workout Floor Support'
    ],
    recommended: false,
    gymAccess: 'Full Access (During Operating Hours)',
    cardioZone: true,
    strengthZone: true,
    trainerSupport: 'General Floor Guidance',
    personalTraining: 'Optional Add-on',
    nutritionGuidance: 'Basic Diet Guidelines',
    lockerAndShower: true
  },
  {
    id: 'plan-gold',
    name: 'GOLD',
    price: '₹[PRICE]',
    billingPeriod: 'per 3 months',
    tagline: 'Our most popular plan for disciplined members aiming for consistent body recomposition.',
    features: [
      'Complete Gym, Strength & Cardio Access',
      'Quarterly Body Composition & Measurement Assessment',
      'Personalized Workout Split Chart',
      'Structured Nutrition & Caloric Guidance',
      'Priority Locker Facility',
      'Special discounted rate for 3-month commitment'
    ],
    recommended: true,
    highlightText: 'MOST POPULAR',
    gymAccess: 'Unlimited Priority Floor Access',
    cardioZone: true,
    strengthZone: true,
    trainerSupport: 'Dedicated Floor Trainer Guidance',
    personalTraining: '2 Induction Sessions Included',
    nutritionGuidance: 'Customized Macro & Diet Breakdown',
    lockerAndShower: true
  },
  {
    id: 'plan-elite',
    name: 'ELITE',
    price: '₹[PRICE]',
    billingPeriod: 'per 6/12 months',
    tagline: 'The ultimate VIP fitness commitment for high performers demanding top results.',
    features: [
      'All-Inclusive Unlimited Gym & Equipment Access',
      'Dedicated 1-on-1 Personal Training Sessions',
      'Comprehensive Ongoing Nutrition & Supplement Blueprint',
      'Monthly Progress Tracking & Metric Audits',
      'Complimentary Guest Passes (2 / month)',
      'Free D FITNESS Gym Kit (Shaker & Towel)',
      'Direct WhatsApp Coach Access'
    ],
    recommended: false,
    gymAccess: 'All-Access VIP Pass',
    cardioZone: true,
    strengthZone: true,
    trainerSupport: '1-on-1 Dedicated Trainer Support',
    personalTraining: 'Weekly Dedicated 1-on-1 PT Included',
    nutritionGuidance: 'Complete Dynamic Nutrition Planning',
    lockerAndShower: true
  }
];

export const defaultGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Heavy Strength & Dumbbell Arena',
    category: 'equipment',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    description: 'Precision calibrated rubber hex dumbbells ranging from 2.5 kg up to 50 kg.',
    aspectRatio: 'wide'
  },
  {
    id: 'gal-2',
    title: 'Commercial Cardio Deck',
    category: 'gym',
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1200&auto=format&fit=crop',
    description: 'High-grade commercial treadmills with shock-absorption technology.',
    aspectRatio: 'tall'
  },
  {
    id: 'gal-3',
    title: 'Olympic Barbell & Squat Cages',
    category: 'equipment',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    description: 'Heavy duty power cages and Olympic lifting platforms.',
    aspectRatio: 'square'
  },
  {
    id: 'gal-4',
    title: 'Dedicated Conditioning Session',
    category: 'workouts',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop',
    description: 'Members engaged in structured upper-body hypertrophy training.',
    aspectRatio: 'wide'
  },
  {
    id: 'gal-5',
    title: 'Professional Coaching In Action',
    category: 'trainers',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop',
    description: 'Hands-on posture alignment and form cueing by D FITNESS certified trainers.',
    aspectRatio: 'tall'
  },
  {
    id: 'gal-6',
    title: 'Cable Multi-Stations & Lat Pulldowns',
    category: 'equipment',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop',
    description: 'Biomechanical cable cross multi-stack machines for isolated muscle stimulus.',
    aspectRatio: 'square'
  },
  {
    id: 'gal-7',
    title: 'Functional Turf & Kettlebell Zone',
    category: 'gym',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop',
    description: 'Spacious floor for mobility drills, sled pushes, and dynamic athletic warm-ups.',
    aspectRatio: 'wide'
  },
  {
    id: 'gal-8',
    title: 'Dedicated Community Atmosphere',
    category: 'members',
    image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=1200&auto=format&fit=crop',
    description: 'A focused, motivating, and disciplined environment for everyday athletes in Godda.',
    aspectRatio: 'square'
  }
];

export const defaultFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What are the gym timings at D FITNESS?',
    answer: 'D FITNESS is open Monday through Saturday from 05:30 AM to 10:00 PM. On Sundays, we are open for morning sessions from 06:00 AM to 01:00 PM. These extended operating hours allow members to train comfortably before work, during the afternoon, or after evening commitments.',
    category: 'general'
  },
  {
    id: 'faq-2',
    question: 'Where is D FITNESS located in Godda?',
    answer: 'D FITNESS is conveniently located at Gangta Rd, Fasia Dangal, Godda, Jharkhand 814133. Our central facility offers easy accessibility, prominent road frontage, and designated vehicle parking for both two-wheelers and four-wheelers.',
    category: 'general'
  },
  {
    id: 'faq-3',
    question: 'What membership plans are available and how much do they cost?',
    answer: 'We offer flexible membership options including Silver (monthly), Gold (quarterly), and Elite (half-yearly/annual). Exact pricing is displayed as ₹[PRICE] in advance until your personalized consultation at our reception desk. Contact our team via WhatsApp or phone to get today’s active membership package discounts.',
    category: 'membership'
  },
  {
    id: 'faq-4',
    question: 'Do you provide certified 1-on-1 personal training?',
    answer: 'Yes! We have qualified personal trainers specializing in body recomposition, powerlifting, functional mobility, and targeted weight loss. Personal training packages include direct form supervision, custom workout splits, and weekly accountability checks.',
    category: 'training'
  },
  {
    id: 'faq-5',
    question: 'Is nutrition guidance included with gym memberships?',
    answer: 'Yes, all members receive baseline nutritional guidelines and caloric balance education. Gold and Elite members receive personalized macronutrient breakdowns tailored specifically to their weight loss or muscle building targets.',
    category: 'training'
  },
  {
    id: 'faq-6',
    question: 'Do you have dedicated programs for weight loss and fat burning?',
    answer: 'Absolutely. Our Weight Loss & Fat Burn program is one of our flagship offerings. It combines calibrated cardio conditioning (treadmills, ellipticals, spin bikes) with muscle-preserving resistance circuits to ensure sustainable, healthy fat loss without rebound weight gain.',
    category: 'training'
  },
  {
    id: 'faq-7',
    question: 'What strength training and bodybuilding equipment do you provide?',
    answer: 'Our strength arena is equipped with heavy-duty power racks, Olympic barbells with bumper plates, adjustable incline/decline benches, dual cable crossovers, seated row and lat pulldown stations, leg press machines, and a comprehensive dumbbell rack ranging up to 50 kg.',
    category: 'facilities'
  },
  {
    id: 'faq-8',
    question: 'Are there separate or specialized batches for women or beginners?',
    answer: 'Yes! We maintain an inclusive, welcoming, and safe atmosphere with designated morning and evening assistance slots where floor trainers pay special attention to beginners and female members starting their fitness journeys.',
    category: 'general'
  },
  {
    id: 'faq-9',
    question: 'Is there safe parking available at the gym?',
    answer: 'Yes, we provide dedicated, well-lit parking space directly in front of the facility for two-wheelers and cars, ensuring a hassle-free visit during peak morning and evening workout hours.',
    category: 'facilities'
  },
  {
    id: 'faq-10',
    question: 'How do I book a Free Trial session before joining?',
    answer: 'You can book your complimentary trial pass directly on our website by navigating to the "Book Free Trial" page, or simply send a message to our official WhatsApp number. Our team will prepare your trial pass and reserve a workout slot for you.',
    category: 'membership'
  }
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    clientName: 'Dedicated Member',
    roleOrGoal: 'Strength & Conditioning',
    rating: 5,
    testimonial: 'D FITNESS has completely elevated the gym standard in Godda. The imported equipment, clean atmosphere, and knowledgeable trainers make every workout session productive. Best decision for my health.',
    date: 'Recent Member Review',
    isDemo: true
  },
  {
    id: 'test-2',
    clientName: 'Fitness Enthusiast',
    roleOrGoal: 'Weight Loss Program',
    rating: 5,
    testimonial: 'The trainers here actually guide you on proper form and diet instead of leaving you stranded. I felt welcomed from day one. Godda needed a premium gym like this for a long time.',
    date: 'Recent Member Review',
    isDemo: true
  },
  {
    id: 'test-3',
    clientName: 'Evening Regular',
    roleOrGoal: 'Muscle Gain & Hypertrophy',
    rating: 5,
    testimonial: 'Top tier dumbbells, smooth cable machines, and powerful athletic energy. The lighting and music keep motivation high throughout heavy sets.',
    date: 'Recent Member Review',
    isDemo: true
  }
];
