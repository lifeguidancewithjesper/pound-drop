import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

type SubscriptionStatus = 'trial' | 'active' | 'expired';

type SubscriptionContextType = {
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt: Date | null;
  daysRemainingInTrial: number;
  isTrialActive: boolean;
  isSubscriptionActive: boolean;
  startTrial: () => Promise<void>;
  activateSubscription: () => Promise<void>;
  checkSubscriptionStatus: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>('expired');
  const [trialEndsAt, setTrialEndsAt] = useState<Date | null>(null);
  const [daysRemainingInTrial, setDaysRemainingInTrial] = useState(0);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  useEffect(() => {
    if (trialEndsAt) {
      calculateDaysRemaining();
    }
  }, [trialEndsAt]);

  const loadSubscriptionData = async () => {
    try {
      const storedUser = await SecureStore.getItemAsync('pounddrop_user');
      if (!storedUser) {
        setSubscriptionStatus('expired');
        return;
      }

      const userData = JSON.parse(storedUser);
      
      const status = userData.subscriptionStatus || 'expired';
      setSubscriptionStatus(status);

      if (userData.trialEndsAt) {
        const trialEnd = new Date(userData.trialEndsAt);
        setTrialEndsAt(trialEnd);
        
        const now = new Date();
        if (now > trialEnd && status === 'trial') {
          setSubscriptionStatus('expired');
          await updateUserSubscriptionStatus('expired');
        }
      }
    } catch (error) {
      console.error('Error loading subscription data:', error);
    }
  };

  const calculateDaysRemaining = () => {
    if (!trialEndsAt) {
      setDaysRemainingInTrial(0);
      return;
    }

    const now = new Date();
    const diffTime = trialEndsAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    setDaysRemainingInTrial(Math.max(0, diffDays));
  };

  const updateUserSubscriptionStatus = async (status: SubscriptionStatus, trialEnd?: Date) => {
    try {
      const storedUser = await SecureStore.getItemAsync('pounddrop_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.subscriptionStatus = status;
        if (trialEnd) {
          userData.trialEndsAt = trialEnd.toISOString();
        }
        await SecureStore.setItemAsync('pounddrop_user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error updating subscription status:', error);
    }
  };

  const startTrial = async () => {
    try {
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 3);
      
      setSubscriptionStatus('trial');
      setTrialEndsAt(trialEnd);
      
      await updateUserSubscriptionStatus('trial', trialEnd);
      
      console.log('✅ Trial started - expires:', trialEnd.toISOString());
    } catch (error) {
      console.error('Error starting trial:', error);
      Alert.alert('Error', 'Failed to start trial. Please try again.');
    }
  };

  const activateSubscription = async () => {
    try {
      setSubscriptionStatus('active');
      await updateUserSubscriptionStatus('active');
      
      Alert.alert('Success!', 'Your subscription is now active. Thank you for subscribing to Pound Drop!');
      console.log('✅ Subscription activated');
    } catch (error) {
      console.error('Error activating subscription:', error);
      Alert.alert('Error', 'Failed to activate subscription. Please try again.');
    }
  };

  const checkSubscriptionStatus = async () => {
    await loadSubscriptionData();
  };

  const isTrialActive = subscriptionStatus === 'trial' && daysRemainingInTrial > 0;
  const isSubscriptionActive = subscriptionStatus === 'active';

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptionStatus,
        trialEndsAt,
        daysRemainingInTrial,
        isTrialActive,
        isSubscriptionActive,
        startTrial,
        activateSubscription,
        checkSubscriptionStatus,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}