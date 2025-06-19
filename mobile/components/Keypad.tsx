import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface KeypadProps {
  onPress?: (digit: string) => void;
  onKeyPress?: (digit: string) => void;
  keypadOpacity?: Animated.SharedValue<number>;
  keypadY?: Animated.SharedValue<number>;
  isVisible?: Animated.SharedValue<number>;
}

export default function Keypad({ onPress, onKeyPress, keypadOpacity, keypadY, isVisible }: KeypadProps) {
  const defaultOpacity = useSharedValue(1);
  const defaultY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = keypadOpacity?.value ?? isVisible?.value ?? defaultOpacity.value;
    const translateY = keypadY?.value ?? 0;

    return {
      opacity: opacity,
      transform: [{ translateY: translateY }],
    };
  });

  const renderKey = (digit: string) => {
    const handlePress = () => {
      if (onPress) onPress(digit);
      if (onKeyPress) onKeyPress(digit);
    };

    return (
      <TouchableOpacity key={digit} onPress={handlePress} activeOpacity={0.6}>
        <View style={styles.key}>
          <Text style={styles.keyText}>{digit}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.grid}>
        <View style={styles.row}>
          {renderKey('1')}
          {renderKey('2')}
          {renderKey('3')}
        </View>
        <View style={styles.row}>
          {renderKey('4')}
          {renderKey('5')}
          {renderKey('6')}
        </View>
        <View style={styles.row}>
          {renderKey('7')}
          {renderKey('8')}
          {renderKey('9')}
        </View>
        <View style={styles.row}>
          <View style={styles.key} />
          {renderKey('0')}
          <View style={styles.key} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: '15%',
    width: '100%',
    alignItems: 'center',
  },
  grid: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  key: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  keyText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '500',
  },
});
