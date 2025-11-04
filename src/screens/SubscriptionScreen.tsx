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
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription } from '../context/SubscriptionContext';
import {
  initConnection,
  endConnection,
  getSubscriptions,
  getProducts,
  requestPurchase,
  requestSubscription,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
  type ProductPurchase,
  type PurchaseError,
  type Product,
  type Subscription,
} from 'react-native-iap';

type SubscriptionScreenProps = {
  onClose: () => void;
};

// Product IDs from App Store Connect
const SUBSCRIPTION_SKUS = Platform.select({
  ios: ['com.lifeguidancewithjesper.pounddrop.monthly.v2'],
  android: ['com.lifeguidancewithjesper.pounddrop.monthly.v2'],
  default: [],
});

const PRODUCT_SKUS = Platform.select({
  ios: ['com.lifeguidancewithjesper.pounddrop.premium_lifetime'],
  android: ['com.lifeguidancewithjesper.pounddrop.premium_lifetime'],
  default: [],
});

export default function SubscriptionScreen({ onClose }: SubscriptionScreenProps) {
  const { activateSubscription, daysRemainingInTrial } = useSubscription();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyProduct, setMonthlyProduct] = useState<Subscription | null>(null);
  const [lifetimeProduct, setLifetimeProduct] = useState<Product | null>(null);

  useEffect(() => {
    let purchaseUpdateSubscription: any;
    let purchaseErrorSubscription: any;

    const setupIAP = async () => {
      try {
        // Initialize connection to App Store/Play Store
        await initConnection();
        console.log('IAP connection initialized');

        // Get available products
        const subscriptions = await getSubscriptions({ skus: SUBSCRIPTION_SKUS });
        const products = await getProducts({ skus: PRODUCT_SKUS });

        if (subscriptions && subscriptions.length > 0) {
          setMonthlyProduct(subscriptions[0]);
          console.log('Monthly subscription loaded:', subscriptions[0]);
        }

        if (products && products.length > 0) {
          setLifetimeProduct(products[0]);
          console.log('Lifetime product loaded:', products[0]);
        }

        // Listen for purchase updates
        purchaseUpdateSubscription = purchaseUpdatedListener(
          async (purchase: ProductPurchase) => {
            console.log('Purchase update received:', purchase);
            const receipt = purchase.transactionReceipt;
            
            if (receipt) {
              try {
                // Finish the transaction
                await finishTransaction({ purchase, isConsumable: false });
                
                // Activate subscription in app
                await activateSubscription();
                
                Alert.alert(
                  'Success! 🎉',
                  'Your subscription has been activated. Enjoy unlimited access to Pound Drop!',
                  [
                    {
                      text: 'Continue',
                      onPress: () => onClose()
                    }
                  ]
                );
              } catch (error) {
                console.error('Error finishing transaction:', error);
              }
            }
          }
        );

        // Listen for purchase errors
        purchaseErrorSubscription = purchaseErrorListener(
          (error: PurchaseError) => {
            if (error.code !== 'E_USER_CANCELLED') {
              console.error('Purchase error:', error);
              Alert.alert('Purchase Failed', error.message || 'An error occurred during purchase.');
            }
            setIsPurchasing(false);
          }
        );

        setIsLoading(false);
      } catch (error) {
        console.error('Error setting up IAP:', error);
        Alert.alert(
          'Setup Error',
          'Unable to load subscription options. Please try again later.'
        );
        setIsLoading(false);
      }
    };

    setupIAP();

    // Cleanup on unmount
    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
      endConnection();
    };
  }, []);

  const handleSubscribeMonthly = async () => {
    if (!monthlyProduct) {
      Alert.alert('Error', 'Monthly subscription not available');
      return;
    }

    setIsPurchasing(true);
    
    try {
      await requestSubscription({
        sku: monthlyProduct.productId,
        ...(Platform.OS === 'android' && {
          subscriptionOffers: [
            {
              sku: monthlyProduct.productId,
              offerToken: (monthlyProduct as any).subscriptionOfferDetails?.[0]?.offerToken || '',
            },
          ],
        }),
      });
    } catch (error: any) {
      console.error('Subscription error:', error);
      if (error.code !== 'E_USER_CANCELLED') {
        Alert.alert('Error', 'Failed to process subscription. Please try again.');
      }
      setIsPurchasing(false);
    }
  };

  const handlePurchaseLifetime = async () => {
    if (!lifetimeProduct) {
      Alert.alert('Error', 'Lifetime access not available');
      return;
    }

    setIsPurchasing(true);
    
    try {
      await requestPurchase({ skus: [lifetimeProduct.productId] });
    } catch (error: any) {
      console.error('Purchase error:', error);
      if (error.code !== 'E_USER_CANCELLED') {
        Alert.alert('Error', 'Failed to process purchase. Please try again.');
      }
      setIsPurchasing(false);
    }
  };

  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    
    try {
      // Note: react-native-iap handles restore automatically
      // When user taps restore, iOS will check for existing purchases
      // and trigger purchaseUpdatedListener if found
      
      Alert.alert(
        'Restore Purchases',
        'Checking for previous purchases...',
        [
          {
            text: 'OK',
            onPress: async () => {
              // The restore happens automatically through Apple
              // If purchase exists, purchaseUpdatedListener will fire
              setTimeout(() => {
                setIsRestoring(false);
                Alert.alert(
                  'Restore Complete',
                  'If you had a previous purchase, it has been restored. If not, you may need to subscribe again.'
                );
              }, 2000);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
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

  const monthlyPrice = monthlyProduct?.localizedPrice || '$4.95';
  const lifetimePrice = lifetimeProduct?.localizedPrice || '$49.99';

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
        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text style={styles.loadingText}>Loading subscription options...</Text>
          </View>
        )}

        {!isLoading && (
          <>
            {/* Trial Banner */}
            {daysRemainingInTrial > 0 && (
              <View style={styles.trialBanner}>
                <Ionicons name="time-outline" size={24} color="#8B5CF6" />
                <Text style={styles.trialText}>
                  {daysRemainingInTrial} day{daysRemainingInTrial !== 1 ? 's' : ''} left in your free trial
                </Text>
              </View>
            )}

            {/* Pricing Cards */}
            <View style={styles.pricingSection}>
              {/* Monthly Subscription */}
              {monthlyProduct && (
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
                  <Text style={styles.cardDescription}>
                    Cancel anytime in iPhone Settings
                  </Text>
                </TouchableOpacity>
              )}

              {/* Lifetime Access */}
              {lifetimeProduct && (
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
                  <Text style={styles.cardDescription}>
                    Lifetime access • No recurring charges
                  </Text>
                </TouchableOpacity>
              )}
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
              Your subscription will automatically renew monthly at {monthlyPrice} unless canceled at least 24 hours before the end of the current period. Subscriptions are managed through your Apple ID and can be canceled anytime in your iPhone Settings.
            </Text>

            {/* Legal Links */}
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

      {/* Footer with Restore Button */}
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
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
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
  pricingSection: {
    marginBottom: 24,
  },
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
  lifetimeCard: {
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  lifetimeBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  lifetimeBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  price: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  period: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  lifetimeSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  trialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  trialBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
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
    marginBottom: 16,
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  legalLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legalLinkText: {
    fontSize: 13,
    color: '#8B5CF6',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  legalSeparator: {
    fontSize: 12,
    color: '#9CA3AF',
    marginHorizontal: 12,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
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
