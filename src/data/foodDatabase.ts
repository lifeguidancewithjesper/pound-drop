export interface FoodItem {
  id: string;
  name: string;
  category: string;
  calories?: number;
  protein?: number;
  fiber?: number;
}

export const foodDatabase: FoodItem[] = [
  // Proteins
  { id: '1', name: 'Chicken Breast (grilled)', category: 'Protein', calories: 165, protein: 31, fiber: 0 },
  { id: '2', name: 'Salmon (baked)', category: 'Protein', calories: 206, protein: 22, fiber: 0 },
  { id: '3', name: 'Eggs (boiled)', category: 'Protein', calories: 78, protein: 6, fiber: 0 },
  { id: '4', name: 'Greek Yogurt (plain)', category: 'Protein', calories: 100, protein: 17, fiber: 0 },
  { id: '5', name: 'Tofu', category: 'Protein', calories: 144, protein: 17, fiber: 2 },
  { id: '6', name: 'Turkey Breast', category: 'Protein', calories: 135, protein: 30, fiber: 0 },
  { id: '7', name: 'Tuna (canned in water)', category: 'Protein', calories: 128, protein: 28, fiber: 0 },
  { id: '8', name: 'Lean Beef', category: 'Protein', calories: 250, protein: 26, fiber: 0 },
  { id: '9', name: 'Shrimp', category: 'Protein', calories: 99, protein: 24, fiber: 0 },
  { id: '10', name: 'Cottage Cheese', category: 'Protein', calories: 98, protein: 11, fiber: 0 },
  { id: '11', name: 'Pork Tenderloin', category: 'Protein', calories: 143, protein: 26, fiber: 0 },
  { id: '12', name: 'Cod Fish', category: 'Protein', calories: 82, protein: 18, fiber: 0 },
  { id: '13', name: 'Tilapia', category: 'Protein', calories: 96, protein: 20, fiber: 0 },
  { id: '14', name: 'Protein Powder (1 scoop)', category: 'Protein', calories: 120, protein: 24, fiber: 0 },
  { id: '15', name: 'Chicken Thighs', category: 'Protein', calories: 209, protein: 26, fiber: 0 },
  { id: '16', name: 'Ground Turkey', category: 'Protein', calories: 170, protein: 20, fiber: 0 },
  { id: '17', name: 'Sardines', category: 'Protein', calories: 191, protein: 23, fiber: 0 },
  { id: '18', name: 'Bacon (2 strips)', category: 'Protein', calories: 86, protein: 6, fiber: 0 },
  { id: '19', name: 'Ham', category: 'Protein', calories: 145, protein: 21, fiber: 0 },
  { id: '20', name: 'Sausage', category: 'Protein', calories: 196, protein: 14, fiber: 0 },
  
  // Vegetables
  { id: '21', name: 'Broccoli', category: 'Vegetables', calories: 55, protein: 4, fiber: 5 },
  { id: '22', name: 'Spinach', category: 'Vegetables', calories: 23, protein: 3, fiber: 2 },
  { id: '23', name: 'Kale', category: 'Vegetables', calories: 49, protein: 4, fiber: 4 },
  { id: '24', name: 'Carrots', category: 'Vegetables', calories: 41, protein: 1, fiber: 3 },
  { id: '25', name: 'Bell Peppers', category: 'Vegetables', calories: 31, protein: 1, fiber: 3 },
  { id: '26', name: 'Tomatoes', category: 'Vegetables', calories: 18, protein: 1, fiber: 1 },
  { id: '27', name: 'Cucumbers', category: 'Vegetables', calories: 16, protein: 1, fiber: 1 },
  { id: '28', name: 'Cauliflower', category: 'Vegetables', calories: 25, protein: 2, fiber: 3 },
  { id: '29', name: 'Zucchini', category: 'Vegetables', calories: 17, protein: 1, fiber: 1 },
  { id: '30', name: 'Green Beans', category: 'Vegetables', calories: 31, protein: 2, fiber: 3 },
  { id: '31', name: 'Asparagus', category: 'Vegetables', calories: 20, protein: 2, fiber: 2 },
  { id: '32', name: 'Brussels Sprouts', category: 'Vegetables', calories: 43, protein: 3, fiber: 4 },
  { id: '33', name: 'Lettuce (mixed greens)', category: 'Vegetables', calories: 15, protein: 1, fiber: 1 },
  { id: '34', name: 'Mushrooms', category: 'Vegetables', calories: 22, protein: 3, fiber: 1 },
  { id: '35', name: 'Onions', category: 'Vegetables', calories: 40, protein: 1, fiber: 2 },
  { id: '36', name: 'Celery', category: 'Vegetables', calories: 14, protein: 1, fiber: 2 },
  { id: '37', name: 'Eggplant', category: 'Vegetables', calories: 25, protein: 1, fiber: 3 },
  { id: '38', name: 'Cabbage', category: 'Vegetables', calories: 22, protein: 1, fiber: 2 },
  { id: '39', name: 'Radishes', category: 'Vegetables', calories: 16, protein: 1, fiber: 2 },
  { id: '40', name: 'Beets', category: 'Vegetables', calories: 43, protein: 2, fiber: 4 },
  { id: '41', name: 'Sweet Corn', category: 'Vegetables', calories: 86, protein: 3, fiber: 2 },
  { id: '42', name: 'Peas', category: 'Vegetables', calories: 81, protein: 5, fiber: 5 },
  { id: '43', name: 'Arugula', category: 'Vegetables', calories: 5, protein: 1, fiber: 0 },
  { id: '44', name: 'Swiss Chard', category: 'Vegetables', calories: 7, protein: 1, fiber: 1 },
  
  // Fruits
  { id: '45', name: 'Apple', category: 'Fruits', calories: 95, protein: 0, fiber: 4 },
  { id: '46', name: 'Banana', category: 'Fruits', calories: 105, protein: 1, fiber: 3 },
  { id: '47', name: 'Berries (mixed)', category: 'Fruits', calories: 57, protein: 1, fiber: 4 },
  { id: '48', name: 'Orange', category: 'Fruits', calories: 62, protein: 1, fiber: 3 },
  { id: '49', name: 'Strawberries', category: 'Fruits', calories: 32, protein: 1, fiber: 2 },
  { id: '50', name: 'Blueberries', category: 'Fruits', calories: 84, protein: 1, fiber: 4 },
  { id: '51', name: 'Avocado', category: 'Fruits', calories: 234, protein: 3, fiber: 10 },
  { id: '52', name: 'Watermelon', category: 'Fruits', calories: 46, protein: 1, fiber: 1 },
  { id: '53', name: 'Grapes', category: 'Fruits', calories: 104, protein: 1, fiber: 1 },
  { id: '54', name: 'Pineapple', category: 'Fruits', calories: 82, protein: 1, fiber: 2 },
  { id: '55', name: 'Mango', category: 'Fruits', calories: 99, protein: 1, fiber: 3 },
  { id: '56', name: 'Peach', category: 'Fruits', calories: 59, protein: 1, fiber: 2 },
  { id: '57', name: 'Pear', category: 'Fruits', calories: 101, protein: 1, fiber: 6 },
  { id: '58', name: 'Plum', category: 'Fruits', calories: 30, protein: 0, fiber: 1 },
  { id: '59', name: 'Kiwi', category: 'Fruits', calories: 61, protein: 1, fiber: 3 },
  { id: '60', name: 'Raspberries', category: 'Fruits', calories: 64, protein: 1, fiber: 8 },
  { id: '61', name: 'Blackberries', category: 'Fruits', calories: 62, protein: 2, fiber: 8 },
  { id: '62', name: 'Cantaloupe', category: 'Fruits', calories: 53, protein: 1, fiber: 1 },
  { id: '63', name: 'Honeydew Melon', category: 'Fruits', calories: 64, protein: 1, fiber: 1 },
  { id: '64', name: 'Cherries', category: 'Fruits', calories: 77, protein: 1, fiber: 2 },
  { id: '65', name: 'Grapefruit', category: 'Fruits', calories: 52, protein: 1, fiber: 2 },
  { id: '66', name: 'Papaya', category: 'Fruits', calories: 43, protein: 0, fiber: 2 },
  { id: '67', name: 'Pomegranate', category: 'Fruits', calories: 83, protein: 2, fiber: 4 },
  
  // Whole Grains & Carbs
  { id: '68', name: 'Brown Rice (cooked)', category: 'Grains', calories: 216, protein: 5, fiber: 4 },
  { id: '69', name: 'Quinoa (cooked)', category: 'Grains', calories: 222, protein: 8, fiber: 5 },
  { id: '70', name: 'Oatmeal', category: 'Grains', calories: 158, protein: 6, fiber: 4 },
  { id: '71', name: 'Oats (rolled)', category: 'Grains', calories: 307, protein: 11, fiber: 8 },
  { id: '72', name: 'Steel Cut Oats', category: 'Grains', calories: 150, protein: 5, fiber: 4 },
  { id: '73', name: 'Instant Oats', category: 'Grains', calories: 154, protein: 6, fiber: 4 },
  { id: '74', name: 'Overnight Oats', category: 'Grains', calories: 158, protein: 6, fiber: 4 },
  { id: '75', name: 'Whole Wheat Bread (1 slice)', category: 'Grains', calories: 81, protein: 4, fiber: 2 },
  { id: '76', name: 'Sweet Potato', category: 'Grains', calories: 112, protein: 2, fiber: 4 },
  { id: '77', name: 'Whole Wheat Pasta (cooked)', category: 'Grains', calories: 174, protein: 7, fiber: 6 },
  { id: '78', name: 'White Rice (cooked)', category: 'Grains', calories: 205, protein: 4, fiber: 1 },
  { id: '79', name: 'Couscous', category: 'Grains', calories: 176, protein: 6, fiber: 2 },
  { id: '80', name: 'Barley', category: 'Grains', calories: 193, protein: 4, fiber: 6 },
  { id: '81', name: 'Bulgur Wheat', category: 'Grains', calories: 151, protein: 6, fiber: 8 },
  { id: '82', name: 'Wild Rice', category: 'Grains', calories: 166, protein: 7, fiber: 3 },
  { id: '83', name: 'White Potato (baked)', category: 'Grains', calories: 163, protein: 4, fiber: 4 },
  { id: '84', name: 'Sourdough Bread (1 slice)', category: 'Grains', calories: 93, protein: 4, fiber: 1 },
  { id: '85', name: 'Bagel (whole)', category: 'Grains', calories: 277, protein: 11, fiber: 2 },
  { id: '86', name: 'English Muffin', category: 'Grains', calories: 134, protein: 5, fiber: 2 },
  { id: '87', name: 'Tortilla (whole wheat)', category: 'Grains', calories: 120, protein: 4, fiber: 3 },
  { id: '88', name: 'Pita Bread (whole wheat)', category: 'Grains', calories: 170, protein: 6, fiber: 5 },
  { id: '89', name: 'Crackers (whole grain, 10)', category: 'Grains', calories: 120, protein: 3, fiber: 2 },
  { id: '90', name: 'Granola (1/2 cup)', category: 'Grains', calories: 299, protein: 9, fiber: 6 },
  { id: '91', name: 'Cereal (whole grain, 1 cup)', category: 'Grains', calories: 110, protein: 3, fiber: 3 },
  { id: '92', name: 'Pasta (white, cooked)', category: 'Grains', calories: 220, protein: 8, fiber: 3 },
  { id: '93', name: 'Rice Cakes (2)', category: 'Grains', calories: 70, protein: 1, fiber: 1 },
  
  // Healthy Fats
  { id: '94', name: 'Almonds', category: 'Healthy Fats', calories: 164, protein: 6, fiber: 4 },
  { id: '95', name: 'Walnuts', category: 'Healthy Fats', calories: 185, protein: 4, fiber: 2 },
  { id: '96', name: 'Olive Oil (1 tbsp)', category: 'Healthy Fats', calories: 119, protein: 0, fiber: 0 },
  { id: '97', name: 'Peanut Butter (2 tbsp)', category: 'Healthy Fats', calories: 188, protein: 8, fiber: 2 },
  { id: '98', name: 'Chia Seeds', category: 'Healthy Fats', calories: 138, protein: 5, fiber: 10 },
  { id: '99', name: 'Flaxseeds', category: 'Healthy Fats', calories: 150, protein: 5, fiber: 8 },
  { id: '100', name: 'Cashews', category: 'Healthy Fats', calories: 157, protein: 5, fiber: 1 },
  { id: '101', name: 'Pecans', category: 'Healthy Fats', calories: 196, protein: 3, fiber: 3 },
  { id: '102', name: 'Pistachios', category: 'Healthy Fats', calories: 159, protein: 6, fiber: 3 },
  { id: '103', name: 'Macadamia Nuts', category: 'Healthy Fats', calories: 204, protein: 2, fiber: 2 },
  { id: '104', name: 'Brazil Nuts', category: 'Healthy Fats', calories: 186, protein: 4, fiber: 2 },
  { id: '105', name: 'Sunflower Seeds', category: 'Healthy Fats', calories: 165, protein: 6, fiber: 3 },
  { id: '106', name: 'Pumpkin Seeds', category: 'Healthy Fats', calories: 151, protein: 7, fiber: 2 },
  { id: '107', name: 'Almond Butter (2 tbsp)', category: 'Healthy Fats', calories: 196, protein: 7, fiber: 3 },
  { id: '108', name: 'Coconut Oil (1 tbsp)', category: 'Healthy Fats', calories: 121, protein: 0, fiber: 0 },
  { id: '109', name: 'Avocado Oil (1 tbsp)', category: 'Healthy Fats', calories: 124, protein: 0, fiber: 0 },
  { id: '110', name: 'Hemp Seeds', category: 'Healthy Fats', calories: 166, protein: 10, fiber: 1 },
  { id: '111', name: 'Sesame Seeds', category: 'Healthy Fats', calories: 160, protein: 5, fiber: 4 },
  
  // Legumes
  { id: '112', name: 'Black Beans (cooked)', category: 'Legumes', calories: 227, protein: 15, fiber: 15 },
  { id: '113', name: 'Chickpeas (cooked)', category: 'Legumes', calories: 269, protein: 14, fiber: 12 },
  { id: '114', name: 'Lentils (cooked)', category: 'Legumes', calories: 230, protein: 18, fiber: 16 },
  { id: '115', name: 'Kidney Beans', category: 'Legumes', calories: 225, protein: 15, fiber: 13 },
  { id: '116', name: 'Pinto Beans', category: 'Legumes', calories: 245, protein: 15, fiber: 15 },
  { id: '117', name: 'Navy Beans', category: 'Legumes', calories: 255, protein: 15, fiber: 19 },
  { id: '118', name: 'Lima Beans', category: 'Legumes', calories: 216, protein: 15, fiber: 13 },
  { id: '119', name: 'Edamame', category: 'Legumes', calories: 188, protein: 17, fiber: 8 },
  { id: '120', name: 'Hummus (2 tbsp)', category: 'Legumes', calories: 50, protein: 2, fiber: 1 },
  
  // Dairy & Alternatives
  { id: '121', name: 'Milk (2%)', category: 'Dairy', calories: 122, protein: 8, fiber: 0 },
  { id: '122', name: 'Milk (skim)', category: 'Dairy', calories: 83, protein: 8, fiber: 0 },
  { id: '123', name: 'Almond Milk (unsweetened)', category: 'Dairy', calories: 30, protein: 1, fiber: 0 },
  { id: '124', name: 'Oat Milk', category: 'Dairy', calories: 120, protein: 3, fiber: 2 },
  { id: '125', name: 'Soy Milk', category: 'Dairy', calories: 80, protein: 7, fiber: 1 },
  { id: '126', name: 'Coconut Milk', category: 'Dairy', calories: 45, protein: 0, fiber: 0 },
  { id: '127', name: 'Cheddar Cheese (1 oz)', category: 'Dairy', calories: 113, protein: 7, fiber: 0 },
  { id: '128', name: 'Mozzarella Cheese (1 oz)', category: 'Dairy', calories: 85, protein: 6, fiber: 0 },
  { id: '129', name: 'Feta Cheese (1 oz)', category: 'Dairy', calories: 75, protein: 4, fiber: 0 },
  { id: '130', name: 'Parmesan Cheese (1 oz)', category: 'Dairy', calories: 111, protein: 10, fiber: 0 },
  { id: '131', name: 'Cream Cheese (2 tbsp)', category: 'Dairy', calories: 101, protein: 2, fiber: 0 },
  { id: '132', name: 'Sour Cream (2 tbsp)', category: 'Dairy', calories: 60, protein: 1, fiber: 0 },
  { id: '133', name: 'Yogurt (low-fat)', category: 'Dairy', calories: 154, protein: 13, fiber: 0 },
  { id: '134', name: 'Kefir', category: 'Dairy', calories: 104, protein: 9, fiber: 0 },
  
  // Snacks & Other
  { id: '135', name: 'Dark Chocolate (1 oz)', category: 'Snacks', calories: 170, protein: 2, fiber: 3 },
  { id: '136', name: 'Popcorn (air-popped, 3 cups)', category: 'Snacks', calories: 93, protein: 3, fiber: 4 },
  { id: '137', name: 'Protein Bar', category: 'Snacks', calories: 200, protein: 20, fiber: 3 },
  { id: '138', name: 'Energy Bar', category: 'Snacks', calories: 230, protein: 10, fiber: 4 },
  { id: '139', name: 'Trail Mix (1/4 cup)', category: 'Snacks', calories: 173, protein: 5, fiber: 2 },
  { id: '140', name: 'Beef Jerky (1 oz)', category: 'Snacks', calories: 116, protein: 9, fiber: 0 },
  { id: '141', name: 'Rice Crackers (10)', category: 'Snacks', calories: 120, protein: 2, fiber: 1 },
  { id: '142', name: 'Pretzels (1 oz)', category: 'Snacks', calories: 108, protein: 3, fiber: 1 },
  { id: '143', name: 'Fruit Smoothie', category: 'Snacks', calories: 200, protein: 5, fiber: 4 },
  { id: '144', name: 'Green Smoothie', category: 'Snacks', calories: 150, protein: 4, fiber: 6 },
  { id: '145', name: 'Protein Shake', category: 'Snacks', calories: 180, protein: 25, fiber: 2 },
];

export function searchFoods(query: string): FoodItem[] {
  if (!query.trim()) {
    return foodDatabase;
  }
  
  const lowerQuery = query.toLowerCase();
  return foodDatabase.filter(food => 
    food.name.toLowerCase().includes(lowerQuery) ||
    food.category.toLowerCase().includes(lowerQuery)
  );
}