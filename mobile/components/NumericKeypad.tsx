import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface NumericKeypadProps {
  onPress: (digit: string) => void;
  keypadOpacity: Animated.SharedValue<number>;
  keypadY: Animated.SharedValue<number>;
}

export default function NumericKeypad({ onPress, keypadOpacity, keypadY }: NumericKeypadProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: keypadOpacity.value,
    transform: [{ translateY: keypadY.value }],
  }));

  const handlePress = (digit: string) => {
    Haptics.selectionAsync();
    onPress(digit);
  };

  const renderKey = (digit: string) => (
    <TouchableOpacity key={digit} style={styles.key} onPress={() => handlePress(digit)} activeOpacity={0.6}>
      <Text style={styles.keyText}>{digit}</Text>
    </TouchableOpacity>
  );

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.grid}>
        {['1', '2', '3'].map(renderKey)}
        {['4', '5', '6'].map(renderKey)}
        {['7', '8', '9'].map(renderKey)}
        <View style={styles.emptyKey} />
        {renderKey('0')}
        <View style={styles.emptyKey} />
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: width * 0.8,
  },
  key: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  emptyKey: {
    width: 64,
    height: 64,
    margin: 8,
  },
  keyText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
