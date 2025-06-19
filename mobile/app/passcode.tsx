import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withDelay, runOnJS, Easing } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import PasscodeDots from '@/components/PasscodeDots';
import Keypad from '@/components/Keypad';

const { height } = Dimensions.get('window');
const PASSCODE_LENGTH = 4;

export default function PasscodeScreen() {
  const [digits, setDigits] = useState<number[]>([]);
  const router = useRouter();

  // Animation values
  const progress = useSharedValue<number[]>([]);
  const keypadOpacity = useSharedValue(1);
  const keypadY = useSharedValue(0);
  const blurOpacity = useSharedValue(1);

  // Animated styles
  const blurStyle = useAnimatedStyle(() => ({
    opacity: blurOpacity.value,
  }));

  const blurViewStyle = useAnimatedStyle(() => ({
    // BlurView intensity cannot be animated directly, so we use opacity overlay
    opacity: blurOpacity.value,
  }));

  useEffect(() => {
    progress.value = digits;

    if (digits.length === PASSCODE_LENGTH) {
      // Animate dots completion
      setTimeout(() => {
        // All dots enlarge then shrink and fade
        // Keypad slides down and fades
        keypadOpacity.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) });
        keypadY.value = withTiming(height * 0.6, { duration: 400, easing: Easing.out(Easing.cubic) });

        // Blur removal
        blurOpacity.value = withTiming(
          0,
          {
            duration: 600,
            easing: Easing.out(Easing.cubic),
          },
          () => {
            runOnJS(router.replace)('/');
          }
        );
      }, 200);
    }
  }, [digits, progress, keypadOpacity, keypadY, blurOpacity, router.replace]);

  const handleKeyPress = (digit: string) => {
    if (digits.length < PASSCODE_LENGTH) {
      setDigits((prev) => [...prev, parseInt(digit)]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Dashboard preview beneath blur */}
      <DashboardPreview />

      {/* Blur overlay with dark tint */}
      <Animated.View style={[StyleSheet.absoluteFill, blurStyle]}>
        <BlurView intensity={30} style={StyleSheet.absoluteFill} />
        <View style={styles.darkOverlay} />
      </Animated.View>

      {/* Passcode dots */}
      <View style={styles.dotsContainer}>
        <PasscodeDots progress={progress} />
      </View>

      {/* Numeric keypad */}
      <Keypad onPress={handleKeyPress} keypadOpacity={keypadOpacity} keypadY={keypadY} />
    </SafeAreaView>
  );
}

// Dashboard preview component that shows beneath the blur
function DashboardPreview() {
  return (
    <View style={styles.dashboardPreview}>
      <View style={styles.previewHeader}>
        <View style={styles.previewTitle} />
        <View style={styles.previewAvatar} />
      </View>
      <View style={styles.previewGrid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={[styles.previewTile]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  dotsContainer: {
    position: 'absolute',
    top: '25%',
    width: '100%',
    alignItems: 'center',
  },
  dashboardPreview: {
    flex: 1,
    padding: 20,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 60,
  },
  previewTitle: {
    width: 180,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  previewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  previewTile: {
    width: (Dimensions.get('window').width - 64) / 2,
    height: ((Dimensions.get('window').width - 64) / 2) * 0.6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    marginBottom: 16,
    opacity: 0.3,
  },
});
