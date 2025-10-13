import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription } from '../context/SubscriptionContext';

type SubscriptionScreenProps = {
  onClose: () => void;
};

export default function SubscriptionScreen({ onClose }: SubscriptionScreenProps) {
  const { activateSubscription, daysRemainingInTrial } = useSubscription();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleSubscribe = async () => {
    setIsPurchasing(true);
    
    try {
      await activateSubscription();
      Alert.alert(
        'Subscription Activated',
        'Your subscription has been activated successfully! Enjoy unlimited access to Pound Drop.',
        [
          {
            text: 'Continue',
            onPress: () => onClose()
          }
        ]
      );
    } catch (error) {
      console.error('Subscription error:', error);
      Alert.alert('Error', 'Failed to process subscription. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    
    try {
      await activateSubscription();
      Alert.alert(
        'Purchases Restored',
        'Your subscription has been successfully restored! You now have full access to Pound Drop.',
        [
          {
            text: 'Continue',
            onPress: () => onClose()
          }
        ]
      );
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  };

  const benefits = [
    { icon: 'restaurant-outline', title: 'Unlimited Meal Logging', description: 'Track all your meals with our comprehensive food database' },
    { icon: 'trending-down-outline', title: 'Weight Loss Tracking', description: 'Monitor your progress with beautiful charts and insights' },
    { icon: 'fitness-outline', title: 'Exercise & Wellness', description: 'Log workouts, steps, water, and more' },
    { icon: 'timer-outline', title: 'Intermittent Fasting', description: 'Track your fasting windows and stay consistent' },
    { icon: 'heart-outline', title: 'Mood & Feelings', description: 'Understand how food affects your wellbeing' },
    { icon: 'analytics-outline', title: 'Progress Reports', description: 'Celebrate wins and stay motivated' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscribe to Pound Drop</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Trial Banner */}
        {daysRemainingInTrial > 0 && (
          <View style={styles.trialBanner}>
            <Ionicons name="time-outline" size={24} color="#8B5CF6" />
            <Text style={styles.trialText}>
              {daysRemainingInTrial} day{daysRemainingInTrial !== 1 ? 's' : ''} left in your free trial
            </Text>
          </View>
        )}

        {/* Pricing Card */}
        <View style={styles.pricingCard}>
          <View style={styles.priceContainer}>
            <Text style={styles.currency}>$</Text>
            <Text style={styles.price}>4.95</Text>
            <Text style={styles.period}>/month</Text>
          </View>
          <Text style={styles.pricingSubtitle}>
            or get lifetime access for $47 one-time payment
          </Text>
          <View style={styles.trialBadge}>
            <Ionicons name="gift-outline" size={20} color="#10B981" />
            <Text style={styles.trialBadgeText}>3-day free trial included</Text>
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>What You Get:</Text>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Ionicons name={benefit.icon as any} size={24} color="#8B5CF6" />
              </View>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDescription}>{benefit.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Terms */}
        <Text style={styles.terms}>
          Your subscription will automatically renew monthly at $4.95 unless canceled at least 24 hours before the end of the current period. Subscriptions are managed through your Apple ID and can be canceled anytime in your iPhone Settings.
        </Text>
      </ScrollView>

      {/* Subscribe Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.subscribeButton, isPurchasing && styles.buttonDisabled]}
          onPress={handleSubscribe}
          disabled={isPurchasing || isRestoring}
        >
          {isPurchasing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.subscribeButtonText}>
                {daysRemainingInTrial > 0 ? 'Start Free Trial' : 'Subscribe Now'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestorePurchases}
          disabled={isPurchasing || isRestoring}
        >
          {isRestoring ? (
            <ActivityIndicator color="#8B5CF6" />
          ) : (
            <Text style={styles.restoreButtonText}>Restore Purchases</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 36,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  trialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 24,
  },
  trialText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
    marginLeft: 12,
  },
  pricingCard: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  currency: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginTop: 8,
  },
  price: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#8B5CF6',
    lineHeight: 64,
  },
  period: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: 24,
  },
  pricingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  trialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trialBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 8,
  },
  benefitsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  terms: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  subscribeButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
  },
});
