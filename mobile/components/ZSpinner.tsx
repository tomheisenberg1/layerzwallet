import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
  withSequence,
  interpolate,
  withSpring, // Import withSpring
} from 'react-native-reanimated';
import { DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const finalTopZ =
  'M132.264 135.902H30.9923C22.4988 135.902 18.2065 126.088 24.1376 120.27L85.9462 59.6141C91.9814 53.6959 100.241 50.3622 108.864 50.3622H210.136C218.629 50.3622 222.921 60.1759 216.99 65.9942L155.182 126.65C149.147 132.568 140.887 135.902 132.264 135.902Z';

const finalBottomZ =
  'M122.31 89.0017H223.582C232.075 89.0017 236.368 98.8155 230.436 104.634L168.628 165.289C162.593 171.207 154.333 174.541 145.71 174.541H44.4384C35.9449 174.541 31.6526 164.727 37.5838 158.909L99.3923 98.2536C105.428 92.3354 113.687 89.0017 122.31 89.0017Z';

// Define target stacked positions
const STACKED_TRANSLATE_Y_TOP = -7;
const STACKED_TRANSLATE_Y_BOTTOM = 7;

// Define separation animation parameters
const INITIAL_SEPARATION_Y_TOP = -40;
const INITIAL_SEPARATION_Y_BOTTOM = 40;
const INITIAL_ROTATION_Z_TOP = -15;
const INITIAL_ROTATION_Z_BOTTOM = 15;

const INITIAL_SCALE = 0.8; // Start zoomed out

const GYROSCOPE_SENSITIVITY = 15;

export default function ZSpinner() {
  const morphProgress = useSharedValue(0);
  const gyroscopeRotationX = useSharedValue(0);
  const gyroscopeRotationY = useSharedValue(0);
  const [isGyroscopeAvailable, setIsGyroscopeAvailable] = useState(false);

  useEffect(() => {
    morphProgress.value = withSequence(
      withTiming(0, { duration: 100 }),
      withSpring(1, {
        stiffness: 40,
        damping: 7, // Lower damping significantly for a more pronounced bounce
        mass: 1,
      })
    );

    let subscription: { remove: () => void } | null = null;

    const checkGyroscope = async () => {
      const available = await DeviceMotion.isAvailableAsync();
      setIsGyroscopeAvailable(available);
      if (available) {
        DeviceMotion.setUpdateInterval(100);
        subscription = DeviceMotion.addListener((motionData: DeviceMotionMeasurement) => {
          if (motionData && motionData.rotation) {
            let rotX = (motionData.rotation.beta ?? 0) * (180 / Math.PI);
            let rotY = (motionData.rotation.gamma ?? 0) * (180 / Math.PI);

            gyroscopeRotationX.value = interpolate(rotX, [-90, 90], [-GYROSCOPE_SENSITIVITY, GYROSCOPE_SENSITIVITY], 'clamp');
            gyroscopeRotationY.value = interpolate(rotY, [-90, 90], [-GYROSCOPE_SENSITIVITY, GYROSCOPE_SENSITIVITY], 'clamp');
          }
        });
      }
    };

    checkGyroscope();

    return () => {
      subscription?.remove();
    };
  }, []);

  const topPathProps = useAnimatedProps(() => {
    return {
      d: finalTopZ, // Always use finalTopZ
      fill: 'white',
      opacity: 1, // Always opaque
    };
  });

  const bottomPathProps = useAnimatedProps(() => {
    return {
      d: finalBottomZ, // Always use finalBottomZ
      fill: 'white',
      opacity: 1, // Always opaque
    };
  });

  const topLayerStyle = useAnimatedStyle(() => {
    const progress = morphProgress.value;

    // Base translation towards final stacked position
    const baseTranslateY = interpolate(progress, [0, 1], [0, STACKED_TRANSLATE_Y_TOP]);

    // Dynamic separation effect: starts at INITIAL, then reduces to 0 for stacking
    const separationTranslateY = interpolate(
      progress,
      [0, 1], // Animate directly from initial separation to no separation
      [INITIAL_SEPARATION_Y_TOP, 0]
    );
    const separationRotateZ = interpolate(
      progress,
      [0, 1], // Animate directly from initial rotation to no rotation
      [INITIAL_ROTATION_Z_TOP, 0]
    );
    const scale = interpolate(progress, [0, 1], [INITIAL_SCALE, 1]); // Zoom in

    return {
      transform: [
        { translateY: baseTranslateY + separationTranslateY },
        { rotateZ: `${separationRotateZ}deg` },
        { rotateX: `${gyroscopeRotationX.value}deg` },
        { rotateY: `${gyroscopeRotationY.value}deg` },
        { scale: scale },
      ],
    };
  });

  const bottomLayerStyle = useAnimatedStyle(() => {
    const progress = morphProgress.value;

    const baseTranslateY = interpolate(progress, [0, 1], [0, STACKED_TRANSLATE_Y_BOTTOM]);

    const separationTranslateY = interpolate(
      progress,
      [0, 1], // Animate directly from initial separation to no separation
      [INITIAL_SEPARATION_Y_BOTTOM, 0]
    );
    const separationRotateZ = interpolate(
      progress,
      [0, 1], // Animate directly from initial rotation to no rotation
      [INITIAL_ROTATION_Z_BOTTOM, 0]
    );
    const scale = interpolate(progress, [0, 1], [INITIAL_SCALE, 1]); // Zoom in

    return {
      transform: [
        { translateY: baseTranslateY + separationTranslateY },
        { rotateZ: `${separationRotateZ}deg` },
        { rotateX: `${gyroscopeRotationX.value}deg` },
        { rotateY: `${gyroscopeRotationY.value}deg` },
        { scale: scale },
      ],
    };
  });

  return (
    <View style={styles.container}>
      {/* Top Z layer */}
      <Animated.View style={[{ position: 'absolute' }, topLayerStyle]}>
        <Svg width={255} height={225} viewBox="0 0 255 225">
          <AnimatedPath animatedProps={topPathProps} />
        </Svg>
      </Animated.View>

      {/* Bottom Z layer */}
      <Animated.View style={[{ position: 'absolute' }, bottomLayerStyle]}>
        <Svg width={255} height={225} viewBox="0 0 255 225">
          <AnimatedPath animatedProps={bottomPathProps} />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
