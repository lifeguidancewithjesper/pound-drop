import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const USERS = [
  { id: "1", email: "admin@pounddrop.com", username: "Admin", status: "trial", created: "2025-09-04" },
  { id: "2", email: "demo@example.com", username: "Demo User", status: "trial", created: "2025-09-05" },
  { id: "3", email: "test@example.com", username: "Test User", status: "trial", created: "2025-08-26" },
  { id: "4", email: "user@example.com", username: "Regular User", status: "expired", created: "2025-08-28" },
];

export default function AdminScreen({ onLogout }: { onLogout: () => void }) {
  const [users, setUsers] = useState(USERS);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailType, setEmailType] = useState<'mass' | 'individual'>('mass');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  const deleteUser = (id: string, email: string) => {
    if (email === "admin@pounddrop.com") {
      Alert.alert("Error", "Cannot delete admin user");
      return;
    }
    
    Alert.alert(
      "Delete User", 
      `Delete user: ${email}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            setUsers(users.filter(u => u.id !== id));
            Alert.alert("Success", `User ${email} deleted successfully`);
          }
        }
      ]
    );
  };

  const openMassEmailModal = () => {
    setEmailType('mass');
    setSelectedUser(null);
    setEmailSubject('');
    setEmailMessage('');
    setShowEmailModal(true);
  };

  const openIndividualEmailModal = (user: any) => {
    setEmailType('individual');
    setSelectedUser(user);
    setEmailSubject('');
    setEmailMessage('');
    setShowEmailModal(true);
  };

  const sendEmail = () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      Alert.alert('Error', 'Please fill in both subject and message');
      return;
    }

    if (emailType === 'mass') {
      const recipientCount = users.filter(u => u.email !== 'admin@pounddrop.com').length;
      Alert.alert(
        'Confirm Mass Email',
        `Send "${emailSubject}" to ${recipientCount} users?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Send',
            onPress: () => {
              // Here you would integrate with your email service
              Alert.alert('Success', `Mass email sent to ${recipientCount} users!`);
              setShowEmailModal(false);
            }
          }
        ]
      );
    } else {
      Alert.alert(
        'Confirm Individual Email',
        `Send "${emailSubject}" to ${selectedUser?.email}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Send',
            onPress: () => {
              // Here you would integrate with your email service
              Alert.alert('Success', `Email sent to ${selectedUser?.email}!`);
              setShowEmailModal(false);
            }
          }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{users.length}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {users.filter(u => u.status === 'trial').length}
            </Text>
            <Text style={styles.statLabel}>Trial Users</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {users.filter(u => u.status === 'expired').length}
            </Text>
            <Text style={styles.statLabel}>Expired Users</Text>
          </View>
        </View>

        {/* Email Marketing Buttons */}
        <View style={styles.emailContainer}>
          <Text style={styles.tableTitle}>Email Marketing</Text>
          
          <TouchableOpacity style={styles.massEmailButton} onPress={openMassEmailModal}>
            <Text style={styles.massEmailText}>📧 Send Mass Promotion</Text>
            <Text style={styles.massEmailSubtext}>
              Blast to all {users.filter(u => u.email !== 'admin@pounddrop.com').length} users
            </Text>
          </TouchableOpacity>
        </View>

        {/* Users Table */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Users</Text>
          
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Email</Text>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Username</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Status</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Created</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Email</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Delete</Text>
          </View>
          
          {/* Table Rows */}
          {users.map((user) => (
            <View key={user.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{user.email}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>{user.username}</Text>
              <Text style={[styles.tableCell, { flex: 1 }, 
                user.status === 'trial' ? styles.trialStatus : styles.expiredStatus
              ]}>
                {user.status}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{user.created}</Text>
              
              <TouchableOpacity 
                style={{ flex: 1, paddingVertical: 12 }}
                onPress={() => openIndividualEmailModal(user)}
                disabled={user.email === "admin@pounddrop.com"}
              >
                <Text style={[
                  styles.emailButton,
                  user.email === "admin@pounddrop.com" && styles.emailButtonDisabled
                ]}>
                  {user.email === "admin@pounddrop.com" ? "-" : "Email"}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={{ flex: 1, paddingVertical: 12 }}
                onPress={() => deleteUser(user.id, user.email)}
                disabled={user.email === "admin@pounddrop.com"}
              >
                <Text style={[
                  styles.deleteButton,
                  user.email === "admin@pounddrop.com" && styles.deleteButtonDisabled
                ]}>
                  {user.email === "admin@pounddrop.com" ? "-" : "Delete"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        
      </ScrollView>

      {/* Email Modal */}
      <Modal
        visible={showEmailModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEmailModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {emailType === 'mass' ? 'Mass Email' : `Email ${selectedUser?.username}`}
            </Text>
            <TouchableOpacity onPress={sendEmail}>
              <Text style={styles.sendButton}>Send</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {emailType === 'individual' && (
              <View style={styles.recipientInfo}>
                <Text style={styles.recipientLabel}>To:</Text>
                <Text style={styles.recipientEmail}>{selectedUser?.email}</Text>
              </View>
            )}

            {emailType === 'mass' && (
              <View style={styles.recipientInfo}>
                <Text style={styles.recipientLabel}>To:</Text>
                <Text style={styles.recipientEmail}>
                  All {users.filter(u => u.email !== 'admin@pounddrop.com').length} users
                </Text>
              </View>
            )}

            <Text style={styles.inputLabel}>Subject</Text>
            <TextInput
              style={styles.subjectInput}
              value={emailSubject}
              onChangeText={setEmailSubject}
              placeholder="Enter email subject..."
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.inputLabel}>Message</Text>
            <TextInput
              style={styles.messageInput}
              value={emailMessage}
              onChangeText={setEmailMessage}
              placeholder="Write your promotional message here..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />

            {emailType === 'mass' && (
              <View style={styles.suggestionBox}>
                <Text style={styles.suggestionTitle}>💡 Promotion Ideas:</Text>
                <Text style={styles.suggestionText}>• "Limited time: 50% off premium features!"</Text>
                <Text style={styles.suggestionText}>• "New features just launched - check them out!"</Text>
                <Text style={styles.suggestionText}>• "Your weight loss journey continues..."</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableCell: {
    fontSize: 14,
    color: '#6B7280',
  },
  trialStatus: {
    color: '#10B981',
    fontWeight: '600',
  },
  expiredStatus: {
    color: '#EF4444',
    fontWeight: '600',
  },
  deleteButton: {
    color: '#EF4444',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  deleteButtonDisabled: {
    color: '#9CA3AF',
    textDecorationLine: 'none',
  },
  emailContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  massEmailButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  massEmailText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  massEmailSubtext: {
    color: '#BFDBFE',
    fontSize: 14,
    marginTop: 4,
  },
  emailButton: {
    color: '#3B82F6',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  emailButtonDisabled: {
    color: '#9CA3AF',
    textDecorationLine: 'none',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6B7280',
  },
  sendButton: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  recipientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  recipientLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginRight: 8,
  },
  recipientEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  subjectInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  messageInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    height: 150,
    marginBottom: 20,
  },
  suggestionBox: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#92400E',
    marginBottom: 4,
  },
});