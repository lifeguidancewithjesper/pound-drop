import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useStorage } from '../context/StorageContext';
import theme from '../utils/theme';
import logo from '../../assets/logo-pound-drop.png';

export default function LoginScreen({ 
  navigation,
  onLoginSuccess, 
  onAdminLoginSuccess 
}: { 
  navigation?: any;
  onLoginSuccess?: () => void;
  onAdminLoginSuccess?: () => void;
}) {
  const { setUserInfo } = useStorage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const storedUser = await SecureStore.getItemAsync('pounddrop_user');
      
      if (!storedUser) {
        Alert.alert('Error', 'No account found. Please create an account first.');
        setIsLoading(false);
        return;
      }

      const userData = JSON.parse(storedUser);
      
      // Allow login with either email OR username
      const isEmailMatch = userData.email === email;
      const isUsernameMatch = userData.username === email;
      const isPasswordMatch = userData.password === password;
      
      if ((isEmailMatch || isUsernameMatch) && isPasswordMatch) {
        await setUserInfo(userData.username, false);
        
        Alert.alert('Welcome back!', `Welcome back, ${userData.username}!`, [
          {
            text: 'OK',
            onPress: () => {
              onLoginSuccess?.();
            }
          }
        ]);
      } else {
        Alert.alert('Error', 'Invalid username/email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Email Required', 'Please enter your email address first.');
      return;
    }
    
    setResetPasswordLoading(true);
    try {
      // Since we're using mocks, simulate the forgot password functionality
      Alert.alert(
        'Password Reset Sent', 
        'If an account with that email exists, we\'ve sent you a password reset link.'
      );
    } catch (error) {
      console.error('Forgot password error:', error);
      Alert.alert('Error', 'Unable to send password reset email. Please try again later.');
    } finally {
      setResetPasswordLoading(false);
    }
  };
  
  const handleSignUp = () => {
    // Navigate to sign up screen or call prop if provided
    if (navigation && navigation.navigate) {
      navigation.navigate('SignUp');
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={logo} 
            style={styles.logoImage}
          />
        </View>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue your journey</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Username or Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={styles.forgotPassword} 
          onPress={handleForgotPassword}
          disabled={resetPasswordLoading}
        >
          <Text style={[styles.forgotPasswordText, resetPasswordLoading && styles.disabledText]}>
            {resetPasswordLoading ? 'Sending...' : 'Forgot Password?'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.signUpText}>Sign Up</Text>
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
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 32,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 4,
  },
  signUpText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#9333EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledText: {
    opacity: 0.5,
  },
});