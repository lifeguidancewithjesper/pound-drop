import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription } from '../context/SubscriptionContext';
import Purchases, { PurchasesPackage, PurchasesOffering } from 'react-native-purchases';

const REVENUECAT_IOS_API_KEY = 'appl_dmlsaBLEOqcArrhcWncgFVaxxEs';

// Entitlement identifier (must match exactly what's in RevenueCat dashboard)
const ENTITLEMENT_ID = 'Pounddrop Pro';

type SubscriptionScreenProps = {
  onClose: () => void;
};

export default function SubscriptionScreen({ onClose }: SubscriptionScreenProps) {
  const { activateSubscription, daysRemainingInTrial } = useSubscription();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [monthlyPackage, setMonthlyPackage] = useState<PurchasesPackage | null>(null);
  const [lifetimePackage, setLifetimePackage] = useState<PurchasesPackage | null>(null);

  useEffect(() => {
    const setupRevenueCat = async () => {
      try {
        Purchases.configure({ apiKey: REVENUECAT_IOS_API_KEY });

        const offerings = await Purchases.getOfferings();
        if (offerings.current) {
          setOffering(offerings.current);

          for (const pkg of offerings.current.availablePackages) {
            const identifier = pkg.product.identifier;
            if (identifier.includes('monthly')) {
              setMonthlyPackage(pkg);
            } else if (identifier.includes('lifetime') || pkg.packageType === 'LIFETIME') {
              setLifetimePackage(pkg);
            }
          }
        }
      } catch (error) {
        console.log('RevenueCat setup error (non-fatal):', error);
      } finally {
        setIsLoading(false);
      }
    };

    setupRevenueCat();
  }, []);

  const handleSubscribeMonthly = async () => {
    if (!monthlyPackage) {
      Alert.alert('Subscription Unavailable', 'Unable to load subscription at this time. Please check your internet connection and try again.');
      return;
    }
    setIsPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(monthlyPackage);
      if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
        await activateSubscription();
        Alert.alert(
          'Success! 🎉',
          'Your subscription is active. Enjoy Pound Drop!',
          [{ text: 'Continue', onPress: () => onClose() }]
        );
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        Alert.alert('Purchase Failed', error.message || 'An error occurred. Please try again.');
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handlePurchaseLifetime = async () => {
    if (!lifetimePackage) {
      Alert.alert('Purchase Unavailable', 'Unable to load lifetime access at this time. Please check your internet connection and try again.');
      return;
    }
    setIsPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(lifetimePackage);
      if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
        await activateSubscription();
        Alert.alert(
          'Success! 🎉',
          'You now have lifetime access to Pound Drop!',
          [{ text: 'Continue', onPress: () => onClose() }]
        );
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        Alert.alert('Purchase Failed', error.message || 'An error occurred. Please try again.');
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    try {
      const customerInfo = await Purchases.restorePurchases();
      if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
        await activateSubscription();
        Alert.alert(
          'Restored! ✅',
          'Your purchase has been restored.',
          [{ text: 'Continue', onPress: () => onClose() }]
        );
      } else {
        Alert.alert('No Purchase Found', 'We could not find a previous purchase on this Apple ID.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to restore purchases. Please try again.');
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

  const monthlyPrice = monthlyPackage?.product.priceString || '$4.95';
  const lifetimePrice = lifetimePackage?.product.priceString || '$49.99';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscribe to Pound Drop</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text style={styles.loadingText}>Loading subscription options...</Text>
          </View>
        )}

        {!isLoading && (
          <>
            {daysRemainingInTrial > 0 && (
              <View style={styles.trialBanner}>
                <Ionicons name="time-outline" size={24} color="#8B5CF6" />
                <Text style={styles.trialText}>
                  {daysRemainingInTrial} day{daysRemainingInTrial !== 1 ? 's' : ''} left in your free trial
                </Text>
              </View>
            )}

            <View style={styles.pricingSection}>
              <TouchableOpacity
                style={styles.pricingCard}
                onPress={handleSubscribeMonthly}
                disabled={isPurchasing || isRestoring}
              >
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>{monthlyPrice}</Text>
                  <Text style={styles.period}>/month</Text>
                </View>
                <View style={styles.trialBadge}>
                  <Ionicons name="gift-outline" size={20} color="#10B981" />
                  <Text style={styles.trialBadgeText}>3-day free trial included</Text>
                </View>
                <Text style={styles.cardDescription}>Cancel anytime in iPhone Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.pricingCard, styles.lifetimeCard]}
                onPress={handlePurchaseLifetime}
                disabled={isPurchasing || isRestoring}
              >
                <View style={styles.lifetimeBadge}>
                  <Text style={styles.lifetimeBadgeText}>BEST VALUE</Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>{lifetimePrice}</Text>
                </View>
                <Text style={styles.lifetimeSubtitle}>One-time payment</Text>
                <Text style={styles.cardDescription}>Lifetime access • No recurring charges</Text>
              </TouchableOpacity>
            </View>

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

            <Text style={styles.terms}>
              Your subscription will automatically renew monthly at {monthlyPrice} unless canceled at least 24 hours before the end of the current period. Subscriptions are managed through your Apple ID and can be canceled anytime in your iPhone Settings.
            </Text>

            <View style={styles.legalLinks}>
              <TouchableOpacity
                onPress={() => Linking.openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')}
                style={styles.legalLinkButton}
              >
                <Text style={styles.legalLinkText}>Terms of Use (EULA)</Text>
                <Ionicons name="open-outline" size={14} color="#8B5CF6" />
              </TouchableOpacity>
              <Text style={styles.legalSeparator}>•</Text>
              <TouchableOpacity
                onPress={() => Linking.openURL('https://www.apple.com/legal/privacy/')}
                style={styles.legalLinkButton}
              >
                <Text style={styles.legalLinkText}>Privacy Policy</Text>
                <Ionicons name="open-outline" size={14} color="#8B5CF6" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {!isLoading && (
        <View style={styles.footer}>
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
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
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
  closeButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  headerSpacer: { width: 36 },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  loadingContainer: { paddingVertical: 60, alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#6B7280' },
  trialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 24,
  },
  trialText: { fontSize: 16, fontWeight: '600', color: '#8B5CF6', marginLeft: 12 },
  pricingSection: { marginBottom: 24 },
  pricingCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  lifetimeCard: { borderWidth: 2, borderColor: '#8B5CF6' },
  lifetimeBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  lifetimeBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#FFFFFF' },
  priceContainer: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  price: { fontSize: 48, fontWeight: 'bold', color: '#8B5CF6' },
  period: { fontSize: 16, color: '#6B7280', marginTop: 16 },
  lifetimeSubtitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  trialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  trialBadgeText: { fontSize: 14, fontWeight: '600', color: '#10B981', marginLeft: 8 },
  cardDescription: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  benefitsSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
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
  benefitText: { flex: 1 },
  benefitTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  benefitDescription: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
  terms: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  legalLinkButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legalLinkText: {
    fontSize: 13,
    color: '#8B5CF6',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  legalSeparator: { fontSize: 12, color: '#9CA3AF', marginHorizontal: 12 },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  restoreButton: { paddingVertical: 12, alignItems: 'center' },
  restoreButtonText: { fontSize: 16, fontWeight: '600', color: '#8B5CF6' },
});
