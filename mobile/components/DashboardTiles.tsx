import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, Image, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withSpring, interpolate, Extrapolate } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32; // Full width with padding
const CARD_HEIGHT = 160;
const STACK_OVERLAP = 120; // How much each card overlaps, adjusted so names are visible

interface CryptoCard {
  name: string;
  ticker: string;
  balance: string;
  usdValue: string;
  color: string;
  icon?: any;
  tags?: string[];
}

interface DashboardTileProps {
  card: CryptoCard;
  index: number;
  totalCards: number;
  gestureY: Animated.SharedValue<number>;
}

function CryptoCardTile({ card, index, totalCards, gestureY }: DashboardTileProps) {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const entryTranslateY = useSharedValue(50); // Animate from 50 to 0

  const animatedStyle = useAnimatedStyle(() => {
    const lastIndex = totalCards - 1;
    const topCardRestingY = lastIndex * STACK_OVERLAP;

    // The top card's Y position is its resting position plus the gesture translation.
    const topCardFinalY = topCardRestingY + gestureY.value;

    // For other cards, we calculate their offset from the top card.
    const offsetFromTop = index - lastIndex; // e.g., -1, -2, etc.

    // Define how the offset changes based on the gesture
    const restingRelativeOffset = offsetFromTop * STACK_OVERLAP; // e.g., -90
    const pulledUpRelativeOffset = offsetFromTop * 20; // e.g., -20 (closer)
    const pulledDownRelativeOffset = offsetFromTop * (STACK_OVERLAP + 30); // e.g., -1 * 120 = -120 (further)

    // Lag for lower cards
    const pullDownInputRange = 200 + (lastIndex - index) * 80;

    const interpolatedRelativeOffset = interpolate(gestureY.value, [-100, 0, pullDownInputRange], [pulledUpRelativeOffset, restingRelativeOffset, pulledDownRelativeOffset], Extrapolate.CLAMP);

    // The final Y for any card is the top card's position plus its own interpolated offset from the top.
    // For the top card itself, offsetFromTop is 0, so interpolatedRelativeOffset is 0.
    const finalY = topCardFinalY + interpolatedRelativeOffset;

    return {
      position: 'absolute',
      width: '100%',
      transform: [{ translateY: entryTranslateY.value + finalY }],
      opacity: opacity.value,
      zIndex: index, // Stacking order: last card is on top
    };
  });

  useEffect(() => {
    // Staggered appearance animation, from bottom of stack to top
    const delay = index * 150;

    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    entryTranslateY.value = withDelay(delay, withSpring(0, { damping: 15, stiffness: 100 }));
  }, [index, totalCards, opacity, entryTranslateY]);

  const handlePress = () => {
    router.push({
      pathname: '/AssetDetail',
      params: { ...card },
    });
  };

  return (
    <Animated.View style={[styles.card, { backgroundColor: card.color }, animatedStyle]}>
      <TouchableOpacity onPress={handlePress} style={styles.touchableCard}>
        <View>
          <View style={styles.topRow}>
            <View style={styles.cardHeader}>
              {card.icon ? (
                <Image source={card.icon} style={styles.cardIcon} />
              ) : (
                <View style={[styles.cardIconPlaceholder, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>{card.ticker.charAt(0)}</Text>
                </View>
              )}
            </View>
            <View style={styles.tagsContainer}>
              {card.tags &&
                card.tags.map((tag, i) => (
                  <View key={i} style={styles.tagBadge}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
            </View>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.cardName}>{card.name}</Text>
            <View style={styles.cardBalanceContainer}>
              <Text style={styles.cardBalance}>
                {card.balance} {card.ticker}
              </Text>
              <Text style={styles.cardUsdValue}>{card.usdValue} USD</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function DashboardTiles() {
  // Mock data based on screenshot
  const cards: CryptoCard[] = [
    {
      name: 'Base (BTC)',
      ticker: 'BTC',
      balance: '1.01762',
      usdValue: '94,680.61',
      color: '#001689', // Deep blue from screenshot
      tags: [],
    },
    {
      name: 'Rootstock',
      ticker: 'RBTC',
      balance: '1.01762',
      usdValue: '94,680.61',
      color: '#00733B', // Green color from screenshot
      tags: ['Tether RSK', 'RIF', 'DOC', '+2'],
    },
    {
      name: 'Botanix',
      ticker: 'BTC',
      balance: '1.01762',
      usdValue: '94,680.61',
      color: '#98390B', // Orange/brown from screenshot
      tags: ['USDC.btx', 'BTC.btx'],
    },
    {
      name: 'Strata',
      ticker: 'BTC',
      balance: '1.01762',
      usdValue: '94,680.61',
      color: '#59006E', // Purple from screenshot
      tags: ['zkBTC'],
    },
  ];

  const gestureY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Remove clamping to allow for a 'stretchy' feel at the boundaries.
      // The interpolation's extrapolate property will handle clamping the visual output.
      gestureY.value = event.translationY;
    })
    .onEnd(() => {
      gestureY.value = withTiming(0);
    });

  const containerHeight = CARD_HEIGHT + (cards.length - 1) * STACK_OVERLAP;

  return (
    <View style={styles.container}>
      <View style={styles.addLayerContainer}>
        <View style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </View>
        <Text style={styles.addLayerText}>Add Layer</Text>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cardsContainer, { height: containerHeight }]}>
          {cards.map((card, index) => (
            <CryptoCardTile key={card.name} card={card} index={index} totalCards={cards.length} gestureY={gestureY} />
          ))}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end', // Pin content to the bottom
    paddingBottom: 40, // Add some padding from the absolute bottom
  },
  addLayerContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
    lineHeight: 34,
  },
  addLayerText: {
    color: 'white',
    marginTop: 8,
    fontSize: 16,
  },
  cardsContainer: {
    width: CARD_WIDTH,
    position: 'relative',
  },
  card: {
    height: CARD_HEIGHT,
    backgroundColor: '#001689', // Default blue
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  touchableCard: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  cardIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardBalanceContainer: {
    alignItems: 'flex-end',
  },
  cardBalance: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardUsdValue: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  tagBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 6,
    marginTop: 6,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
  },
});
