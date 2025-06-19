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
import { isDemoMode } from '@/src/demo-data';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, interpolate, Extrapolate, runOnJS } from 'react-native-reanimated';

// Session storage key for tracking authentication
const SESSION_AUTHENTICATED_KEY = 'session_authenticated';

export default function UnlockScreen() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [spinnerVisible, setSpinnerVisible] = useState(true);
  const [error, setError] = useState('');
  const [showDemoSpinner, setShowDemoSpinner] = useState(false);
  const router = useRouter();

  const backgroundColor = useThemeColor({ light: '#fff', dark: '#000' }, 'background');
  const textColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');
  const tintColor = useThemeColor({ light: '#2f95dc', dark: '#fff' }, 'tint');

  const spinnerScale = useSharedValue(1);
  const spinnerOpacity = useSharedValue(1);
  const unlockOpacity = useSharedValue(0);
  const unlockScale = useSharedValue(0.95);

  useEffect(() => {
    // Show password input after spinner animation (approximately 4 seconds)
    const timer = setTimeout(() => {
      // Animate spinner out and unlock in with a smoother, more natural transition
      spinnerScale.value = withTiming(1.25, { duration: 350 });
      spinnerOpacity.value = withTiming(0, { duration: 350 });
      unlockOpacity.value = withDelay(150, withTiming(1, { duration: 500 }));
      unlockScale.value = withDelay(150, withTiming(1, { duration: 500 }));
      setTimeout(() => {
        setSpinnerVisible(false);
        setShowPasswordInput(true);
      }, 500);
    }, 4000);

    return () => clearTimeout(timer);
  }, [spinnerScale, spinnerOpacity, unlockOpacity, unlockScale]);

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (error) setError('');
  };

  const handleUnlock = async () => {
    console.log('handleUnlock called, isDemoMode:', isDemoMode());

    if (isDemoMode()) {
      // Instantly unlock in demo mode, no password required
      setShowDemoSpinner(true);
      await LayerzStorage.setItem(SESSION_AUTHENTICATED_KEY, 'true');
      setTimeout(() => {
        router.replace('/');
      }, 2000); // Show spinner for 2 seconds before navigating
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Getting encrypted mnemonic...');
      // Get encrypted mnemonic from storage
      const encryptedMnemonic = await SecureStorage.getItem(STORAGE_KEY_MNEMONIC);

      if (!encryptedMnemonic) {
        throw new Error('No mnemonic found');
      }

      if (!encryptedMnemonic.startsWith(ENCRYPTED_PREFIX)) {
        throw new Error('Mnemonic not encrypted');
      }

      console.log('Decrypting mnemonic...');
      // Decrypt the mnemonic to verify password
      const deviceId = await getDeviceID(SecureStorage, Csprng);
      await decrypt(encryptedMnemonic.replace(ENCRYPTED_PREFIX, ''), password, deviceId);

      console.log('Password verified, setting session auth...');
      // Success - mark as authenticated and navigate to main app
      // Ensure storage is updated before navigation
      try {
        await LayerzStorage.setItem(SESSION_AUTHENTICATED_KEY, 'true');
        console.log('Session auth set, navigating to dashboard...');
        // Add a small delay to ensure storage is fully committed
        setTimeout(() => {
          router.replace('/');
        }, 300);
      } catch (storageError) {
        console.error('Error setting session auth:', storageError);
        setError('Authentication error. Please try again.');
        setIsLoading(false);
      }
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

  const spinnerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: spinnerScale.value }],
    opacity: spinnerOpacity.value,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    pointerEvents: spinnerOpacity.value === 0 ? 'none' : 'auto',
  }));
  const unlockAnimatedStyle = useAnimatedStyle(() => ({
    opacity: unlockOpacity.value,
    transform: [{ scale: unlockScale.value }],
    zIndex: 1,
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style="light" backgroundColor="black" />
      <Animated.View style={spinnerAnimatedStyle}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ZSpinner />
        </View>
      </Animated.View>
      {showDemoSpinner ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ZSpinner />
        </View>
      ) : (
        <Animated.View style={[{ flex: 1 }, unlockAnimatedStyle]}>
          {showPasswordInput && (
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
        </Animated.View>
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
