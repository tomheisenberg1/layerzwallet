import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withDelay, runOnJS, Easing } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import PasscodeDots from '@/components/PasscodeDots';
import Keypad from '@/components/Keypad';
import DashboardTiles from '@/components/DashboardTiles';

const { height } = Dimensions.get('window');
const PASSCODE_LENGTH = 4;

export default function PasscodeScreen() {
  const [digits, setDigits] = useState<number[]>([]);
  const router = useRouter();

  // Animation values
  const progress = useSharedValue<number[]>([]);
  const keypadVisible = useSharedValue(1);
  const blurOpacity = useSharedValue(1);
  const dotsVisible = useSharedValue(1);

  // Animated styles
  const blurStyle = useAnimatedStyle(() => ({
    opacity: blurOpacity.value,
  }));

  const dotsStyle = useAnimatedStyle(() => ({
    opacity: dotsVisible.value,
    transform: [{ scale: dotsVisible.value }],
  }));

  useEffect(() => {
    // Update progress for dots animation
    progress.value = [...digits];

    if (digits.length === PASSCODE_LENGTH) {
      // All dots enlarge then shrink and fade
      dotsVisible.value = withSequence(withTiming(1.3, { duration: 200 }), withTiming(0, { duration: 300 }));

      // Keypad slides down and fades out
      keypadVisible.value = withTiming(0, {
        duration: 400,
        easing: Easing.in(Easing.cubic),
      });

      // Blur removal with delay
      blurOpacity.value = withDelay(
        200,
        withTiming(
          0,
          {
            duration: 600,
            easing: Easing.out(Easing.cubic),
          },
          () => {
            runOnJS(router.replace)('/');
          }
        )
      );
    }
  }, [digits, progress, dotsVisible, keypadVisible, blurOpacity, router]);

  const handleKeyPress = (digit: string) => {
    if (digits.length < PASSCODE_LENGTH) {
      setDigits((prev) => [...prev, parseInt(digit)]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Dashboard Preview */}
      <View style={styles.background}>
        <DashboardTiles />
      </View>

      {/* Blur Overlay */}
      <Animated.View style={[StyleSheet.absoluteFill, blurStyle]}>
        <BlurView intensity={30} style={StyleSheet.absoluteFill} tint="dark" />
        <View style={styles.overlay} />
      </Animated.View>

      {/* Passcode Interface */}
      <View style={styles.passcodeContainer}>
        <Animated.View style={[styles.dotsContainer, dotsStyle]}>
          <PasscodeDots progress={progress} />
        </Animated.View>

        <Keypad onPress={handleKeyPress} isVisible={keypadVisible} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  passcodeContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    top: '35%',
    width: '100%',
    alignItems: 'center',
  },
});
