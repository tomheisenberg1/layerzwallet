import React, { useContext, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AccountNumberContext } from '@shared/hooks/AccountNumberContext';
import { ScanQrContext } from '@/src/hooks/ScanQrContext';
import { SecureStorage } from '@/src/class/secure-storage';
import { STORAGE_KEY_MNEMONIC } from '@shared/types/IStorage';
import { isDemoMode } from '@/src/demo-data';

export default function SettingsScreen() {
  const { accountNumber, setAccountNumber } = useContext(AccountNumberContext);
  const [isClearing, setIsClearing] = useState(false);
  const { scanQr } = useContext(ScanQrContext);
  const router = useRouter();

  const handleClearStorage = async () => {
    Alert.alert('Clear Storage', 'Are you sure you want to clear all app data? This action cannot be undone.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          setIsClearing(true);
          try {
            await AsyncStorage.clear();
            await SecureStorage.setItem(STORAGE_KEY_MNEMONIC, '');
            Alert.alert('Storage Cleared', 'All app data has been cleared successfully. The app will now restart.', [
              {
                text: 'OK',
                onPress: () => {
                  // Navigate back to the index screen which will handle redirection to onboarding
                  router.replace('/');
                },
              },
            ]);
          } catch (error) {
            console.error('Error clearing storage:', error);
            Alert.alert('Error', 'Failed to clear storage. Please try again.');
          } finally {
            setIsClearing(false);
          }
        },
      },
    ]);
  };

  const handleAccountChange = (newAccountNumber: number) => {
    setAccountNumber(newAccountNumber);
  };

  const handleNavigateToSelfTest = () => {
    router.push('/selftest');
  };

  // Optionally, add a toggle for demo mode in settings
  const handleToggleDemoMode = async () => {
    // This is a placeholder. In Expo, you can set EXPO_PUBLIC_DEMO_MODE in app config or via dev menu.
    Alert.alert('Demo Mode', 'To enable demo mode, set EXPO_PUBLIC_DEMO_MODE=1 in your environment.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Settings</ThemedText>
        </ThemedView>

        <ScrollView style={styles.scrollContainer}>
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Data Management</ThemedText>

            <TouchableOpacity style={[styles.button, styles.dangerButton, isClearing && styles.buttonDisabled]} onPress={handleClearStorage} disabled={isClearing}>
              <ThemedText style={styles.dangerButtonText}>{isClearing ? 'Clearing...' : 'Clear All App Data'}</ThemedText>
            </TouchableOpacity>

            <ThemedText style={styles.warningText}>Warning: This will erase all app data including your wallet. You will need to restore your wallet using your seed phrase.</ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Account Number</ThemedText>
            <ThemedText style={styles.accountText}>Current Account: {accountNumber}</ThemedText>

            <View style={styles.accountSelectorContainer}>
              {[0, 1, 2, 3, 4].map((num) => (
                <TouchableOpacity key={num} style={[styles.accountButton, accountNumber === num && styles.accountButtonActive]} onPress={() => handleAccountChange(num)}>
                  <ThemedText style={[styles.accountButtonText, accountNumber === num && styles.accountButtonTextActive]}>{num}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Developer Options</ThemedText>

            <TouchableOpacity style={[styles.button, styles.selfTestButton]} onPress={handleNavigateToSelfTest} testID="SelfTestButton">
              <ThemedText style={styles.selfTestButtonText}>Self Test</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.selfTestButton]}
              onPress={() => {
                scanQr().then(Alert.alert);
              }}
            >
              <ThemedText style={styles.selfTestButtonText}>ScanQr</ThemedText>
            </TouchableOpacity>

            {/* Demo Mode Toggle - Placeholder */}
            <TouchableOpacity style={[styles.button, styles.demoModeButton]} onPress={handleToggleDemoMode}>
              <ThemedText style={styles.demoModeButtonText}>{isDemoMode() ? 'Disable Demo Mode' : 'Enable Demo Mode'}</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedText style={{ textAlign: 'center' }}>
            {Application.applicationName} v{Application.nativeApplicationVersion} (build {Application.nativeBuildVersion})
          </ThemedText>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  dangerButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  selfTestButton: {
    backgroundColor: '#34C759',
  },
  selfTestButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  demoModeButton: {
    backgroundColor: '#007AFF',
  },
  demoModeButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  warningText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 8,
  },
  backButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    marginTop: 16,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  accountText: {
    fontSize: 16,
    marginBottom: 12,
  },
  accountSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  accountButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  accountButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  accountButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  accountButtonTextActive: {
    color: 'white',
  },
});
