import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { nutritionEducation, educationCategories, EducationTopic } from '../data/nutritionEducation';
import theme from '../utils/theme';

export default function NutritionEducationScreen() {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredTopics = selectedCategory === 'All' 
    ? nutritionEducation 
    : nutritionEducation.filter(topic => topic.category === selectedCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} data-testid="button-back">
          <Ionicons name="arrow-back" size={24} color="#9333EA" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Nutrition Education</Text>
          <Text style={styles.subtitle}>Learn what foods work best for you</Text>
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {educationCategories.map((category) => (
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

      {/* Education Cards */}
      <ScrollView style={styles.topicList} showsVerticalScrollIndicator={false}>
        {filteredTopics.map((topic) => {
          const isExpanded = expandedId === topic.id;
          
          return (
            <TouchableOpacity
              key={topic.id}
              data-testid={`card-topic-${topic.id}`}
              style={styles.topicCard}
              onPress={() => toggleExpand(topic.id)}
              activeOpacity={0.7}
            >
              {/* Header */}
              <View style={styles.topicHeader}>
                <View style={styles.topicTitleContainer}>
                  <Text style={styles.topicIcon}>{topic.icon}</Text>
                  <View style={styles.topicTitleTextContainer}>
                    <Text style={styles.topicTitle}>{topic.title}</Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{topic.category}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
              </View>

              {/* Content Preview */}
              <Text style={styles.topicContent}>{topic.content}</Text>

              {/* Expanded Content */}
              {isExpanded && (
                <View style={styles.expandedContent}>
                  {/* Key Points */}
                  <View style={styles.keyPointsSection}>
                    <Text style={styles.sectionTitle}>Key Points:</Text>
                    {topic.keyPoints.map((point, index) => (
                      <View key={index} style={styles.keyPointRow}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.keyPointText}>{point}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Examples */}
                  {topic.examples && topic.examples.length > 0 && (
                    <View style={styles.examplesSection}>
                      <Text style={styles.sectionTitle}>Examples:</Text>
                      {topic.examples.map((example, index) => (
                        <View key={index} style={styles.exampleRow}>
                          <Text style={styles.exampleIcon}>→</Text>
                          <Text style={styles.exampleText}>{example}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {/* Tap to expand hint */}
              {!isExpanded && (
                <Text style={styles.tapHint}>Tap to learn more...</Text>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Bottom Tip */}
        <View style={styles.tipContainer}>
          <Text style={styles.tipEmoji}>📚</Text>
          <Text style={styles.tipText}>
            Take your time to learn these principles. Small changes in nutrition knowledge lead to big results!
          </Text>
        </View>

        {/* Medical Citations */}
        <View style={styles.citationsContainer}>
          <Text style={styles.citationsTitle}>📚 Medical & Scientific References</Text>
          <Text style={styles.citationText}>• Macronutrients: USDA Dietary Guidelines for Americans (2020)</Text>
          <Text style={styles.citationText}>• Protein Timing: Journal of the International Society of Sports Nutrition, "Protein timing and its effects" (2017)</Text>
          <Text style={styles.citationText}>• Intermittent Fasting: Cell Metabolism, "Intermittent Fasting: The Science of Going without" (2014)</Text>
          <Text style={styles.citationText}>• Fiber & Satiety: Nutrition Reviews, "Role of dietary fiber in promoting satiety" (2013)</Text>
          <Text style={styles.citationText}>• Meal Frequency: British Journal of Nutrition, "Increased meal frequency and body composition" (2011)</Text>
          <Text style={styles.citationText}>• Portion Control: Academy of Nutrition and Dietetics, "Position on Total Diet Approach" (2019)</Text>
          <Text style={styles.citationText}>• Food Quality: American Journal of Clinical Nutrition, "Whole foods vs processed foods" (2016)</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
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
  topicList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  topicCard: {
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
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  topicTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  topicIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  topicTitleTextContainer: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  categoryBadgeText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  expandIcon: {
    fontSize: 16,
    color: theme.colors.primary,
    marginLeft: 8,
  },
  topicContent: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 8,
  },
  tapHint: {
    fontSize: 13,
    color: theme.colors.primary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  keyPointsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  keyPointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 18,
    color: theme.colors.primary,
    marginRight: 8,
    marginTop: -2,
  },
  keyPointText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  examplesSection: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  exampleIcon: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginRight: 8,
    marginTop: 2,
  },
  exampleText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
  citationsContainer: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  citationsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5',
    marginBottom: 12,
  },
  citationText: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 4,
  },
});
