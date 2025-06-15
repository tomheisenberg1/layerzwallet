import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import ZSpinner from '@/components/ZSpinner';
import { useThemeColor } from '@/hooks/useThemeColor';
import { decrypt } from '@/src/modules/encryption';
import { SecureStorage } from '@/src/class/secure-storage';
import { getDeviceID } from '@shared/modules/device-id';
import { Csprng } from '@/src/class/rng';
import { ENCRYPTED_PREFIX, STORAGE_KEY_MNEMONIC } from '@shared/types/IStorage';
import { LayerzStorage } from '@/src/class/layerz-storage';

// Session storage key for tracking authentication
const SESSION_AUTHENTICATED_KEY = 'session_authenticated';

export default function UnlockScreen() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const backgroundColor = useThemeColor({ light: '#fff', dark: '#000' }, 'background');
  const textColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');
  const tintColor = useThemeColor({ light: '#2f95dc', dark: '#fff' }, 'tint');

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (error) setError('');
  };

  const handleUnlock = async () => {
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Get encrypted mnemonic from storage
      const encryptedMnemonic = await SecureStorage.getItem(STORAGE_KEY_MNEMONIC);

      if (!encryptedMnemonic) {
        throw new Error('No mnemonic found');
      }

      if (!encryptedMnemonic.startsWith(ENCRYPTED_PREFIX)) {
        throw new Error('Mnemonic not encrypted');
      }

      // Decrypt the mnemonic to verify password
      const deviceId = await getDeviceID(SecureStorage, Csprng);
      await decrypt(encryptedMnemonic.replace(ENCRYPTED_PREFIX, ''), password, deviceId);

      // Success - mark as authenticated and navigate to main app
      await LayerzStorage.setItem(SESSION_AUTHENTICATED_KEY, 'true');
      router.replace('/');
    } catch (decryptError: any) {
      console.error('Unlock failed:', decryptError);
      setError('Incorrect password. Please try again.');
      setIsLoading(false);
    }
  };

  const handleKeyPress = ({ nativeEvent }: any) => {
    if (nativeEvent.key === 'Enter') {
      handleUnlock();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style="light" backgroundColor="black" />

      {!showPasswordInput ? (
        <ZSpinner />
      ) : (
        <View style={styles.unlockContainer}>
          <Text style={[styles.title, { color: textColor }]}>Welcome Back</Text>

          <Text style={[styles.subtitle, { color: '#888' }]}>Enter your password to unlock your wallet</Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TextInput
            style={[styles.input, { color: textColor, borderColor: tintColor }]}
            secureTextEntry
            placeholder="Enter your password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={handlePasswordChange}
            onKeyPress={handleKeyPress}
            autoFocus
            editable={!isLoading}
          />

          <Pressable style={[styles.unlockButton, { backgroundColor: tintColor }, isLoading && styles.buttonDisabled]} onPress={handleUnlock} disabled={isLoading}>
            {isLoading ? <ActivityIndicator size="small" color="white" /> : <Text style={styles.unlockButtonText}>Unlock Wallet</Text>}
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  unlockContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  errorContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 56,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  unlockButton: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
