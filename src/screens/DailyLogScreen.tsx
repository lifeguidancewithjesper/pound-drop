import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStorage } from '../context/StorageContext';

export default function DailyLogScreen({ navigation }: any) {
  const { logs, calculateCalories, calculateMacros } = useStorage();

  const exportToHTML = async () => {
    if (logs.length === 0) {
      Alert.alert('No Data', 'No food logs to export');
      return;
    }

    // Calculate totals
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    sortedLogs.forEach((dayLog) => {
      const calorieData = dayLog.meals ? calculateCalories(dayLog.meals, dayLog.snacks) : { total: 0 };
      const macroData = dayLog.meals ? calculateMacros(dayLog.meals, dayLog.snacks) : { total: { protein: 0, carbs: 0, fat: 0 } };
      totalCalories += calorieData.total;
      totalProtein += macroData.total.protein;
      totalCarbs += macroData.total.carbs;
      totalFat += macroData.total.fat;
    });

    const avgCalories = Math.round(totalCalories / sortedLogs.length);
    const avgProtein = Math.round(totalProtein / sortedLogs.length);
    const avgCarbs = Math.round(totalCarbs / sortedLogs.length);
    const avgFat = Math.round(totalFat / sortedLogs.length);

    // Generate HTML content
    let htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pound Drop - Food Log Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: #f9fafb; padding: 20px; }
    .container { max-width: 900px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #9333EA 0%, #EC4899 100%); color: white; padding: 40px 30px; text-align: center; }
    .header h1 { font-size: 32px; font-weight: 700; margin-bottom: 8px; }
    .header p { font-size: 16px; opacity: 0.95; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; background: #faf5ff; }
    .stat-card { text-align: center; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(147,51,234,0.1); }
    .stat-value { font-size: 28px; font-weight: 700; color: #9333EA; margin-bottom: 4px; }
    .stat-label { font-size: 14px; color: #6b7280; }
    .day-section { padding: 30px; border-bottom: 1px solid #e5e7eb; }
    .day-section:last-child { border-bottom: none; }
    .date-header { font-size: 20px; font-weight: 600; color: #1f2937; margin-bottom: 20px; display: flex; align-items: center; }
    .date-icon { width: 24px; height: 24px; margin-right: 8px; color: #9333EA; }
    .meal-section { margin-bottom: 20px; }
    .meal-title { font-size: 16px; font-weight: 600; color: #9333EA; margin-bottom: 12px; }
    .meal-time { font-size: 14px; color: #6b7280; margin-left: 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th { background: #f3f4f6; text-align: left; padding: 10px; font-size: 13px; color: #6b7280; font-weight: 600; }
    td { padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #374151; }
    tr:last-child td { border-bottom: none; }
    .nutrition-totals { background: #faf5ff; padding: 15px; border-radius: 8px; margin-top: 20px; }
    .nutrition-row { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 15px; }
    .nutrition-item { text-align: center; }
    .nutrition-value { font-size: 20px; font-weight: 700; color: #9333EA; }
    .nutrition-label { font-size: 12px; color: #6b7280; margin-top: 4px; }
    .footer { text-align: center; padding: 30px; background: #f9fafb; color: #9ca3af; font-size: 14px; }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Pound Drop Food Log</h1>
      <p>Your complete nutrition journey - ${sortedLogs.length} ${sortedLogs.length === 1 ? 'day' : 'days'} tracked</p>
    </div>

    <div class="summary">
      <div class="stat-card">
        <div class="stat-value">${avgCalories}</div>
        <div class="stat-label">Avg Calories/Day</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${avgProtein}g</div>
        <div class="stat-label">Avg Protein/Day</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${avgCarbs}g</div>
        <div class="stat-label">Avg Carbs/Day</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${avgFat}g</div>
        <div class="stat-label">Avg Fat/Day</div>
      </div>
    </div>
`;

    sortedLogs.forEach((dayLog) => {
      const date = formatDateHeader(dayLog.date);
      const calorieData = dayLog.meals ? calculateCalories(dayLog.meals, dayLog.snacks) : { total: 0, breakfast: 0, lunch: 0, dinner: 0 };
      const macroData = dayLog.meals ? calculateMacros(dayLog.meals, dayLog.snacks) : { total: { protein: 0, carbs: 0, fat: 0 }, breakfast: { protein: 0, carbs: 0, fat: 0 }, lunch: { protein: 0, carbs: 0, fat: 0 }, dinner: { protein: 0, carbs: 0, fat: 0 } };

      htmlContent += `
    <div class="day-section">
      <div class="date-header">📅 ${date}</div>
`;

      // Breakfast
      if (dayLog.meals?.breakfast && dayLog.meals.breakfast.length > 0) {
        const time = dayLog.mealTimes?.breakfast || '';
        const feeling = dayLog.mealFeelings?.breakfast || '';
        htmlContent += `
      <div class="meal-section">
        <div class="meal-title">🌅 Breakfast${time ? `<span class="meal-time">${time}</span>` : ''}${feeling ? ` - ${feeling}` : ''}</div>
        <table>
          <thead><tr><th>Food Item</th><th>Portion</th><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fat</th></tr></thead>
          <tbody>`;
        dayLog.meals.breakfast.forEach((food: any) => {
          const foodName = typeof food === 'string' ? food : food.name;
          const portion = (typeof food !== 'string' && food.portion) ? `${food.portion.amount} ${food.portion.unit}` : '—';
          const calories = (typeof food !== 'string' && food.calories) ? Math.round(food.calories) : '—';
          const protein = (typeof food !== 'string' && food.protein) ? Math.round(food.protein) + 'g' : '—';
          const carbs = (typeof food !== 'string' && food.carbs) ? Math.round(food.carbs) + 'g' : '—';
          const fat = (typeof food !== 'string' && food.fat) ? Math.round(food.fat) + 'g' : '—';
          htmlContent += `<tr><td>${foodName}</td><td>${portion}</td><td>${calories}</td><td>${protein}</td><td>${carbs}</td><td>${fat}</td></tr>`;
        });
        htmlContent += `</tbody></table></div>`;
      }

      // Lunch
      if (dayLog.meals?.lunch && dayLog.meals.lunch.length > 0) {
        const time = dayLog.mealTimes?.lunch || '';
        const feeling = dayLog.mealFeelings?.lunch || '';
        htmlContent += `
      <div class="meal-section">
        <div class="meal-title">☀️ Lunch${time ? `<span class="meal-time">${time}</span>` : ''}${feeling ? ` - ${feeling}` : ''}</div>
        <table>
          <thead><tr><th>Food Item</th><th>Portion</th><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fat</th></tr></thead>
          <tbody>`;
        dayLog.meals.lunch.forEach((food: any) => {
          const foodName = typeof food === 'string' ? food : food.name;
          const portion = (typeof food !== 'string' && food.portion) ? `${food.portion.amount} ${food.portion.unit}` : '—';
          const calories = (typeof food !== 'string' && food.calories) ? Math.round(food.calories) : '—';
          const protein = (typeof food !== 'string' && food.protein) ? Math.round(food.protein) + 'g' : '—';
          const carbs = (typeof food !== 'string' && food.carbs) ? Math.round(food.carbs) + 'g' : '—';
          const fat = (typeof food !== 'string' && food.fat) ? Math.round(food.fat) + 'g' : '—';
          htmlContent += `<tr><td>${foodName}</td><td>${portion}</td><td>${calories}</td><td>${protein}</td><td>${carbs}</td><td>${fat}</td></tr>`;
        });
        htmlContent += `</tbody></table></div>`;
      }

      // Dinner
      if (dayLog.meals?.dinner && dayLog.meals.dinner.length > 0) {
        const time = dayLog.mealTimes?.dinner || '';
        const feeling = dayLog.mealFeelings?.dinner || '';
        htmlContent += `
      <div class="meal-section">
        <div class="meal-title">🌙 Dinner${time ? `<span class="meal-time">${time}</span>` : ''}${feeling ? ` - ${feeling}` : ''}</div>
        <table>
          <thead><tr><th>Food Item</th><th>Portion</th><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fat</th></tr></thead>
          <tbody>`;
        dayLog.meals.dinner.forEach((food: any) => {
          const foodName = typeof food === 'string' ? food : food.name;
          const portion = (typeof food !== 'string' && food.portion) ? `${food.portion.amount} ${food.portion.unit}` : '—';
          const calories = (typeof food !== 'string' && food.calories) ? Math.round(food.calories) : '—';
          const protein = (typeof food !== 'string' && food.protein) ? Math.round(food.protein) + 'g' : '—';
          const carbs = (typeof food !== 'string' && food.carbs) ? Math.round(food.carbs) + 'g' : '—';
          const fat = (typeof food !== 'string' && food.fat) ? Math.round(food.fat) + 'g' : '—';
          htmlContent += `<tr><td>${foodName}</td><td>${portion}</td><td>${calories}</td><td>${protein}</td><td>${carbs}</td><td>${fat}</td></tr>`;
        });
        htmlContent += `</tbody></table></div>`;
      }

      // Snacks - sorted by time
      if (dayLog.snacks && dayLog.snacks.length > 0) {
        // Sort snacks by timestamp
        const snacksWithTimes = dayLog.snacks.map((snack: any, index: number) => ({
          snack,
          time: dayLog.snackTimes?.[index] || ''
        }));
        snacksWithTimes.sort((a, b) => {
          if (!a.time) return 1;
          if (!b.time) return -1;
          return a.time.localeCompare(b.time);
        });
        
        htmlContent += `
      <div class="meal-section">
        <div class="meal-title">🍎 Snacks</div>
        <table>
          <thead><tr><th>Food Item</th><th>Portion</th><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fat</th></tr></thead>
          <tbody>`;
        snacksWithTimes.forEach((item: any) => {
          const food = item.snack;
          const foodName = typeof food === 'string' ? food : food.name;
          const portion = (typeof food !== 'string' && food.portion) ? `${food.portion.amount} ${food.portion.unit}` : '—';
          const calories = (typeof food !== 'string' && food.calories) ? Math.round(food.calories) : '—';
          const protein = (typeof food !== 'string' && food.protein) ? Math.round(food.protein) + 'g' : '—';
          const carbs = (typeof food !== 'string' && food.carbs) ? Math.round(food.carbs) + 'g' : '—';
          const fat = (typeof food !== 'string' && food.fat) ? Math.round(food.fat) + 'g' : '—';
          htmlContent += `<tr><td>${foodName}</td><td>${portion}</td><td>${calories}</td><td>${protein}</td><td>${carbs}</td><td>${fat}</td></tr>`;
        });
        htmlContent += `</tbody></table></div>`;
      }

      // Daily Totals
      htmlContent += `
      <div class="nutrition-totals">
        <div class="nutrition-row">
          <div class="nutrition-item">
            <div class="nutrition-value">${Math.round(calorieData.total)}</div>
            <div class="nutrition-label">Total Calories</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-value">${Math.round(macroData.total.protein)}g</div>
            <div class="nutrition-label">Protein</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-value">${Math.round(macroData.total.carbs)}g</div>
            <div class="nutrition-label">Carbs</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-value">${Math.round(macroData.total.fat)}g</div>
            <div class="nutrition-label">Fat</div>
          </div>
        </div>
      </div>
    </div>`;
    });

    htmlContent += `
    <div class="footer">
      <p>Generated by Pound Drop - Your Weight Loss Journey Partner 💜</p>
      <p style="margin-top: 8px; font-size: 12px;">Keep crushing your goals! 🎯</p>
    </div>
  </div>
</body>
</html>`;

    try {
      await Share.share({
        message: htmlContent,
        title: 'Pound Drop Food Log Report'
      });
    } catch (error) {
      Alert.alert('Export Failed', 'Could not export food log');
    }
  };

  const exportToCSV = async () => {
    if (logs.length === 0) {
      Alert.alert('No Data', 'No food logs to export');
      return;
    }

    // Generate CSV content
    let csvContent = 'Date,Meal Type,Food Item,Portion,Calories,Protein (g),Carbs (g),Fat (g),Time,Feeling\n';

    sortedLogs.forEach((dayLog) => {
      const date = new Date(dayLog.date).toLocaleDateString();
      
      // Breakfast
      if (dayLog.meals?.breakfast) {
        dayLog.meals.breakfast.forEach((food: any) => {
          const foodName = typeof food === 'string' ? food : food.name;
          const portion = (typeof food !== 'string' && food.portion) ? `${food.portion.amount}${food.portion.unit}` : '';
          const calories = (typeof food !== 'string' && food.calories) ? Math.round(food.calories) : '';
          const protein = (typeof food !== 'string' && food.protein) ? Math.round(food.protein) : '';
          const carbs = (typeof food !== 'string' && food.carbs) ? Math.round(food.carbs) : '';
          const fat = (typeof food !== 'string' && food.fat) ? Math.round(food.fat) : '';
          const time = dayLog.mealTimes?.breakfast || '';
          const feeling = dayLog.mealFeelings?.breakfast || '';
          csvContent += `${date},Breakfast,"${foodName}",${portion},${calories},${protein},${carbs},${fat},${time},${feeling}\n`;
        });
      }

      // Lunch
      if (dayLog.meals?.lunch) {
        dayLog.meals.lunch.forEach((food: any) => {
          const foodName = typeof food === 'string' ? food : food.name;
          const portion = (typeof food !== 'string' && food.portion) ? `${food.portion.amount}${food.portion.unit}` : '';
          const calories = (typeof food !== 'string' && food.calories) ? Math.round(food.calories) : '';
          const protein = (typeof food !== 'string' && food.protein) ? Math.round(food.protein) : '';
          const carbs = (typeof food !== 'string' && food.carbs) ? Math.round(food.carbs) : '';
          const fat = (typeof food !== 'string' && food.fat) ? Math.round(food.fat) : '';
          const time = dayLog.mealTimes?.lunch || '';
          const feeling = dayLog.mealFeelings?.lunch || '';
          csvContent += `${date},Lunch,"${foodName}",${portion},${calories},${protein},${carbs},${fat},${time},${feeling}\n`;
        });
      }

      // Dinner
      if (dayLog.meals?.dinner) {
        dayLog.meals.dinner.forEach((food: any) => {
          const foodName = typeof food === 'string' ? food : food.name;
          const portion = (typeof food !== 'string' && food.portion) ? `${food.portion.amount}${food.portion.unit}` : '';
          const calories = (typeof food !== 'string' && food.calories) ? Math.round(food.calories) : '';
          const protein = (typeof food !== 'string' && food.protein) ? Math.round(food.protein) : '';
          const carbs = (typeof food !== 'string' && food.carbs) ? Math.round(food.carbs) : '';
          const fat = (typeof food !== 'string' && food.fat) ? Math.round(food.fat) : '';
          const time = dayLog.mealTimes?.dinner || '';
          const feeling = dayLog.mealFeelings?.dinner || '';
          csvContent += `${date},Dinner,"${foodName}",${portion},${calories},${protein},${carbs},${fat},${time},${feeling}\n`;
        });
      }

      // Snacks - sorted by time
      if (dayLog.snacks) {
        // Sort snacks by timestamp
        const snacksWithTimes = dayLog.snacks.map((snack: any, index: number) => ({
          snack,
          time: dayLog.snackTimes?.[index] || ''
        }));
        snacksWithTimes.sort((a, b) => {
          if (!a.time) return 1;
          if (!b.time) return -1;
          return a.time.localeCompare(b.time);
        });
        
        snacksWithTimes.forEach((item: any) => {
          const food = item.snack;
          const foodName = typeof food === 'string' ? food : food.name;
          const portion = (typeof food !== 'string' && food.portion) ? `${food.portion.amount}${food.portion.unit}` : '';
          const calories = (typeof food !== 'string' && food.calories) ? Math.round(food.calories) : '';
          const protein = (typeof food !== 'string' && food.protein) ? Math.round(food.protein) : '';
          const carbs = (typeof food !== 'string' && food.carbs) ? Math.round(food.carbs) : '';
          const fat = (typeof food !== 'string' && food.fat) ? Math.round(food.fat) : '';
          const time = item.time;
          csvContent += `${date},Snack,"${foodName}",${portion},${calories},${protein},${carbs},${fat},${time},\n`;
        });
      }
    });

    try {
      await Share.share({
        message: csvContent,
        title: 'Food Log Export'
      });
    } catch (error) {
      Alert.alert('Export Failed', 'Could not export food log');
    }
  };

  // Sort logs by date descending (newest first)
  const sortedLogs = [...logs].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    if (isToday) {
      return `Today - ${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
    } else if (isYesterday) {
      return `Yesterday - ${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
    } else {
      return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
  };

  const getMoodEmoji = (mood?: number) => {
    const moods = ['😢', '😕', '😐', '🙂', '😄'];
    return mood !== undefined ? moods[mood] : '—';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} data-testid="button-back">
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Food Log History</Text>
          <Text style={styles.headerSubtitle}>{logs.length} {logs.length === 1 ? 'day' : 'days'} logged</Text>
        </View>
        <View style={styles.exportButtons}>
          <TouchableOpacity onPress={exportToHTML} style={styles.exportButton} data-testid="button-export-html">
            <Ionicons name="document-text" size={24} color="#EC4899" />
          </TouchableOpacity>
          <TouchableOpacity onPress={exportToCSV} style={styles.exportButton} data-testid="button-export-csv">
            <Ionicons name="download" size={24} color="#9333EA" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container}>
        {sortedLogs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No logs yet</Text>
            <Text style={styles.emptySubtitle}>Start tracking in the Wellness tab</Text>
          </View>
        ) : (
          sortedLogs.map((dayLog) => {
            const breakfastFoods = dayLog.meals?.breakfast || [];
            const lunchFoods = dayLog.meals?.lunch || [];
            const dinnerFoods = dayLog.meals?.dinner || [];
            const rawSnackFoods = dayLog.snacks || [];
            const workouts = dayLog.workouts || [];
            const waterGlasses = dayLog.water || 0;
            const steps = dayLog.steps || '0';
            
            // Sort snacks by timestamp chronologically
            const snacksWithTimes = rawSnackFoods.map((snack, index) => ({
              snack,
              time: dayLog.snackTimes?.[index] || '',
              originalIndex: index
            }));
            
            snacksWithTimes.sort((a, b) => {
              if (!a.time) return 1;
              if (!b.time) return -1;
              return a.time.localeCompare(b.time);
            });
            
            const snackFoods = snacksWithTimes.map(item => item.snack);
            const sortedSnackTimes = snacksWithTimes.map(item => item.time);
            
            const calorieData = dayLog.meals ? calculateCalories(dayLog.meals, dayLog.snacks) : { total: 0, breakfast: 0, lunch: 0, dinner: 0 };
            const macroData = dayLog.meals ? calculateMacros(dayLog.meals, dayLog.snacks) : { total: { protein: 0, carbs: 0, fat: 0 }, breakfast: { protein: 0, carbs: 0, fat: 0 }, lunch: { protein: 0, carbs: 0, fat: 0 }, dinner: { protein: 0, carbs: 0, fat: 0 } };

            return (
              <View key={dayLog.date} style={styles.daySection}>
                {/* Date Header */}
                <View style={styles.dateHeader}>
                  <Ionicons name="calendar" size={20} color="#9333EA" />
                  <Text style={styles.dateHeaderText}>{formatDateHeader(dayLog.date)}</Text>
                </View>

                {/* Meals & Snacks Chronologically */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="restaurant" size={20} color="#9333EA" />
                    <Text style={styles.sectionTitle}>Meals & Snacks (Chronological)</Text>
                  </View>

                  {/* Breakfast */}
                  {breakfastFoods.length > 0 && (
                    <View style={styles.mealCard}>
                      <View style={styles.mealHeader}>
                        <Ionicons name="sunny" size={18} color="#FACC15" />
                        <Text style={styles.mealTitle}>Breakfast</Text>
                        {dayLog.mealTimes?.breakfast && (
                          <Text style={styles.mealTime}>{dayLog.mealTimes.breakfast}</Text>
                        )}
                      </View>
                      <>
                        {breakfastFoods.map((food, index) => (
                          <View key={index} style={styles.foodItem}>
                            <View style={styles.foodBullet} />
                            <Text style={styles.foodText}>
                              {typeof food === 'string' 
                                ? food 
                                : food.portion 
                                  ? `${food.portion.amount} ${food.portion.unit} of ${food.name}`
                                  : food.name
                              }
                            </Text>
                          </View>
                        ))}
                        {calorieData.breakfast > 0 && (
                          <>
                            <View style={styles.calorieRow}>
                              <Ionicons name="flame" size={16} color="#F97316" />
                              <Text style={styles.calorieText}>{Math.round(calorieData.breakfast)} calories</Text>
                            </View>
                            <View style={styles.macroRow}>
                              <Text style={styles.macroText}>
                                P: {Math.round(macroData.breakfast.protein)}g | C: {Math.round(macroData.breakfast.carbs)}g | F: {Math.round(macroData.breakfast.fat)}g
                              </Text>
                            </View>
                          </>
                        )}
                        {dayLog.mealFeelings?.breakfast && (
                          <View style={styles.feelingRow}>
                            <Ionicons name="heart" size={16} color="#EF4444" />
                            <Text style={styles.feelingText}>Feeling: {dayLog.mealFeelings.breakfast}/10</Text>
                          </View>
                        )}
                      </>
                    </View>
                  )}

                  {/* Snacks with individual timestamps */}
                  {snackFoods.map((snack, index) => (
                    <View key={`snack-${index}`} style={styles.snackCard}>
                      <View style={styles.mealHeader}>
                        <Ionicons name="warning" size={18} color="#F59E0B" />
                        <Text style={[styles.mealTitle, { color: '#F59E0B' }]}>Snack</Text>
                        {sortedSnackTimes[index] && (
                          <Text style={styles.mealTime}>{sortedSnackTimes[index]}</Text>
                        )}
                      </View>
                      <View style={styles.foodItem}>
                        <View style={styles.foodBullet} />
                        <Text style={styles.foodText}>
                          {typeof snack === 'string' 
                            ? snack 
                            : snack.portion 
                              ? `${snack.portion.amount} ${snack.portion.unit} of ${snack.name}`
                              : snack.name
                          }
                        </Text>
                      </View>
                      {typeof snack !== 'string' && snack.calories && (
                        <>
                          <View style={styles.calorieRow}>
                            <Ionicons name="flame" size={16} color="#F97316" />
                            <Text style={styles.calorieText}>{Math.round(snack.calories)} calories</Text>
                          </View>
                          <View style={styles.macroRow}>
                            <Text style={styles.macroText}>
                              P: {Math.round(snack.protein || 0)}g | C: {Math.round(snack.carbs || 0)}g | F: {Math.round(snack.fat || 0)}g
                            </Text>
                          </View>
                        </>
                      )}
                    </View>
                  ))}

                  {/* Lunch */}
                  {lunchFoods.length > 0 && (
                    <View style={styles.mealCard}>
                      <View style={styles.mealHeader}>
                        <Ionicons name="partly-sunny" size={18} color="#06B6D4" />
                        <Text style={styles.mealTitle}>Lunch</Text>
                        {dayLog.mealTimes?.lunch && (
                          <Text style={styles.mealTime}>{dayLog.mealTimes.lunch}</Text>
                        )}
                      </View>
                      <>
                        {lunchFoods.map((food, index) => (
                          <View key={index} style={styles.foodItem}>
                            <View style={styles.foodBullet} />
                            <Text style={styles.foodText}>
                              {typeof food === 'string' 
                                ? food 
                                : food.portion 
                                  ? `${food.portion.amount} ${food.portion.unit} of ${food.name}`
                                  : food.name
                              }
                            </Text>
                          </View>
                        ))}
                        {calorieData.lunch > 0 && (
                          <>
                            <View style={styles.calorieRow}>
                              <Ionicons name="flame" size={16} color="#F97316" />
                              <Text style={styles.calorieText}>{Math.round(calorieData.lunch)} calories</Text>
                            </View>
                            <View style={styles.macroRow}>
                              <Text style={styles.macroText}>
                                P: {Math.round(macroData.lunch.protein)}g | C: {Math.round(macroData.lunch.carbs)}g | F: {Math.round(macroData.lunch.fat)}g
                              </Text>
                            </View>
                          </>
                        )}
                        {dayLog.mealFeelings?.lunch && (
                          <View style={styles.feelingRow}>
                            <Ionicons name="heart" size={16} color="#EF4444" />
                            <Text style={styles.feelingText}>Feeling: {dayLog.mealFeelings.lunch}/10</Text>
                          </View>
                        )}
                      </>
                    </View>
                  )}

                  {/* Dinner */}
                  {dinnerFoods.length > 0 && (
                    <View style={styles.mealCard}>
                      <View style={styles.mealHeader}>
                        <Ionicons name="moon" size={18} color="#9333EA" />
                        <Text style={styles.mealTitle}>Dinner</Text>
                        {dayLog.mealTimes?.dinner && (
                          <Text style={styles.mealTime}>{dayLog.mealTimes.dinner}</Text>
                        )}
                      </View>
                      <>
                        {dinnerFoods.map((food, index) => (
                          <View key={index} style={styles.foodItem}>
                            <View style={styles.foodBullet} />
                            <Text style={styles.foodText}>
                              {typeof food === 'string' 
                                ? food 
                                : food.portion 
                                  ? `${food.portion.amount} ${food.portion.unit} of ${food.name}`
                                  : food.name
                              }
                            </Text>
                          </View>
                        ))}
                        {calorieData.dinner > 0 && (
                          <>
                            <View style={styles.calorieRow}>
                              <Ionicons name="flame" size={16} color="#F97316" />
                              <Text style={styles.calorieText}>{Math.round(calorieData.dinner)} calories</Text>
                            </View>
                            <View style={styles.macroRow}>
                              <Text style={styles.macroText}>
                                P: {Math.round(macroData.dinner.protein)}g | C: {Math.round(macroData.dinner.carbs)}g | F: {Math.round(macroData.dinner.fat)}g
                              </Text>
                            </View>
                          </>
                        )}
                        {dayLog.mealFeelings?.dinner && (
                          <View style={styles.feelingRow}>
                            <Ionicons name="heart" size={16} color="#EF4444" />
                            <Text style={styles.feelingText}>Feeling: {dayLog.mealFeelings.dinner}/10</Text>
                          </View>
                        )}
                      </>
                    </View>
                  )}

                  {!breakfastFoods.length && !lunchFoods.length && !dinnerFoods.length && !snackFoods.length && (
                    <Text style={styles.emptyText}>No meals or snacks logged</Text>
                  )}
                </View>

                {/* Daily Nutrition Summary */}
                {(breakfastFoods.length > 0 || lunchFoods.length > 0 || dinnerFoods.length > 0 || snackFoods.length > 0) && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Ionicons name="nutrition" size={20} color="#EC4899" />
                      <Text style={styles.sectionTitle}>Daily Totals</Text>
                    </View>
                    <View style={styles.nutritionSummaryCard}>
                      <View style={styles.totalCaloriesRow}>
                        <Ionicons name="flame" size={24} color="#F97316" />
                        <Text style={styles.totalCaloriesText}>{Math.round(calorieData.total)} calories</Text>
                      </View>
                      <View style={styles.macrosSummaryRow}>
                        <View style={styles.macroSummaryItem}>
                          <Text style={styles.macroSummaryValue}>{Math.round(macroData.total.protein)}g</Text>
                          <Text style={styles.macroSummaryLabel}>Protein</Text>
                        </View>
                        <View style={styles.macroSummaryItem}>
                          <Text style={styles.macroSummaryValue}>{Math.round(macroData.total.carbs)}g</Text>
                          <Text style={styles.macroSummaryLabel}>Carbs</Text>
                        </View>
                        <View style={styles.macroSummaryItem}>
                          <Text style={styles.macroSummaryValue}>{Math.round(macroData.total.fat)}g</Text>
                          <Text style={styles.macroSummaryLabel}>Fat</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}

                {/* Activity Summary */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="fitness" size={20} color="#16A34A" />
                    <Text style={styles.sectionTitle}>Activity</Text>
                  </View>

                  <View style={styles.summaryGrid}>
                    <View style={styles.summaryCard}>
                      <Ionicons name="water" size={28} color="#3B82F6" />
                      <Text style={styles.summaryValue}>{waterGlasses}</Text>
                      <Text style={styles.summaryLabel}>Glasses</Text>
                    </View>

                    <View style={styles.summaryCard}>
                      <Ionicons name="walk" size={28} color="#16A34A" />
                      <Text style={styles.summaryValue}>{parseInt(steps).toLocaleString()}</Text>
                      <Text style={styles.summaryLabel}>Steps</Text>
                    </View>

                    <View style={styles.summaryCard}>
                      <Text style={styles.moodEmoji}>{getMoodEmoji(dayLog.mood)}</Text>
                      <Text style={styles.summaryLabel}>Mood</Text>
                    </View>
                  </View>
                </View>

                {/* Mood & Wellness Details */}
                {dayLog.moodDetails && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Ionicons name="heart" size={20} color="#EF4444" />
                      <Text style={styles.sectionTitle}>Mood & Wellness</Text>
                    </View>
                    <View style={styles.moodDetailsCard}>
                      <View style={styles.moodDetailsGrid}>
                        <View style={styles.moodDetailItem}>
                          <Text style={styles.moodDetailLabel}>😊 Feeling</Text>
                          <Text style={styles.moodDetailValue}>{getMoodEmoji(dayLog.moodDetails.feeling)}</Text>
                        </View>
                        {dayLog.moodDetails.stressLevel !== undefined && (
                          <View style={styles.moodDetailItem}>
                            <Text style={styles.moodDetailLabel}>😰 Stress</Text>
                            <Text style={styles.moodDetailValue}>{dayLog.moodDetails.stressLevel}/10</Text>
                          </View>
                        )}
                        {dayLog.moodDetails.energyLevel !== undefined && (
                          <View style={styles.moodDetailItem}>
                            <Text style={styles.moodDetailLabel}>⚡ Energy</Text>
                            <Text style={styles.moodDetailValue}>{dayLog.moodDetails.energyLevel}/10</Text>
                          </View>
                        )}
                        {dayLog.moodDetails.sleepQuality !== undefined && (
                          <View style={styles.moodDetailItem}>
                            <Text style={styles.moodDetailLabel}>🛌 Sleep</Text>
                            <Text style={styles.moodDetailValue}>{dayLog.moodDetails.sleepQuality}/10</Text>
                          </View>
                        )}
                      </View>
                      {dayLog.moodDetails.symptoms && dayLog.moodDetails.symptoms.length > 0 && (
                        <View style={styles.symptomsSection}>
                          <Text style={styles.symptomsLabel}>Physical Symptoms:</Text>
                          <View style={styles.symptomsChips}>
                            {dayLog.moodDetails.symptoms.map((symptom, index) => (
                              <View key={index} style={styles.symptomChip}>
                                <Text style={styles.symptomChipText}>{symptom}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                      {dayLog.moodDetails.notes && (
                        <View style={styles.notesSection}>
                          <Text style={styles.notesLabel}>Notes:</Text>
                          <Text style={styles.notesText}>{dayLog.moodDetails.notes}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Cravings & Emotional Eating */}
                {dayLog.cravings && (dayLog.cravings.sugarCraving !== undefined || dayLog.cravings.emotionalEating !== undefined) && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Ionicons name="candy" size={20} color="#DB2777" />
                      <Text style={styles.sectionTitle}>Cravings & Emotional Eating</Text>
                    </View>
                    <View style={styles.cravingsCard}>
                      <View style={styles.moodDetailsGrid}>
                        {dayLog.cravings.sugarCraving !== undefined && (
                          <View style={styles.moodDetailItem}>
                            <Text style={styles.moodDetailLabel}>🍬 Sugar Craving</Text>
                            <Text style={styles.moodDetailValue}>{dayLog.cravings.sugarCraving}/10</Text>
                          </View>
                        )}
                        {dayLog.cravings.emotionalEating !== undefined && (
                          <View style={styles.moodDetailItem}>
                            <Text style={styles.moodDetailLabel}>🧠 Emotional Eating</Text>
                            <Text style={styles.moodDetailValue}>{dayLog.cravings.emotionalEating}/10</Text>
                          </View>
                        )}
                      </View>
                      {dayLog.cravings.cravingTriggers && dayLog.cravings.cravingTriggers.length > 0 && (
                        <View style={styles.symptomsSection}>
                          <Text style={styles.symptomsLabel}>Craving Triggers:</Text>
                          <View style={styles.symptomsChips}>
                            {dayLog.cravings.cravingTriggers.map((trigger, index) => (
                              <View key={index} style={[styles.symptomChip, styles.triggerChip]}>
                                <Text style={styles.symptomChipText}>{trigger}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Daily Reflection */}
                {dayLog.dailyReflection && (dayLog.dailyReflection.todaysWin || dayLog.dailyReflection.mindsetGratitude || dayLog.dailyReflection.obstaclePlan || dayLog.dailyReflection.emotionalAwareness) && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Ionicons name="star" size={20} color="#9333EA" />
                      <Text style={styles.sectionTitle}>Daily Reflection</Text>
                    </View>
                    <View style={styles.reflectionCard}>
                      {dayLog.dailyReflection.todaysWin && (
                        <View style={styles.reflectionItem}>
                          <Text style={styles.reflectionLabel}>🏆 Today's Win</Text>
                          <Text style={styles.reflectionText}>{dayLog.dailyReflection.todaysWin}</Text>
                        </View>
                      )}
                      {dayLog.dailyReflection.mindsetGratitude && (
                        <View style={styles.reflectionItem}>
                          <Text style={styles.reflectionLabel}>💭 Mindset/Gratitude</Text>
                          <Text style={styles.reflectionText}>{dayLog.dailyReflection.mindsetGratitude}</Text>
                        </View>
                      )}
                      {dayLog.dailyReflection.obstaclePlan && (
                        <View style={styles.reflectionItem}>
                          <Text style={styles.reflectionLabel}>🚧 Obstacle + Plan</Text>
                          <Text style={styles.reflectionText}>{dayLog.dailyReflection.obstaclePlan}</Text>
                        </View>
                      )}
                      {dayLog.dailyReflection.emotionalAwareness && (
                        <View style={styles.reflectionItem}>
                          <Text style={styles.reflectionLabel}>🧠 Emotional Eating Awareness</Text>
                          <Text style={styles.reflectionText}>{dayLog.dailyReflection.emotionalAwareness}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Fasting */}
                {dayLog.fasting && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Ionicons name="time" size={20} color="#FACC15" />
                      <Text style={styles.sectionTitle}>Fasting</Text>
                    </View>
                    <View style={styles.fastingCard}>
                      <View style={styles.fastingRow}>
                        <Text style={styles.fastingLabel}>Duration:</Text>
                        <Text style={styles.fastingValue}>{dayLog.fasting.duration} hours</Text>
                      </View>
                      <View style={styles.fastingRow}>
                        <Text style={styles.fastingLabel}>Window:</Text>
                        <Text style={styles.fastingValue}>
                          {dayLog.fasting.startTime} - {dayLog.fasting.endTime}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Workouts */}
                {workouts.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Ionicons name="barbell" size={20} color="#EF4444" />
                      <Text style={styles.sectionTitle}>Workouts</Text>
                    </View>
                    {workouts.map((workout, index) => (
                      <View key={index} style={styles.workoutCard}>
                        <View style={styles.workoutRow}>
                          <Ionicons name="fitness" size={18} color="#EF4444" />
                          <Text style={styles.workoutType}>{workout.type}</Text>
                        </View>
                        <View style={styles.workoutDetails}>
                          <View style={styles.workoutDetail}>
                            <Ionicons name="time-outline" size={14} color="#6B7280" />
                            <Text style={styles.workoutDetailText}>{workout.duration}</Text>
                          </View>
                          {workout.calories && (
                            <View style={styles.workoutDetail}>
                              <Ionicons name="flame-outline" size={14} color="#6B7280" />
                              <Text style={styles.workoutDetailText}>{workout.calories} cal</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.daySeparator} />
              </View>
            );
          })
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: { marginRight: 12 },
  headerTextContainer: { flex: 1 },
  exportButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exportButton: { 
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3E8FF'
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  headerSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  daySection: {
    marginBottom: 8,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9333EA',
    padding: 16,
    marginTop: 16,
  },
  dateHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  section: { marginHorizontal: 16, marginTop: 16 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  mealCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  snackCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  mealTime: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  foodBullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#9333EA',
    marginRight: 10,
  },
  foodText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 6,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  moodEmoji: {
    fontSize: 28,
    marginVertical: 4,
  },
  fastingCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
  },
  fastingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  fastingLabel: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '600',
  },
  fastingValue: {
    fontSize: 14,
    color: '#78350F',
    fontWeight: 'bold',
  },
  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  workoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  workoutType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  workoutDetails: {
    flexDirection: 'row',
    gap: 14,
  },
  workoutDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  workoutDetailText: {
    fontSize: 13,
    color: '#6B7280',
  },
  daySeparator: {
    height: 2,
    backgroundColor: '#E5E7EB',
    marginTop: 16,
  },
  feelingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 6,
  },
  feelingText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  calorieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 6,
  },
  calorieText: {
    fontSize: 14,
    color: '#F97316',
    fontWeight: '600',
  },
  macroRow: {
    marginTop: 6,
  },
  macroText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  moodDetailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cravingsCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#DB2777',
  },
  triggerChip: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  moodDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moodDetailItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  moodDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 6,
  },
  moodDetailValue: {
    fontSize: 18,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  symptomsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  symptomsLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 10,
  },
  symptomsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomChip: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  symptomChipText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  notesSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  notesLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  reflectionCard: {
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#9333EA',
  },
  reflectionItem: {
    marginBottom: 16,
  },
  reflectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9333EA',
    marginBottom: 6,
  },
  reflectionText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  nutritionSummaryCard: {
    backgroundColor: '#FDF2F8',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#EC4899',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalCaloriesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  totalCaloriesText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F97316',
  },
  macrosSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#FBCFE8',
  },
  macroSummaryItem: {
    alignItems: 'center',
  },
  macroSummaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  macroSummaryLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  bottomPadding: { height: 40 },
});
