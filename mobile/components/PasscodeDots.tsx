import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';

interface PasscodeDotsProps {
  progress: Animated.SharedValue<number[]>; // array of filled indexes
}

export default function PasscodeDots({ progress }: PasscodeDotsProps) {
  // Four dots unrolled to satisfy hook rules
  const style0 = useAnimatedStyle(() => {
    const filled = progress.value.includes(0);
    return {
      opacity: filled ? withTiming(1) : withTiming(0.3),
      transform: [{ scale: filled ? withSpring(1.3) : withTiming(1) }],
    };
  });

  const style1 = useAnimatedStyle(() => {
    const filled = progress.value.includes(1);
    return {
      opacity: filled ? withTiming(1) : withTiming(0.3),
      transform: [{ scale: filled ? withSpring(1.3) : withTiming(1) }],
    };
  });

  const style2 = useAnimatedStyle(() => {
    const filled = progress.value.includes(2);
    return {
      opacity: filled ? withTiming(1) : withTiming(0.3),
      transform: [{ scale: filled ? withSpring(1.3) : withTiming(1) }],
    };
  });

  const style3 = useAnimatedStyle(() => {
    const filled = progress.value.includes(3);
    return {
      opacity: filled ? withTiming(1) : withTiming(0.3),
      transform: [{ scale: filled ? withSpring(1.3) : withTiming(1) }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, style0]} />
      <Animated.View style={[styles.dot, style1]} />
      <Animated.View style={[styles.dot, style2]} />
      <Animated.View style={[styles.dot, style3]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginHorizontal: 6,
  },
});
