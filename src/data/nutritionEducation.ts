export interface EducationTopic {
  id: string;
  category: 'Macros' | 'Timing' | 'Food Types' | 'Balance' | 'Tips';
  title: string;
  icon: string;
  content: string;
  keyPoints: string[];
  examples?: string[];
  sources: string[];
}

export const nutritionEducation: EducationTopic[] = [
  // Macros Education
  {
    id: 'protein',
    category: 'Macros',
    title: 'Protein: Your Body Builder',
    icon: '🥩',
    content: 'For weight loss, getting sufficient protein is crucial[1]! Protein builds and repairs muscles[1], keeps you full longer, and boosts metabolism. Your body burns more calories digesting protein than carbs or fats[2]!',
    keyPoints: [
      'Aim for 0.8-1g per pound of body weight for weight loss[1]',
      'Keeps you feeling full for 3-4 hours[3]',
      'Helps preserve muscle during weight loss[1]',
      'Boosts metabolism by up to 30%[2]'
    ],
    examples: [
      'Chicken breast, fish, eggs',
      'Greek yogurt, cottage cheese',
      'Lean beef, turkey',
      'Plant-based: tofu, lentils, beans'
    ],
    sources: [
      '[1] Harvard Health Publishing - The importance of protein',
      '[2] National Institutes of Health - Dietary protein and energy metabolism',
      '[3] Mayo Clinic - Nutrition and healthy eating'
    ]
  },
  {
    id: 'carbs',
    category: 'Macros',
    title: 'Carbs: Your Energy Source',
    icon: '🍠',
    content: 'Carbs are your body\'s preferred energy source[1]. Not all carbs are bad! Choose complex carbs that digest slowly and keep energy stable[2].',
    keyPoints: [
      'Complex carbs = sustained energy[2]',
      'Simple carbs = quick spike then crash[2]',
      'Time carbs around activity for best results[3]',
      'Focus on fiber-rich sources[1]'
    ],
    examples: [
      'Good: Sweet potato, brown rice, oats',
      'Good: Quinoa, whole grain bread',
      'Limit: White bread, sugary cereals',
      'Limit: Candy, soda, pastries'
    ],
    sources: [
      '[1] Academy of Nutrition and Dietetics - Carbohydrate basics',
      '[2] Harvard Health Publishing - The truth about carbs',
      '[3] International Society of Sports Nutrition - Nutrient timing'
    ]
  },
  {
    id: 'fats',
    category: 'Macros',
    title: 'Fats: Essential Nutrients',
    icon: '🥑',
    content: 'Healthy fats are crucial for hormone production, brain function, and vitamin absorption[1]. They also help you feel satisfied after meals[2].',
    keyPoints: [
      'Not all fats make you fat![1]',
      'Focus on unsaturated fats[3]',
      'Avoid trans fats completely[3]',
      'Fats help absorb vitamins A, D, E, K[1]'
    ],
    examples: [
      'Great: Avocado, olive oil, nuts',
      'Great: Fatty fish (salmon, mackerel)',
      'Good: Nut butters, seeds',
      'Avoid: Fried foods, margarine'
    ],
    sources: [
      '[1] Harvard Health Publishing - The truth about fats',
      '[2] Mayo Clinic - Dietary fats and health',
      '[3] American Heart Association - Dietary fats'
    ]
  },

  // Timing Education
  {
    id: 'breakfast',
    category: 'Timing',
    title: 'Why Protein-Rich Breakfast Wins',
    icon: '🍳',
    content: 'Starting your day with protein sets you up for success[1]. It reduces cravings all day, stabilizes blood sugar[2], and helps you eat less at lunch and dinner[1].',
    keyPoints: [
      'Eat within 1 hour of waking[1]',
      'Aim for 25-30g protein minimum[1]',
      'Reduces afternoon cravings by 60%[3]',
      'Kickstarts metabolism for the day[2]'
    ],
    examples: [
      'Greek yogurt + berries + almonds',
      '3-egg omelet with veggies',
      'Protein smoothie with banana',
      'Cottage cheese with fruit'
    ],
    sources: [
      '[1] National Institutes of Health - Protein intake and satiety',
      '[2] American Journal of Clinical Nutrition - Breakfast and metabolism',
      '[3] Cleveland Clinic - High-protein breakfast benefits'
    ]
  },
  {
    id: 'carb-timing',
    category: 'Timing',
    title: 'Strategic Carb Timing',
    icon: '⏰',
    content: 'Eat most of your carbs when your body needs them most - around activity[1]. This helps with energy, recovery, and fat loss[2].',
    keyPoints: [
      'Carbs before workout = energy[1]',
      'Carbs after workout = recovery[1]',
      'Lower carbs at night = better fat burn[2]',
      'Save carbs for when you move[1]'
    ],
    examples: [
      'Pre-workout: banana, oatmeal',
      'Post-workout: rice, sweet potato',
      'Evening: focus on protein + veggies',
      'Morning: balanced with protein'
    ],
    sources: [
      '[1] International Society of Sports Nutrition - Nutrient timing',
      '[2] Journal of Nutrition - Carbohydrate intake timing and weight loss'
    ]
  },
  {
    id: 'fasting',
    category: 'Timing',
    title: 'Intermittent Fasting Benefits',
    icon: '🕐',
    content: 'Fasting 16 hours daily gives your body time to burn fat, improve insulin sensitivity[1], and trigger cellular repair[2]. The Pound Drop Method recommends 16:8 fasting.',
    keyPoints: [
      '16 hours fasting, 8 hours eating[1]',
      'Body switches to fat-burning mode[1]',
      'Improves mental clarity and focus[2]',
      'Helps control daily calories naturally[1]'
    ],
    examples: [
      'Stop eating: 7 PM',
      'Start eating: 11 AM next day',
      'Eat 2-3 meals in 8-hour window',
      'Water, black coffee okay while fasting'
    ],
    sources: [
      '[1] Harvard Health Publishing - Intermittent fasting benefits',
      '[2] New England Journal of Medicine - Effects of intermittent fasting'
    ]
  },

  // Food Types Education
  {
    id: 'whole-foods',
    category: 'Food Types',
    title: 'Whole Foods vs Processed',
    icon: '🥗',
    content: 'Whole foods are minimally processed and closer to their natural state[1]. They contain more nutrients, fiber, and keep you full longer than processed foods[2].',
    keyPoints: [
      'One ingredient foods are best[1]',
      'If you can\'t pronounce it, skip it[1]',
      'Whole foods = more volume, fewer calories[2]',
      'Processed foods = engineered to overeat[3]'
    ],
    examples: [
      'Whole: Apple, chicken, broccoli',
      'Whole: Eggs, quinoa, salmon',
      'Processed: Chips, cookies, soda',
      'Processed: Frozen meals, candy'
    ],
    sources: [
      '[1] Mayo Clinic - Whole foods diet',
      '[2] Harvard Health Publishing - Processed foods and health',
      '[3] National Institutes of Health - Ultra-processed foods'
    ]
  },
  {
    id: 'fiber',
    category: 'Food Types',
    title: 'The Power of Fiber',
    icon: '🌾',
    content: 'Fiber is your secret weapon for weight loss[1]. It keeps you full, improves digestion[2], and helps control blood sugar[3]. Most people need 25-35g daily[1].',
    keyPoints: [
      'Slows digestion = longer fullness[1]',
      'Improves gut health and regularity[2]',
      'Helps reduce cholesterol[3]',
      'Fills you up with fewer calories[1]'
    ],
    examples: [
      'Vegetables: broccoli, Brussels sprouts',
      'Fruits: berries, apples, pears',
      'Grains: oats, quinoa, brown rice',
      'Legumes: beans, lentils, chickpeas'
    ],
    sources: [
      '[1] Academy of Nutrition and Dietetics - Fiber benefits',
      '[2] Mayo Clinic - Dietary fiber and digestive health',
      '[3] American Heart Association - Fiber and heart health'
    ]
  },
  {
    id: 'hydration',
    category: 'Food Types',
    title: 'Hydration & Weight Loss',
    icon: '💧',
    content: 'Water is essential for fat burning[1]! Drinking water before meals helps you eat less[2], and staying hydrated boosts metabolism by up to 30%[1].',
    keyPoints: [
      'Aim for 8-10 glasses (64-80 oz) daily[1]',
      'Drink 16oz before each meal[2]',
      'Thirst often feels like hunger[3]',
      'Cold water slightly boosts calorie burn[1]'
    ],
    examples: [
      'Start day: 16oz water upon waking',
      'Before meals: 8-16oz water',
      'During workout: sip frequently',
      'Flavor with: lemon, cucumber, mint'
    ],
    sources: [
      '[1] Journal of Clinical Endocrinology & Metabolism - Water and metabolism',
      '[2] Obesity Journal - Water intake and weight loss',
      '[3] National Institutes of Health - Hydration and health'
    ]
  },

  // Balance Education
  {
    id: 'plate-method',
    category: 'Balance',
    title: 'The Perfect Plate Formula',
    icon: '🍽️',
    content: 'Build balanced meals using this simple formula[1]: 1/2 plate vegetables, 1/4 lean protein, 1/4 complex carbs. This ensures proper nutrition without counting.',
    keyPoints: [
      '50% non-starchy vegetables[1]',
      '25% lean protein (palm-sized)[1]',
      '25% complex carbs (fist-sized)[1]',
      'Add small portion healthy fats[1]'
    ],
    examples: [
      'Lunch: Grilled chicken, quinoa, huge salad',
      'Dinner: Salmon, sweet potato, broccoli',
      'Breakfast: Eggs, toast, fruit',
      'Adjust portions based on hunger'
    ],
    sources: [
      '[1] American Diabetes Association - Create your plate method',
      '[2] Harvard Health Publishing - Healthy eating plate'
    ]
  },
  {
    id: '80-20-rule',
    category: 'Balance',
    title: 'The 80/20 Flexibility Rule',
    icon: '⚖️',
    content: 'Eat nutritious whole foods 80% of the time, enjoy treats 20% of the time[1]. This balance makes healthy eating sustainable long-term without feeling deprived[2].',
    keyPoints: [
      'Perfection not required for results[1]',
      '80% nutrient-dense = on track[1]',
      '20% flexibility = sustainability[2]',
      'Consistency beats perfection[1]'
    ],
    examples: [
      'Mon-Fri: stick to plan 90%',
      'Weekend: enjoy social meals',
      'Daily: 1 small treat if desired',
      'Focus on overall week, not one meal'
    ],
    sources: [
      '[1] Academy of Nutrition and Dietetics - Flexible eating approaches',
      '[2] International Journal of Eating Disorders - Sustainable nutrition'
    ]
  },
  {
    id: 'portions',
    category: 'Balance',
    title: 'Portion Control Made Easy',
    icon: '✋',
    content: 'The Pound Drop Method is NOT about calorie or carb counting - it\'s about using your hands as guidelines for healthy eating amounts[1]. This simple guide works anywhere and naturally adjusts to your body size[1].',
    keyPoints: [
      'Veggies: two cupped hands (as much as you want!)[1]',
      'Proteins: palm-sized portion[1]',
      'Starches/Carbs: fist-sized portion[1]',
      'Fats: thumb-sized portion[1]'
    ],
    examples: [
      'Vegetables: 2 cupped hands full',
      'Chicken: size of your palm',
      'Rice/potato: size of your fist',
      'Nut butter/oils: size of your thumb'
    ],
    sources: [
      '[1] British Nutrition Foundation - Hand portion guide',
      '[2] National Institutes of Health - Portion size matters'
    ]
  },

  // Tips Education
  {
    id: 'mindful-eating',
    category: 'Tips',
    title: 'Mindful Eating Strategies',
    icon: '🧘',
    content: 'Slow down and pay attention to your food[1]. It takes 20 minutes for your brain to register fullness[2]. Eating mindfully helps you eat less and enjoy more[1].',
    keyPoints: [
      'Put fork down between bites[1]',
      'Chew each bite 20-30 times[1]',
      'Eat without distractions (no phone/TV)[1]',
      'Stop at 80% full, not stuffed[2]'
    ],
    examples: [
      'Set timer for 20-min minimum meal',
      'Use smaller plates (9-inch)',
      'Drink water between bites',
      'Check hunger: 1-10 scale before eating'
    ],
    sources: [
      '[1] Harvard Health Publishing - Mindful eating',
      '[2] American Journal of Clinical Nutrition - Eating rate and satiety'
    ]
  },
  {
    id: 'cravings',
    category: 'Tips',
    title: 'Craving Control Techniques',
    icon: '🛡️',
    content: 'Cravings usually pass in 15-20 minutes[1]. Most cravings are emotional, not physical hunger[2]. Learn to identify and manage them effectively.',
    keyPoints: [
      'Wait 15 minutes before giving in[1]',
      'Drink 16oz water first[1]',
      'Ask: Am I actually hungry?[2]',
      'Distract yourself with activity[1]'
    ],
    examples: [
      'Walk for 10 minutes',
      'Call a friend',
      'Brush teeth (changes taste)',
      'Have healthy swap ready'
    ],
    sources: [
      '[1] Cleveland Clinic - Managing food cravings',
      '[2] National Institutes of Health - Emotional eating'
    ]
  },
  {
    id: 'meal-prep',
    category: 'Tips',
    title: 'Meal Prep for Success',
    icon: '📦',
    content: 'Failing to plan is planning to fail[1]. Spend 1-2 hours weekly prepping meals to set yourself up for success. You\'ll save time, money, and stay on track[2].',
    keyPoints: [
      'Prep 3-5 days of meals at once[1]',
      'Cook proteins in bulk[1]',
      'Pre-chop vegetables[1]',
      'Portion into containers[1]'
    ],
    examples: [
      'Sunday: cook 5 chicken breasts',
      'Chop veggies for week',
      'Make overnight oats',
      'Pre-portion snacks in baggies'
    ],
    sources: [
      '[1] Academy of Nutrition and Dietetics - Meal planning basics',
      '[2] Journal of Nutrition Education and Behavior - Meal prep and diet quality'
    ]
  },
  {
    id: 'eating-out',
    category: 'Tips',
    title: 'Smart Dining Out Choices',
    icon: '🍴',
    content: 'You can enjoy restaurants and stay on track[1]! Make strategic choices, control portions, and don\'t be afraid to customize your order[2].',
    keyPoints: [
      'Ask for dressing on the side[1]',
      'Choose grilled over fried[1]',
      'Skip the bread basket[1]',
      'Box half your meal immediately[2]'
    ],
    examples: [
      'Order: grilled fish, veggies, side salad',
      'Skip: creamy sauces, fried apps',
      'Swap: fries for veggies',
      'Share: dessert if desired'
    ],
    sources: [
      '[1] Mayo Clinic - Dining out healthy eating tips',
      '[2] American Heart Association - Eating out guide'
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
