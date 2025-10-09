import { View, Text, Modal, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface CelebrationModalProps {
  visible: boolean;
  milestone: number;
  unit: 'lbs' | 'kg';
  onClose: () => void;
}

export default function CelebrationModal({ visible, milestone, unit, onClose }: CelebrationModalProps) {
  const [confettiPositions] = useState(() => 
    Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      animValue: new Animated.Value(0),
      delay: Math.random() * 500,
      emoji: ['🎉', '⭐', '🏆', '💪', '🌟', '✨'][Math.floor(Math.random() * 6)]
    }))
  );

  useEffect(() => {
    if (visible) {
      confettiPositions.forEach(({ animValue, delay }) => {
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          })
        ]).start();
      });
    } else {
      confettiPositions.forEach(({ animValue }) => {
        animValue.setValue(0);
      });
    }
  }, [visible]);

  const getMessage = () => {
    if (milestone >= 20) return "You're absolutely crushing it! 20+ lbs down! 🔥";
    if (milestone >= 15) return "Incredible progress! 15 lbs milestone reached! 💎";
    if (milestone >= 10) return "Double digits! You lost 10 lbs! 🚀";
    if (milestone >= 5) return "Amazing! 5 lbs down! Keep going! 💪";
    if (milestone >= 2) return "You lost 2 lbs! Great start! 🎯";
    return "You're making progress! 🌟";
  };

  const getSubMessage = () => {
    if (milestone >= 20) return "This is a major achievement! You're transforming your life!";
    if (milestone >= 15) return "Your dedication is paying off in a big way!";
    if (milestone >= 10) return "You've entered the double digits - what an accomplishment!";
    if (milestone >= 5) return "You're proving you can do this!";
    if (milestone >= 2) return "Every pound counts - celebrate this win!";
    return "Keep tracking and celebrating your progress!";
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Confetti Animation */}
        {confettiPositions.map((item, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.confetti,
              {
                left: `${item.left}%`,
                transform: [
                  {
                    translateY: item.animValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-50, 600]
                    })
                  },
                  {
                    rotate: item.animValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg']
                    })
                  }
                ],
                opacity: item.animValue.interpolate({
                  inputRange: [0, 0.8, 1],
                  outputRange: [1, 1, 0]
                })
              }
            ]}
          >
            {item.emoji}
          </Animated.Text>
        ))}

        {/* Celebration Card */}
        <View style={styles.celebrationCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="trophy" size={64} color="#FACC15" />
          </View>

          <Text style={styles.title}>{getMessage()}</Text>
          <Text style={styles.milestone}>-{milestone} {unit}</Text>
          <Text style={styles.subtitle}>{getSubMessage()}</Text>

          <View style={styles.encouragementBox}>
            <Text style={styles.encouragementText}>
              💜 You're following the Pound Drop Method perfectly! Keep celebrating these wins and stay consistent!
            </Text>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose} data-testid="button-close-celebration">
            <Text style={styles.closeButtonText}>Continue Tracking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confetti: {
    position: 'absolute',
    fontSize: 24,
    top: 0,
  },
  celebrationCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#9333EA',
  },
  iconContainer: {
    backgroundColor: '#EEF2FF',
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9333EA',
    textAlign: 'center',
    marginBottom: 12,
  },
  milestone: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#DB2777',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  encouragementBox: {
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#9333EA',
  },
  encouragementText: {
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: '#9333EA',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
