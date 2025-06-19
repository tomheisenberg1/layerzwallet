import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { BackgroundExecutor } from '@/src/modules/background-executor';
import { ThemedText } from '@/components/ThemedText';
import { isDemoMode, getDemoMnemonic } from '@/src/demo-data';

export default function CreateWalletScreen() {
  const router = useRouter();
  const [recoveryPhrase, setRecoveryPhrase] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        if (isDemoMode()) {
          setRecoveryPhrase(getDemoMnemonic());
        } else {
          const hasMnemonic = await BackgroundExecutor.hasMnemonic();
          if (!hasMnemonic) {
            const response = await BackgroundExecutor.createMnemonic();
            setRecoveryPhrase(response.mnemonic);
          }
        }
      } catch (error) {
        console.error('Error creating wallet:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleContinue = () => {
    router.replace('/onboarding/create-password');
  };

  const words = recoveryPhrase ? recoveryPhrase.split(' ') : [];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title">Create wallet</ThemedText>
      </View>
      <View style={styles.content}>
        <ThemedText>Write down these 12 words in numerical order and keep them in a secure place. Never share them with anyone.</ThemedText>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <ThemedText style={styles.loadingText}>Creating your wallet...</ThemedText>
          </View>
        ) : (
          words.map((word, index) => (
            <ThemedText key={index}>
              {index + 1}. {word}
            </ThemedText>
          ))
        )}
      </View>

      <View style={styles.buttonContainer}>
        {!isLoading && (
          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleContinue}>
            <ThemedText style={styles.buttonText}>Continue</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
