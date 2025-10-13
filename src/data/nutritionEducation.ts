export interface EducationTopic {
  id: string;
  category: 'Macros' | 'Timing' | 'Food Types' | 'Balance' | 'Tips';
  title: string;
  icon: string;
  content: string;
  keyPoints: string[];
  examples?: string[];
}

export const nutritionEducation: EducationTopic[] = [
  // Macros Education
  {
    id: 'protein',
    category: 'Macros',
    title: 'Protein: Your Body Builder',
    icon: '🥩',
    content: 'Protein is essential for building and repairing muscles, keeping you full longer, and boosting metabolism. Your body burns more calories digesting protein than carbs or fats!',
    keyPoints: [
      'Aim for 0.8-1g per pound of body weight',
      'Keeps you feeling full for 3-4 hours',
      'Helps preserve muscle during weight loss',
      'Boosts metabolism by up to 30%'
    ],
    examples: [
      'Chicken breast, fish, eggs',
      'Greek yogurt, cottage cheese',
      'Lean beef, turkey',
      'Plant-based: tofu, lentils, beans'
    ]
  },
  {
    id: 'carbs',
    category: 'Macros',
    title: 'Carbs: Your Energy Source',
    icon: '🍠',
    content: 'Carbs are your body\'s preferred energy source. Not all carbs are bad! Choose complex carbs that digest slowly and keep energy stable.',
    keyPoints: [
      'Complex carbs = sustained energy',
      'Simple carbs = quick spike then crash',
      'Time carbs around activity for best results',
      'Focus on fiber-rich sources'
    ],
    examples: [
      'Good: Sweet potato, brown rice, oats',
      'Good: Quinoa, whole grain bread',
      'Limit: White bread, sugary cereals',
      'Limit: Candy, soda, pastries'
    ]
  },
  {
    id: 'fats',
    category: 'Macros',
    title: 'Fats: Essential Nutrients',
    icon: '🥑',
    content: 'Healthy fats are crucial for hormone production, brain function, and vitamin absorption. They also help you feel satisfied after meals.',
    keyPoints: [
      'Not all fats make you fat!',
      'Focus on unsaturated fats',
      'Avoid trans fats completely',
      'Fats help absorb vitamins A, D, E, K'
    ],
    examples: [
      'Great: Avocado, olive oil, nuts',
      'Great: Fatty fish (salmon, mackerel)',
      'Good: Nut butters, seeds',
      'Avoid: Fried foods, margarine'
    ]
  },

  // Timing Education
  {
    id: 'breakfast',
    category: 'Timing',
    title: 'Why Protein-Rich Breakfast Wins',
    icon: '🍳',
    content: 'Starting your day with protein sets you up for success. It reduces cravings all day, stabilizes blood sugar, and helps you eat less at lunch and dinner.',
    keyPoints: [
      'Eat within 1 hour of waking',
      'Aim for 25-30g protein minimum',
      'Reduces afternoon cravings by 60%',
      'Kickstarts metabolism for the day'
    ],
    examples: [
      'Greek yogurt + berries + almonds',
      '3-egg omelet with veggies',
      'Protein smoothie with banana',
      'Cottage cheese with fruit'
    ]
  },
  {
    id: 'carb-timing',
    category: 'Timing',
    title: 'Strategic Carb Timing',
    icon: '⏰',
    content: 'Eat most of your carbs when your body needs them most - around activity. This helps with energy, recovery, and fat loss.',
    keyPoints: [
      'Carbs before workout = energy',
      'Carbs after workout = recovery',
      'Lower carbs at night = better fat burn',
      'Save carbs for when you move'
    ],
    examples: [
      'Pre-workout: banana, oatmeal',
      'Post-workout: rice, sweet potato',
      'Evening: focus on protein + veggies',
      'Morning: balanced with protein'
    ]
  },
  {
    id: 'fasting',
    category: 'Timing',
    title: 'Intermittent Fasting Benefits',
    icon: '🕐',
    content: 'Fasting 16 hours daily gives your body time to burn fat, improve insulin sensitivity, and trigger cellular repair. The Pound Drop Method recommends 16:8 fasting.',
    keyPoints: [
      '16 hours fasting, 8 hours eating',
      'Body switches to fat-burning mode',
      'Improves mental clarity and focus',
      'Helps control daily calories naturally'
    ],
    examples: [
      'Stop eating: 7 PM',
      'Start eating: 11 AM next day',
      'Eat 2-3 meals in 8-hour window',
      'Water, black coffee okay while fasting'
    ]
  },

  // Food Types Education
  {
    id: 'whole-foods',
    category: 'Food Types',
    title: 'Whole Foods vs Processed',
    icon: '🥗',
    content: 'Whole foods are minimally processed and closer to their natural state. They contain more nutrients, fiber, and keep you full longer than processed foods.',
    keyPoints: [
      'One ingredient foods are best',
      'If you can\'t pronounce it, skip it',
      'Whole foods = more volume, fewer calories',
      'Processed foods = engineered to overeat'
    ],
    examples: [
      'Whole: Apple, chicken, broccoli',
      'Whole: Eggs, quinoa, salmon',
      'Processed: Chips, cookies, soda',
      'Processed: Frozen meals, candy'
    ]
  },
  {
    id: 'fiber',
    category: 'Food Types',
    title: 'The Power of Fiber',
    icon: '🌾',
    content: 'Fiber is your secret weapon for weight loss. It keeps you full, improves digestion, and helps control blood sugar. Most people need 25-35g daily.',
    keyPoints: [
      'Slows digestion = longer fullness',
      'Improves gut health and regularity',
      'Helps reduce cholesterol',
      'Fills you up with fewer calories'
    ],
    examples: [
      'Vegetables: broccoli, Brussels sprouts',
      'Fruits: berries, apples, pears',
      'Grains: oats, quinoa, brown rice',
      'Legumes: beans, lentils, chickpeas'
    ]
  },
  {
    id: 'hydration',
    category: 'Food Types',
    title: 'Hydration & Weight Loss',
    icon: '💧',
    content: 'Water is essential for fat burning! Drinking water before meals helps you eat less, and staying hydrated boosts metabolism by up to 30%.',
    keyPoints: [
      'Aim for 8-10 glasses (64-80 oz) daily',
      'Drink 16oz before each meal',
      'Thirst often feels like hunger',
      'Cold water slightly boosts calorie burn'
    ],
    examples: [
      'Start day: 16oz water upon waking',
      'Before meals: 8-16oz water',
      'During workout: sip frequently',
      'Flavor with: lemon, cucumber, mint'
    ]
  },

  // Balance Education
  {
    id: 'plate-method',
    category: 'Balance',
    title: 'The Perfect Plate Formula',
    icon: '🍽️',
    content: 'Build balanced meals using this simple formula: 1/2 plate vegetables, 1/4 lean protein, 1/4 complex carbs. This ensures proper nutrition without counting.',
    keyPoints: [
      '50% non-starchy vegetables',
      '25% lean protein (palm-sized)',
      '25% complex carbs (fist-sized)',
      'Add small portion healthy fats'
    ],
    examples: [
      'Lunch: Grilled chicken, quinoa, huge salad',
      'Dinner: Salmon, sweet potato, broccoli',
      'Breakfast: Eggs, toast, fruit',
      'Adjust portions based on hunger'
    ]
  },
  {
    id: '80-20-rule',
    category: 'Balance',
    title: 'The 80/20 Flexibility Rule',
    icon: '⚖️',
    content: 'Eat nutritious whole foods 80% of the time, enjoy treats 20% of the time. This balance makes healthy eating sustainable long-term without feeling deprived.',
    keyPoints: [
      'Perfection not required for results',
      '80% nutrient-dense = on track',
      '20% flexibility = sustainability',
      'Consistency beats perfection'
    ],
    examples: [
      'Mon-Fri: stick to plan 90%',
      'Weekend: enjoy social meals',
      'Daily: 1 small treat if desired',
      'Focus on overall week, not one meal'
    ]
  },
  {
    id: 'portions',
    category: 'Balance',
    title: 'Portion Control Made Easy',
    icon: '✋',
    content: 'Use your hand as a portion guide. No scales needed! This simple method works anywhere and naturally adjusts to your body size.',
    keyPoints: [
      'Protein: palm-sized portion',
      'Carbs: cupped hand or fist-sized',
      'Fats: thumb-sized portion',
      'Veggies: as much as you can hold'
    ],
    examples: [
      'Chicken: size of your palm',
      'Rice: size of your fist',
      'Nut butter: size of your thumb',
      'Vegetables: 2 hands full'
    ]
  },

  // Tips Education
  {
    id: 'mindful-eating',
    category: 'Tips',
    title: 'Mindful Eating Strategies',
    icon: '🧘',
    content: 'Slow down and pay attention to your food. It takes 20 minutes for your brain to register fullness. Eating mindfully helps you eat less and enjoy more.',
    keyPoints: [
      'Put fork down between bites',
      'Chew each bite 20-30 times',
      'Eat without distractions (no phone/TV)',
      'Stop at 80% full, not stuffed'
    ],
    examples: [
      'Set timer for 20-min minimum meal',
      'Use smaller plates (9-inch)',
      'Drink water between bites',
      'Check hunger: 1-10 scale before eating'
    ]
  },
  {
    id: 'cravings',
    category: 'Tips',
    title: 'Craving Control Techniques',
    icon: '🛡️',
    content: 'Cravings usually pass in 15-20 minutes. Most cravings are emotional, not physical hunger. Learn to identify and manage them effectively.',
    keyPoints: [
      'Wait 15 minutes before giving in',
      'Drink 16oz water first',
      'Ask: Am I actually hungry?',
      'Distract yourself with activity'
    ],
    examples: [
      'Walk for 10 minutes',
      'Call a friend',
      'Brush teeth (changes taste)',
      'Have healthy swap ready'
    ]
  },
  {
    id: 'meal-prep',
    category: 'Tips',
    title: 'Meal Prep for Success',
    icon: '📦',
    content: 'Failing to plan is planning to fail. Spend 1-2 hours weekly prepping meals to set yourself up for success. You\'ll save time, money, and stay on track.',
    keyPoints: [
      'Prep 3-5 days of meals at once',
      'Cook proteins in bulk',
      'Pre-chop vegetables',
      'Portion into containers'
    ],
    examples: [
      'Sunday: cook 5 chicken breasts',
      'Chop veggies for week',
      'Make overnight oats',
      'Pre-portion snacks in baggies'
    ]
  },
  {
    id: 'eating-out',
    category: 'Tips',
    title: 'Smart Dining Out Choices',
    icon: '🍴',
    content: 'You can enjoy restaurants and stay on track! Make strategic choices, control portions, and don\'t be afraid to customize your order.',
    keyPoints: [
      'Ask for dressing on the side',
      'Choose grilled over fried',
      'Skip the bread basket',
      'Box half your meal immediately'
    ],
    examples: [
      'Order: grilled fish, veggies, side salad',
      'Skip: creamy sauces, fried apps',
      'Swap: fries for veggies',
      'Share: dessert if desired'
    ]
  },
];

export const educationCategories = [
  'All',
  'Macros',
  'Timing',
  'Food Types',
  'Balance',
  'Tips'
] as const;
