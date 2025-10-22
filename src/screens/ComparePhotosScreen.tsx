import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useState } from 'react';
import { useStorage, ProgressPhoto } from '../context/StorageContext';
import { theme } from '../utils/theme';

export default function ComparePhotosScreen({ navigation }: any) {
  const { progressPhotos, weightUnit } = useStorage();
  const [beforePhoto, setBeforePhoto] = useState<ProgressPhoto | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<ProgressPhoto | null>(null);
  const [selectingFor, setSelectingFor] = useState<'before' | 'after' | null>(null);

  const handlePhotoSelect = (photo: ProgressPhoto) => {
    if (selectingFor === 'before') {
      setBeforePhoto(photo);
      setSelectingFor('after');
    } else if (selectingFor === 'after') {
      setAfterPhoto(photo);
      setSelectingFor(null);
    }
  };

  const calculateDifference = () => {
    if (!beforePhoto || !afterPhoto) return null;

    const weightDiff = beforePhoto.weight && afterPhoto.weight 
      ? (afterPhoto.weight - beforePhoto.weight)
      : null;

    const waistDiff = beforePhoto.waist && afterPhoto.waist
      ? (parseFloat(afterPhoto.waist) - parseFloat(beforePhoto.waist))
      : null;

    const hipsDiff = beforePhoto.hips && afterPhoto.hips
      ? (parseFloat(afterPhoto.hips) - parseFloat(beforePhoto.hips))
      : null;

    const daysDiff = Math.abs(
      Math.floor((new Date(afterPhoto.date).getTime() - new Date(beforePhoto.date).getTime()) / (1000 * 60 * 60 * 24))
    );

    return { weightDiff, waistDiff, hipsDiff, daysDiff };
  };

  const stats = calculateDifference();

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
          <Text style={styles.title}>Compare Progress</Text>
          <Text style={styles.subtitle}>Before & After</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Selection Status */}
          {!beforePhoto || !afterPhoto ? (
            <View style={styles.instructionCard}>
              <Text style={styles.instructionIcon}>
                {!beforePhoto ? '1️⃣' : '2️⃣'}
              </Text>
              <Text style={styles.instructionTitle}>
                {!beforePhoto ? 'Select BEFORE Photo' : 'Select AFTER Photo'}
              </Text>
              <Text style={styles.instructionText}>
                {!beforePhoto 
                  ? 'Choose your starting photo from the timeline below'
                  : 'Choose your current or goal photo to compare'}
              </Text>
            </View>
          ) : null}

          {/* Comparison View */}
          {beforePhoto && afterPhoto && (
            <>
              <View style={styles.comparisonContainer}>
                <View style={styles.photoColumn}>
                  <Text style={styles.columnLabel}>BEFORE</Text>
                  <TouchableOpacity onPress={() => setSelectingFor('before')}>
                    <Image source={{ uri: beforePhoto.frontPhotoUri }} style={styles.comparePhoto} />
                  </TouchableOpacity>
                  <View style={styles.photoInfo}>
                    <Text style={styles.photoDate}>
                      {new Date(beforePhoto.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                    {beforePhoto.weight && (
                      <Text style={styles.photoWeight}>{Math.round(beforePhoto.weight)} {weightUnit}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.photoColumn}>
                  <Text style={styles.columnLabel}>AFTER</Text>
                  <TouchableOpacity onPress={() => setSelectingFor('after')}>
                    <Image source={{ uri: afterPhoto.frontPhotoUri }} style={styles.comparePhoto} />
                  </TouchableOpacity>
                  <View style={styles.photoInfo}>
                    <Text style={styles.photoDate}>
                      {new Date(afterPhoto.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                    {afterPhoto.weight && (
                      <Text style={styles.photoWeight}>{Math.round(afterPhoto.weight)} {weightUnit}</Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Stats */}
              {stats && (
                <View style={styles.statsCard}>
                  <Text style={styles.statsTitle}>📊 Your Transformation</Text>
                  
                  <View style={styles.statRow}>
                    <Text style={styles.statIcon}>📅</Text>
                    <Text style={styles.statLabel}>Time Period:</Text>
                    <Text style={styles.statValue}>{stats.daysDiff} days</Text>
                  </View>

                  {stats.weightDiff !== null && (
                    <View style={[styles.statRow, stats.weightDiff <= 0 && styles.highlightRow]}>
                      <Text style={styles.statIcon}>⚖️</Text>
                      <Text style={styles.statLabel}>Weight Change:</Text>
                      <Text style={[styles.statValue, stats.weightDiff <= 0 && styles.positiveChange]}>
                        {stats.weightDiff > 0 ? '+' : ''}{Math.round(stats.weightDiff)} {weightUnit}
                      </Text>
                    </View>
                  )}

                  {stats.waistDiff !== null && (
                    <View style={[styles.statRow, stats.waistDiff <= 0 && styles.highlightRow]}>
                      <Text style={styles.statIcon}>📏</Text>
                      <Text style={styles.statLabel}>Waist Change:</Text>
                      <Text style={[styles.statValue, stats.waistDiff <= 0 && styles.positiveChange]}>
                        {stats.waistDiff > 0 ? '+' : ''}{stats.waistDiff.toFixed(1)}"
                      </Text>
                    </View>
                  )}

                  {stats.hipsDiff !== null && (
                    <View style={[styles.statRow, stats.hipsDiff <= 0 && styles.highlightRow]}>
                      <Text style={styles.statIcon}>📏</Text>
                      <Text style={styles.statLabel}>Hips Change:</Text>
                      <Text style={[styles.statValue, stats.hipsDiff <= 0 && styles.positiveChange]}>
                        {stats.hipsDiff > 0 ? '+' : ''}{stats.hipsDiff.toFixed(1)}"
                      </Text>
                    </View>
                  )}

                  {stats.weightDiff && stats.weightDiff < 0 && (
                    <View style={styles.celebrationBanner}>
                      <Text style={styles.celebrationText}>
                        🎉 Amazing progress! You've lost {Math.abs(Math.round(stats.weightDiff))} {weightUnit}!
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Share Button */}
              <TouchableOpacity
                style={styles.shareButton}
                onPress={() => navigation.navigate('SharePhoto', { beforePhoto, afterPhoto })}
                data-testid="button-share-comparison"
              >
                <Text style={styles.shareButtonText}>📤 Share Transformation</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Photo Timeline */}
          <View style={styles.timelineSection}>
            <Text style={styles.timelineTitle}>
              {selectingFor ? 'Select a photo:' : 'Your Photo Timeline'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeline}>
              {progressPhotos.map(photo => (
                <TouchableOpacity
                  key={photo.id}
                  style={[
                    styles.timelinePhoto,
                    (beforePhoto?.id === photo.id || afterPhoto?.id === photo.id) && styles.selectedPhoto,
                    selectingFor && styles.selectablePhoto
                  ]}
                  onPress={() => selectingFor ? handlePhotoSelect(photo) : null}
                  data-testid={`timeline-photo-${photo.id}`}
                >
                  <Image source={{ uri: photo.frontPhotoUri }} style={styles.timelineImage} />
                  <View style={styles.timelineOverlay}>
                    <Text style={styles.timelineDate}>
                      {new Date(photo.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  </View>
                  {beforePhoto?.id === photo.id && (
                    <View style={styles.selectionBadge}>
                      <Text style={styles.selectionBadgeText}>BEFORE</Text>
                    </View>
                  )}
                  {afterPhoto?.id === photo.id && (
                    <View style={styles.selectionBadge}>
                      <Text style={styles.selectionBadgeText}>AFTER</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {!beforePhoto && !selectingFor && (
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => setSelectingFor('before')}
              data-testid="button-start-comparison"
            >
              <Text style={styles.startButtonText}>Start Comparison</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 40 }} />
        </View>
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
  instructionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  instructionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  comparisonContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoColumn: {
    flex: 1,
    alignItems: 'center',
  },
  columnLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8,
    letterSpacing: 1,
  },
  comparePhoto: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  photoInfo: {
    marginTop: 8,
    alignItems: 'center',
  },
  photoDate: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  photoWeight: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 2,
  },
  divider: {
    width: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  highlightRow: {
    backgroundColor: '#F0FDF4',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    borderBottomColor: '#D1FAE5',
  },
  statIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  statLabel: {
    flex: 1,
    fontSize: 15,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  positiveChange: {
    color: '#10B981',
  },
  celebrationBanner: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  celebrationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  shareButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timelineSection: {
    marginBottom: 20,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  timeline: {
    flexDirection: 'row',
  },
  timelinePhoto: {
    width: 120,
    aspectRatio: 3 / 4,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  selectedPhoto: {
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  selectablePhoto: {
    opacity: 0.7,
  },
  timelineImage: {
    width: '100%',
    height: '100%',
  },
  timelineOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
  },
  timelineDate: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectionBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    backgroundColor: theme.colors.primary,
    padding: 4,
    borderRadius: 6,
  },
  selectionBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
