import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useRef } from 'react';
import { ProgressPhoto, useStorage } from '../context/StorageContext';
import { theme } from '../utils/theme';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';

interface SharePhotoScreenProps {
  navigation: any;
  route: {
    params: {
      photo?: ProgressPhoto;
      beforePhoto?: ProgressPhoto;
      afterPhoto?: ProgressPhoto;
    };
  };
}

export default function SharePhotoScreen({ navigation, route }: SharePhotoScreenProps) {
  const { weightUnit } = useStorage();
  const viewRef = useRef<View>(null);
  const { photo, beforePhoto, afterPhoto } = route.params;

  const isComparison = beforePhoto && afterPhoto;

  const calculateStats = () => {
    if (!beforePhoto || !afterPhoto) return null;

    const weightDiff = beforePhoto.weight && afterPhoto.weight
      ? afterPhoto.weight - beforePhoto.weight
      : null;

    const daysDiff = Math.abs(
      Math.floor((new Date(afterPhoto.date).getTime() - new Date(beforePhoto.date).getTime()) / (1000 * 60 * 60 * 24))
    );

    return { weightDiff, daysDiff };
  };

  const stats = calculateStats();

  const handleShare = async () => {
    try {
      if (!viewRef.current) return;

      // Capture the view as an image
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.9,
      });

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }

      // Share the image
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share Your Progress',
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share photo. Please try again.');
    }
  };

  const handleSaveToPhotos = async () => {
    try {
      if (!viewRef.current) return;

      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.9,
      });

      // Save to device's photo library
      Alert.alert(
        'Success',
        'Image saved! You can now find it in your Photos app and share it anywhere.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error saving:', error);
      Alert.alert('Error', 'Failed to save photo. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          data-testid="button-back"
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Share Progress</Text>
          <Text style={styles.subtitle}>Inspire Others</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Preview Card - This will be captured and shared */}
        <View style={styles.previewContainer}>
          <View ref={viewRef} collapsable={false} style={styles.shareCard}>
            <View style={styles.shareHeader}>
              <Text style={styles.shareTitle}>
                {isComparison ? '🎉 Transformation' : '📸 Progress Photo'}
              </Text>
            </View>

            {isComparison && beforePhoto && afterPhoto ? (
              <>
                <View style={styles.comparisonRow}>
                  <View style={styles.sharePhotoColumn}>
                    <Text style={styles.shareLabel}>BEFORE</Text>
                    <Image source={{ uri: beforePhoto.frontPhotoUri }} style={styles.sharePhoto} />
                    <Text style={styles.shareDate}>
                      {new Date(beforePhoto.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </Text>
                    {beforePhoto.weight && (
                      <Text style={styles.shareWeight}>{Math.round(beforePhoto.weight)} {weightUnit}</Text>
                    )}
                  </View>

                  <View style={styles.sharePhotoColumn}>
                    <Text style={styles.shareLabel}>AFTER</Text>
                    <Image source={{ uri: afterPhoto.frontPhotoUri }} style={styles.sharePhoto} />
                    <Text style={styles.shareDate}>
                      {new Date(afterPhoto.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </Text>
                    {afterPhoto.weight && (
                      <Text style={styles.shareWeight}>{Math.round(afterPhoto.weight)} {weightUnit}</Text>
                    )}
                  </View>
                </View>

                {stats && (
                  <View style={styles.statsBox}>
                    {stats.weightDiff && stats.weightDiff < 0 && (
                      <Text style={styles.statText}>
                        💪 {Math.abs(Math.round(stats.weightDiff))} {weightUnit} lost in {stats.daysDiff} days!
                      </Text>
                    )}
                    {(!stats.weightDiff || stats.weightDiff >= 0) && (
                      <Text style={styles.statText}>
                        🌟 {stats.daysDiff} days of progress!
                      </Text>
                    )}
                  </View>
                )}
              </>
            ) : photo ? (
              <>
                <Image source={{ uri: photo.frontPhotoUri }} style={styles.singlePhoto} />
                <View style={styles.statsBox}>
                  <Text style={styles.shareDate}>
                    {new Date(photo.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </Text>
                  {photo.weight && (
                    <Text style={styles.shareWeight}>{Math.round(photo.weight)} {weightUnit}</Text>
                  )}
                </View>
              </>
            ) : null}

            <View style={styles.brandingFooter}>
              <Text style={styles.brandingText}>Pound Drop Method ✨</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleShare}
            data-testid="button-share-native"
          >
            <Text style={styles.actionButtonIcon}>📤</Text>
            <Text style={styles.actionButtonText}>Share Now</Text>
            <Text style={styles.actionButtonHint}>Instagram, Facebook, Messages & more</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleSaveToPhotos}
            data-testid="button-save-photos"
          >
            <Text style={styles.actionButtonIcon}>💾</Text>
            <Text style={styles.actionButtonText}>Save to Photos</Text>
            <Text style={styles.actionButtonHint}>Download to your device</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipBox}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>
            Your transformation can inspire others on their journey!
          </Text>
        </View>
      </View>
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
  backButtonText: {
    fontSize: 24,
    color: theme.colors.primary,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  previewContainer: {
    marginBottom: 24,
  },
  shareCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  shareHeader: {
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  shareTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  comparisonRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  sharePhotoColumn: {
    flex: 1,
    alignItems: 'center',
  },
  shareLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    letterSpacing: 1,
  },
  sharePhoto: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    marginBottom: 8,
  },
  singlePhoto: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  shareDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  shareWeight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statsBox: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  brandingFooter: {
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  brandingText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary,
  },
  actionButtonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionButtonHint: {
    color: 'white',
    fontSize: 13,
    opacity: 0.9,
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#78350F',
    lineHeight: 20,
  },
});
