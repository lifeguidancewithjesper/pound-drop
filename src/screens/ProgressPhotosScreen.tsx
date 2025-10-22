import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, Modal } from 'react-native';
import { useStorage, ProgressPhoto } from '../context/StorageContext';
import { theme } from '../utils/theme';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

export default function ProgressPhotosScreen({ navigation }: any) {
  const { progressPhotos, addProgressPhoto, deleteProgressPhoto, getTodayLog, weightUnit } = useStorage();
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is needed to take progress photos.');
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const todayLog = getTodayLog();
      const currentWeight = todayLog?.weight ? parseFloat(todayLog.weight) : undefined;
      const waist = todayLog?.measurements?.waist;
      const hips = todayLog?.measurements?.hips;

      await addProgressPhoto({
        date: new Date().toISOString().split('T')[0],
        weight: currentWeight,
        waist,
        hips,
        frontPhotoUri: result.assets[0].uri,
      });
    }
  };

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const todayLog = getTodayLog();
      const currentWeight = todayLog?.weight ? parseFloat(todayLog.weight) : undefined;
      const waist = todayLog?.measurements?.waist;
      const hips = todayLog?.measurements?.hips;

      await addProgressPhoto({
        date: new Date().toISOString().split('T')[0],
        weight: currentWeight,
        waist,
        hips,
        frontPhotoUri: result.assets[0].uri,
      });
    }
  };

  const viewPhoto = (photo: ProgressPhoto) => {
    setSelectedPhoto(photo);
    setShowPhotoModal(true);
  };

  const handleDeletePhoto = (photo: ProgressPhoto) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this progress photo? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteProgressPhoto(photo.id);
            setShowPhotoModal(false);
          },
        },
      ]
    );
  };

  const groupPhotosByMonth = () => {
    const groups: { [key: string]: ProgressPhoto[] } = {};
    progressPhotos.forEach(photo => {
      const date = new Date(photo.date);
      const key = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(photo);
    });
    return groups;
  };

  const photoGroups = groupPhotosByMonth();

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
          <Text style={styles.title}>Progress Photos</Text>
          <Text style={styles.subtitle}>Your Transformation Journey</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cameraButton]}
              onPress={takePhoto}
              data-testid="button-take-photo"
            >
              <Text style={styles.actionButtonIcon}>📷</Text>
              <Text style={styles.actionButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.galleryButton]}
              onPress={pickPhoto}
              data-testid="button-choose-photo"
            >
              <Text style={styles.actionButtonIcon}>🖼️</Text>
              <Text style={styles.actionButtonText}>Choose Photo</Text>
            </TouchableOpacity>
            {progressPhotos.length >= 2 && (
              <TouchableOpacity
                style={[styles.actionButton, styles.compareButton]}
                onPress={() => navigation.navigate('ComparePhotos')}
                data-testid="button-compare"
              >
                <Text style={styles.actionButtonIcon}>⚖️</Text>
                <Text style={styles.actionButtonText}>Compare</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Stats */}
          {progressPhotos.length > 0 && (
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{progressPhotos.length}</Text>
                <Text style={styles.statLabel}>Total Photos</Text>
              </View>
              {progressPhotos.length > 0 && (
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {Math.floor((Date.now() - progressPhotos[progressPhotos.length - 1].timestamp) / (1000 * 60 * 60 * 24))}
                  </Text>
                  <Text style={styles.statLabel}>Days Tracking</Text>
                </View>
              )}
            </View>
          )}

          {/* Empty State */}
          {progressPhotos.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📸</Text>
              <Text style={styles.emptyTitle}>Start Your Photo Journey</Text>
              <Text style={styles.emptyText}>
                Track your transformation with progress photos. Take your first photo today!
              </Text>
              <Text style={styles.emptyTip}>
                💡 Tip: Photos capture changes the scale can't measure
              </Text>
            </View>
          )}

          {/* Photo Timeline */}
          {Object.keys(photoGroups).map(month => (
            <View key={month} style={styles.monthSection}>
              <Text style={styles.monthTitle}>{month}</Text>
              <View style={styles.photoGrid}>
                {photoGroups[month].map(photo => (
                  <TouchableOpacity
                    key={photo.id}
                    style={styles.photoCard}
                    onPress={() => viewPhoto(photo)}
                    data-testid={`photo-${photo.id}`}
                  >
                    <Image source={{ uri: photo.frontPhotoUri }} style={styles.photoThumbnail} />
                    <View style={styles.photoOverlay}>
                      <Text style={styles.photoDate}>
                        {new Date(photo.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Text>
                      {photo.weight && (
                        <Text style={styles.photoWeight}>
                          {Math.round(photo.weight)} {weightUnit}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>

      {/* Photo Detail Modal */}
      <Modal
        visible={showPhotoModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedPhoto && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {new Date(selectedPhoto.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowPhotoModal(false)}
                    style={styles.closeButton}
                    data-testid="button-close-modal"
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Image source={{ uri: selectedPhoto.frontPhotoUri }} style={styles.fullPhoto} />

                <View style={styles.photoDetails}>
                  {selectedPhoto.weight && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Weight:</Text>
                      <Text style={styles.detailValue}>
                        {Math.round(selectedPhoto.weight)} {weightUnit}
                      </Text>
                    </View>
                  )}
                  {selectedPhoto.waist && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Waist:</Text>
                      <Text style={styles.detailValue}>{selectedPhoto.waist}"</Text>
                    </View>
                  )}
                  {selectedPhoto.hips && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Hips:</Text>
                      <Text style={styles.detailValue}>{selectedPhoto.hips}"</Text>
                    </View>
                  )}
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.shareButton]}
                    onPress={() => {
                      setShowPhotoModal(false);
                      navigation.navigate('SharePhoto', { photo: selectedPhoto });
                    }}
                    data-testid="button-share"
                  >
                    <Text style={styles.modalButtonText}>📤 Share</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.deleteButton]}
                    onPress={() => handleDeletePhoto(selectedPhoto)}
                    data-testid="button-delete"
                  >
                    <Text style={styles.modalButtonText}>🗑️ Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraButton: {
    backgroundColor: theme.colors.primary,
  },
  galleryButton: {
    backgroundColor: theme.colors.secondary,
  },
  compareButton: {
    backgroundColor: '#10B981',
  },
  actionButtonIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  emptyTip: {
    fontSize: 14,
    color: theme.colors.primary,
    fontStyle: 'italic',
  },
  monthSection: {
    marginBottom: 24,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoCard: {
    width: '48%',
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
  },
  photoDate: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  photoWeight: {
    color: 'white',
    fontSize: 11,
    opacity: 0.9,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  fullPhoto: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  photoDetails: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: theme.colors.primary,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
