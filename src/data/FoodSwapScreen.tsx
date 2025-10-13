import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { foodSwaps, swapCategories, FoodSwap } from '../data/foodSwaps';
import theme from '../utils/theme';

export default function FoodSwapScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredSwaps = selectedCategory === 'All' 
    ? foodSwaps 
    : foodSwaps.filter(swap => swap.category === selectedCategory);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Smart Food Swaps</Text>
        <Text style={styles.subtitle}>Easy swaps for your favorite foods</Text>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {swapCategories.map((category) => (
          <TouchableOpacity
            key={category}
            data-testid={`button-category-${category.toLowerCase()}`}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Swap Cards */}
      <ScrollView style={styles.swapList} showsVerticalScrollIndicator={false}>
        {filteredSwaps.map((swap) => (
          <View key={swap.id} style={styles.swapCard} data-testid={`card-swap-${swap.id}`}>
            {/* Icon and Category */}
            <View style={styles.swapHeader}>
              <Text style={styles.swapIcon}>{swap.icon}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{swap.category}</Text>
              </View>
            </View>

            {/* Craving Title */}
            <Text style={styles.cravingText}>Craving: {swap.craving}</Text>

            {/* Comparison */}
            <View style={styles.comparisonContainer}>
              {/* Unhealthy Option */}
              <View style={styles.optionContainer}>
                <View style={styles.unhealthyBadge}>
                  <Text style={styles.badgeText}>❌ Skip</Text>
                </View>
                <Text style={styles.optionText}>{swap.unhealthyOption}</Text>
              </View>

              {/* Arrow */}
              <Text style={styles.arrow}>→</Text>

              {/* Healthy Swap */}
              <View style={styles.optionContainer}>
                <View style={styles.healthyBadge}>
                  <Text style={styles.badgeText}>✅ Swap</Text>
                </View>
                <Text style={styles.optionText}>{swap.healthySwap}</Text>
              </View>
            </View>

            {/* Benefit */}
            <View style={styles.benefitContainer}>
              <Text style={styles.benefitLabel}>Why it's better:</Text>
              <Text style={styles.benefitText}>{swap.benefit}</Text>
            </View>

            {/* Calories Saved */}
            <View style={styles.caloriesBadge}>
              <Text style={styles.caloriesText}>💪 Save ~{swap.caloriesSaved} calories</Text>
            </View>
          </View>
        ))}

        {/* Bottom Tip */}
        <View style={styles.tipContainer}>
          <Text style={styles.tipEmoji}>💡</Text>
          <Text style={styles.tipText}>
            Small swaps add up! Replacing just 2-3 items daily can save 500+ calories.
          </Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  categoryScroll: {
    maxHeight: 60,
    backgroundColor: 'white',
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: 'white',
  },
  swapList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  swapCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  swapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  swapIcon: {
    fontSize: 32,
  },
  categoryBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  cravingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  optionContainer: {
    flex: 1,
    alignItems: 'center',
  },
  unhealthyBadge: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  healthyBadge: {
    backgroundColor: '#E5F9E5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  optionText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  arrow: {
    fontSize: 24,
    color: theme.colors.primary,
    marginHorizontal: 8,
    fontWeight: 'bold',
  },
  benefitContainer: {
    backgroundColor: '#F8F4FF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  benefitLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  caloriesBadge: {
    backgroundColor: '#FFF4E5',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  caloriesText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  tipEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
});
