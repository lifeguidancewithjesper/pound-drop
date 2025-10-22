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

                  {/* References */}
                  {topic.references && topic.references.length > 0 && (
                    <View style={styles.referencesSection}>
                      <Text style={styles.sectionTitle}>References:</Text>
                      {topic.references.map((reference, index) => (
                        <View key={index} style={styles.referenceRow}>
                          <Text style={styles.referenceNumber}>[{index + 1}]</Text>
                          <Text style={styles.referenceText}>{reference}</Text>
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

        {/* Medical Citations - Prominent Section */}
        <View style={styles.citationsContainer}>
          <Text style={styles.citationsTitle}>📚 Medical & Scientific References</Text>
          <Text style={styles.citationIntro}>
            All nutrition education content is based on peer-reviewed scientific research and evidence-based guidelines from:
          </Text>

          <View style={styles.sourceBox}>
            <Text style={styles.sourceTitle}>U.S. Department of Agriculture (USDA)</Text>
            <Text style={styles.sourceDetail}>Dietary Guidelines for Americans 2020-2025</Text>
            <Text style={styles.sourceLink}>https://health.gov/dietaryguidelines</Text>
            <Text style={styles.sourceDescription}>Official evidence-based nutritional recommendations for macronutrients, meal timing, and portion sizes</Text>
          </View>

          <View style={styles.sourceBox}>
            <Text style={styles.sourceTitle}>National Institutes of Health (NIH)</Text>
            <Text style={styles.sourceDetail}>Office of Dietary Supplements</Text>
            <Text style={styles.sourceLink}>https://ods.od.nih.gov</Text>
            <Text style={styles.sourceDescription}>Scientific information on dietary supplements and nutrients</Text>
          </View>

          <View style={styles.sourceBox}>
            <Text style={styles.sourceTitle}>Academy of Nutrition and Dietetics</Text>
            <Text style={styles.sourceDetail}>Evidence Analysis Library & Practice Guidelines</Text>
            <Text style={styles.sourceLink}>https://eatright.org</Text>
            <Text style={styles.sourceDescription}>Position papers on total diet approach, portion control, and whole food nutrition</Text>
          </View>

          <View style={styles.researchBox}>
            <Text style={styles.researchTitle}>📖 Peer-Reviewed Research Citations:</Text>
            <Text style={styles.citationText}>• Protein & Satiety: International Journal of Obesity (2010) - "The role of protein in weight loss and maintenance"</Text>
            <Text style={styles.citationText}>• Intermittent Fasting: Cell Metabolism (2014) - "Intermittent fasting: the science of going without"</Text>
            <Text style={styles.citationText}>• Fiber Benefits: Nutrition Reviews (2013) - "Dietary fiber and satiety: the effects of oats on satiety"</Text>
            <Text style={styles.citationText}>• Whole Foods: American Journal of Clinical Nutrition (2016) - "Whole foods versus dietary supplements"</Text>
            <Text style={styles.citationText}>• Meal Timing: British Journal of Nutrition (2011) - "Meal frequency and energy balance"</Text>
          </View>

          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerTitle}>⚕️ Medical Disclaimer</Text>
            <Text style={styles.citationDisclaimer}>
              This nutrition education content is for general informational and educational purposes only based on published scientific research. It is not intended as medical advice or a substitute for professional healthcare guidance. Individual nutritional needs vary based on age, weight, health conditions, medications, and activity levels. Please consult a licensed healthcare provider, registered dietitian, or physician before making significant dietary changes or if you have specific medical conditions.
            </Text>
          </View>
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
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#9333EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  citationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  citationIntro: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 16,
    lineHeight: 20,
  },
  sourceBox: {
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#9333EA',
  },
  sourceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  sourceDetail: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  sourceLink: {
    fontSize: 12,
    color: '#9333EA',
    marginBottom: 6,
    fontWeight: '500',
  },
  sourceDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  researchBox: {
    backgroundColor: '#EEF2FF',
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  researchTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4338CA',
    marginBottom: 10,
  },
  citationText: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 17,
    marginBottom: 6,
  },
  disclaimerBox: {
    backgroundColor: '#FFF4E5',
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  citationDisclaimer: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
  },
  referencesSection: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  referenceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  referenceNumber: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: 'bold',
    marginRight: 6,
    minWidth: 22,
  },
  referenceText: {
    flex: 1,
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
  },
});
