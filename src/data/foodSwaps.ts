export type FoodSwap = {
  id: string;
  category: 'Breakfast' | 'Snacks' | 'Desserts' | 'Drinks' | 'Main Meals' | 'Condiments';
  craving: string;
  unhealthyOption: string;
  healthySwap: string;
  benefit: string;
  caloriesSaved: number;
  icon: string;
};

export const foodSwaps: FoodSwap[] = [
  // Breakfast Swaps
  {
    id: 'b1',
    category: 'Breakfast',
    craving: 'Sweet Breakfast',
    unhealthyOption: 'Sugary Cereal',
    healthySwap: 'Greek Yogurt + Berries',
    benefit: 'More protein, less sugar, keeps you full longer',
    caloriesSaved: 150,
    icon: '🥣'
  },
  {
    id: 'b2',
    category: 'Breakfast',
    craving: 'Pancakes',
    unhealthyOption: 'Regular Pancakes with Syrup',
    healthySwap: 'Protein Pancakes (Banana + Egg + Oats)',
    benefit: 'Higher protein, natural sweetness, better energy',
    caloriesSaved: 200,
    icon: '🥞'
  },
  {
    id: 'b3',
    category: 'Breakfast',
    craving: 'Breakfast Sandwich',
    unhealthyOption: 'Fast Food Breakfast Sandwich',
    healthySwap: 'Egg White + Avocado on Whole Grain',
    benefit: 'Less processed, healthy fats, more fiber',
    caloriesSaved: 180,
    icon: '🥪'
  },
  {
    id: 'b4',
    category: 'Breakfast',
    craving: 'Pastry',
    unhealthyOption: 'Croissant or Muffin',
    healthySwap: 'Whole Grain Toast + Almond Butter',
    benefit: 'Sustained energy, protein, healthy fats',
    caloriesSaved: 220,
    icon: '🥐'
  },

  // Snack Swaps
  {
    id: 's1',
    category: 'Snacks',
    craving: 'Crunchy & Salty',
    unhealthyOption: 'Potato Chips',
    healthySwap: 'Air-Popped Popcorn or Roasted Chickpeas',
    benefit: 'More fiber, less fat, satisfies crunch craving',
    caloriesSaved: 120,
    icon: '🍿'
  },
  {
    id: 's2',
    category: 'Snacks',
    craving: 'Creamy Dip',
    unhealthyOption: 'Ranch Dip + Chips',
    healthySwap: 'Hummus + Veggies',
    benefit: 'Plant protein, vitamins, less saturated fat',
    caloriesSaved: 140,
    icon: '🥕'
  },
  {
    id: 's3',
    category: 'Snacks',
    craving: 'Sweet & Chewy',
    unhealthyOption: 'Candy or Gummy Bears',
    healthySwap: 'Fresh Dates or Dried Apricots',
    benefit: 'Natural sugars, fiber, minerals',
    caloriesSaved: 80,
    icon: '🍬'
  },
  {
    id: 's4',
    category: 'Snacks',
    craving: 'Cheese & Crackers',
    unhealthyOption: 'Cheese & Crackers',
    healthySwap: 'Apple Slices + String Cheese',
    benefit: 'More fiber, portion control, natural sweetness',
    caloriesSaved: 90,
    icon: '🍎'
  },
  {
    id: 's5',
    category: 'Snacks',
    craving: 'Chocolate',
    unhealthyOption: 'Milk Chocolate Bar',
    healthySwap: 'Dark Chocolate (70%+) 2 squares',
    benefit: 'Antioxidants, less sugar, portion controlled',
    caloriesSaved: 100,
    icon: '🍫'
  },
  {
    id: 's6',
    category: 'Snacks',
    craving: 'Nuts',
    unhealthyOption: 'Honey Roasted Nuts',
    healthySwap: 'Raw or Lightly Salted Almonds',
    benefit: 'No added sugar, better fats, more nutrients',
    caloriesSaved: 60,
    icon: '🥜'
  },

  // Dessert Swaps
  {
    id: 'd1',
    category: 'Desserts',
    craving: 'Ice Cream',
    unhealthyOption: 'Regular Ice Cream',
    healthySwap: 'Frozen Greek Yogurt or Nice Cream (Frozen Banana)',
    benefit: 'More protein, less sugar, naturally sweet',
    caloriesSaved: 150,
    icon: '🍦'
  },
  {
    id: 'd2',
    category: 'Desserts',
    craving: 'Cookies',
    unhealthyOption: 'Store-Bought Cookies',
    healthySwap: 'Oatmeal Energy Bites (Oats + Dates + Nut Butter)',
    benefit: 'Natural sweetness, fiber, healthy fats',
    caloriesSaved: 130,
    icon: '🍪'
  },
  {
    id: 'd3',
    category: 'Desserts',
    craving: 'Cake',
    unhealthyOption: 'Regular Cake',
    healthySwap: 'Greek Yogurt + Berries + Honey Drizzle',
    benefit: 'Protein-rich, antioxidants, satisfies sweet tooth',
    caloriesSaved: 250,
    icon: '🍰'
  },
  {
    id: 'd4',
    category: 'Desserts',
    craving: 'Candy Bar',
    unhealthyOption: 'Candy Bar',
    healthySwap: 'Protein Bar or RxBar',
    benefit: 'Real ingredients, protein, sustained energy',
    caloriesSaved: 110,
    icon: '🍫'
  },

  // Drink Swaps
  {
    id: 'dr1',
    category: 'Drinks',
    craving: 'Soda',
    unhealthyOption: 'Regular Soda',
    healthySwap: 'Sparkling Water + Lemon/Lime',
    benefit: 'Zero calories, hydrating, no sugar crash',
    caloriesSaved: 140,
    icon: '🥤'
  },
  {
    id: 'dr2',
    category: 'Drinks',
    craving: 'Fruit Juice',
    unhealthyOption: 'Store-Bought Juice',
    healthySwap: 'Whole Fruit + Water',
    benefit: 'More fiber, less sugar, better satiety',
    caloriesSaved: 90,
    icon: '🧃'
  },
  {
    id: 'dr3',
    category: 'Drinks',
    craving: 'Sweetened Coffee',
    unhealthyOption: 'Frappuccino or Latte with Syrup',
    healthySwap: 'Black Coffee + Cinnamon or Unsweetened Almond Milk',
    benefit: 'No added sugar, metabolism boost, fewer calories',
    caloriesSaved: 300,
    icon: '☕'
  },
  {
    id: 'dr4',
    category: 'Drinks',
    craving: 'Energy Drink',
    unhealthyOption: 'Energy Drink',
    healthySwap: 'Green Tea or Black Coffee',
    benefit: 'Natural energy, antioxidants, no sugar',
    caloriesSaved: 110,
    icon: '⚡'
  },
  {
    id: 'dr5',
    category: 'Drinks',
    craving: 'Smoothie',
    unhealthyOption: 'Store-Bought Smoothie',
    healthySwap: 'Homemade: Spinach + Banana + Protein Powder',
    benefit: 'Control sugar, add protein, more nutrients',
    caloriesSaved: 120,
    icon: '🥤'
  },

  // Main Meal Swaps
  {
    id: 'm1',
    category: 'Main Meals',
    craving: 'Pasta',
    unhealthyOption: 'White Pasta with Creamy Sauce',
    healthySwap: 'Zucchini Noodles or Whole Grain Pasta + Marinara',
    benefit: 'More veggies, less refined carbs, lighter feeling',
    caloriesSaved: 200,
    icon: '🍝'
  },
  {
    id: 'm2',
    category: 'Main Meals',
    craving: 'Pizza',
    unhealthyOption: 'Regular Pizza',
    healthySwap: 'Cauliflower Crust Pizza or Thin Crust with Veggie Toppings',
    benefit: 'More vegetables, less refined flour, portion control',
    caloriesSaved: 180,
    icon: '🍕'
  },
  {
    id: 'm3',
    category: 'Main Meals',
    craving: 'Burger',
    unhealthyOption: 'Regular Burger + Fries',
    healthySwap: 'Turkey or Veggie Burger + Sweet Potato Fries',
    benefit: 'Leaner protein, complex carbs, more nutrients',
    caloriesSaved: 250,
    icon: '🍔'
  },
  {
    id: 'm4',
    category: 'Main Meals',
    craving: 'Rice',
    unhealthyOption: 'White Rice',
    healthySwap: 'Cauliflower Rice or Brown Rice',
    benefit: 'More fiber, lower glycemic, more filling',
    caloriesSaved: 100,
    icon: '🍚'
  },
  {
    id: 'm5',
    category: 'Main Meals',
    craving: 'Fried Chicken',
    unhealthyOption: 'Deep Fried Chicken',
    healthySwap: 'Air-Fried or Grilled Chicken',
    benefit: 'Much less oil, same satisfaction, more protein absorption',
    caloriesSaved: 220,
    icon: '🍗'
  },

  // Condiment Swaps
  {
    id: 'c1',
    category: 'Condiments',
    craving: 'Mayo',
    unhealthyOption: 'Regular Mayonnaise',
    healthySwap: 'Avocado or Greek Yogurt',
    benefit: 'Healthy fats, protein, less processed',
    caloriesSaved: 70,
    icon: '🥑'
  },
  {
    id: 'c2',
    category: 'Condiments',
    craving: 'Salad Dressing',
    unhealthyOption: 'Creamy Dressing',
    healthySwap: 'Olive Oil + Balsamic Vinegar',
    benefit: 'Healthy fats, no added sugar, simple ingredients',
    caloriesSaved: 80,
    icon: '🥗'
  },
  {
    id: 'c3',
    category: 'Condiments',
    craving: 'Butter',
    unhealthyOption: 'Regular Butter on Everything',
    healthySwap: 'Olive Oil or Avocado (on toast)',
    benefit: 'Heart-healthy fats, more nutrients',
    caloriesSaved: 50,
    icon: '🧈'
  },
  {
    id: 'c4',
    category: 'Condiments',
    craving: 'Ketchup',
    unhealthyOption: 'Regular Ketchup',
    healthySwap: 'Sugar-Free Ketchup or Salsa',
    benefit: 'Less sugar, more flavor, fewer calories',
    caloriesSaved: 40,
    icon: '🍅'
  },
];

export const swapCategories = [
  'All',
  'Breakfast',
  'Snacks',
  'Desserts',
  'Drinks',
  'Main Meals',
  'Condiments'
] as const;
