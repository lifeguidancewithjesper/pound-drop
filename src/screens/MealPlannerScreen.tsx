import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { mealTemplates, MealTemplate } from '../data/mealTemplates';
import { useStorage } from '../context/StorageContext';

type MealFilter = 'all' | 'breakfast' | 'lunch' | 'dinner';

export default function MealPlannerScreen() {
  const navigation = useNavigation();
  const [filter, setFilter] = useState<MealFilter>('all');
  const { getTodayLog, updateTodayLog } = useStorage();
  const todayLog = getTodayLog();

  const filteredMeals = filter === 'all' 
    ? mealTemplates 
    : mealTemplates.filter(meal => meal.mealType === filter);

  const addMealTemplate = (template: MealTemplate) => {
    Alert.alert(
      `Add ${template.name}?`,
      `This will add ${template.foods.length} items to your ${template.mealType}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add to Meals',
          onPress: () => {
            const currentMeals = todayLog?.meals || { breakfast: [], lunch: [], dinner: [] };
            const currentMealItems = currentMeals[template.mealType] || [];
            
            // Add template foods to the meal
            const updatedMeals = {
              ...currentMeals,
              [template.mealType]: [...currentMealItems, ...template.foods]
            };

            // Capture meal time if this is the first food for this meal
            const currentMealTimes = todayLog?.mealTimes || {};
            const updatedMealTimes = { ...currentMealTimes };
            
            if (currentMealItems.length === 0) {
              const now = new Date();
              updatedMealTimes[template.mealType] = now.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              });
            }

            updateTodayLog({ 
              meals: updatedMeals,
              mealTimes: updatedMealTimes
            });

            Alert.alert(
              '✅ Meal Added!',
              `${template.name} has been added to your ${template.mealType}`,
              [
                { text: 'Add Another', onPress: () => {} },
                { text: 'Done', onPress: () => navigation.goBack() }
              ]
            );
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          data-testid="button-back"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Meal Planner</Text>
          <Text style={styles.headerSubtitle}>Pre-built Pound Drop meals</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
          data-testid="filter-all"
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All Meals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'breakfast' && styles.filterTabActive]}
          onPress={() => setFilter('breakfast')}
          data-testid="filter-breakfast"
        >
          <Ionicons 
            name="sunny" 
            size={16} 
            color={filter === 'breakfast' ? '#fff' : '#6B7280'} 
          />
          <Text style={[styles.filterText, filter === 'breakfast' && styles.filterTextActive]}>
            Breakfast
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'lunch' && styles.filterTabActive]}
          onPress={() => setFilter('lunch')}
          data-testid="filter-lunch"
        >
          <Ionicons 
            name="partly-sunny" 
            size={16} 
            color={filter === 'lunch' ? '#fff' : '#6B7280'} 
          />
          <Text style={[styles.filterText, filter === 'lunch' && styles.filterTextActive]}>
            Lunch
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'dinner' && styles.filterTabActive]}
          onPress={() => setFilter('dinner')}
          data-testid="filter-dinner"
        >
          <Ionicons 
            name="moon" 
            size={16} 
            color={filter === 'dinner' ? '#fff' : '#6B7280'} 
          />
          <Text style={[styles.filterText, filter === 'dinner' && styles.filterTextActive]}>
            Dinner
          </Text>
        </TouchableOpacity>
      </View>

      {/* Meal Templates */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {filteredMeals.map((template) => (
          <View key={template.id} style={styles.mealCard} data-testid={`meal-card-${template.id}`}>
            <View style={styles.mealCardHeader}>
              <View style={styles.mealCardTitle}>
                <Text style={styles.mealName}>{template.name}</Text>
                <View style={styles.mealBadges}>
                  <View style={styles.badge}>
                    <Ionicons name="time-outline" size={12} color="#6B7280" />
                    <Text style={styles.badgeText}>{template.prepTime}</Text>
                  </View>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{template.category}</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <Text style={styles.description}>{template.description}</Text>
            
            {/* Nutrition Info */}
            <View style={styles.nutritionRow}>
              <View style={styles.nutritionItem}>
                <Ionicons name="flame" size={16} color="#F97316" />
                <Text style={styles.nutritionText}>{template.totalCalories} cal</Text>
              </View>
              {template.poundDropCompliant && (
                <View style={styles.nutritionItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
                  <Text style={styles.compliantText}>PD Method</Text>
                </View>
              )}
            </View>
            <View style={styles.macroRow}>
              <Text style={styles.macroText} data-testid={`text-macros-${template.id}`}>
                P: {template.totalProtein}g | C: {template.totalCarbs}g | F: {template.totalFat}g
              </Text>
            </View>

            {/* Foods List */}
            <View style={styles.foodsList}>
              <Text style={styles.foodsTitle}>Includes:</Text>
              {template.foods.slice(0, 4).map((food, index) => (
                <Text key={index} style={styles.foodItem}>• {food}</Text>
              ))}
              {template.foods.length > 4 && (
                <Text style={styles.foodItem}>+ {template.foods.length - 4} more items</Text>
              )}
            </View>

            {/* Add Button */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addMealTemplate(template)}
              data-testid={`button-add-${template.id}`}
            >
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add to {template.mealType}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    gap: 8,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    gap: 4,
  },
  filterTabActive: {
    backgroundColor: '#9333EA',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  mealCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mealCardHeader: {
    marginBottom: 8,
  },
  mealCardTitle: {
    flexDirection: 'column',
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  mealBadges: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoryBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    color: '#9333EA',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  nutritionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  nutritionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nutritionText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  compliantText: {
    fontSize: 13,
    color: '#16A34A',
    fontWeight: '600',
  },
  macroRow: {
    marginBottom: 12,
  },
  macroText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  foodsList: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  foodsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
  },
  foodItem: {
    fontSize: 12,
    color: '#374151',
    marginLeft: 4,
    marginVertical: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9333EA',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
