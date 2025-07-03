import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnUI, runOnJS, interpolate, useAnimatedScrollHandler, useAnimatedReaction } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = 200;
const FOCUSED_SCALE = 1.0;
const UNFOCUSED_SCALE = 0.8;
const ZOOM_SCALE = 2.5;
const CARD_SPACING = -80;
const SCROLL_SNAP_THRESHOLD = CARD_HEIGHT + CARD_SPACING;

interface LayerCard {
  name: string;
  ticker: string;
  balance: string;
  usdValue: string;
  color: string;
  icon?: any;
  tags?: string[];
  tokenCount?: number;
  originalIndex?: number;
}

interface DashboardTileProps {
  card: LayerCard;
  index: number;
  cardPosition: number;
  scrollY: Animated.SharedValue<number>;
  selectedIndex: number;
  onCardPress: (index: number) => void;
  totalCards: number;
  disableNavigation?: boolean;
}

interface LayerCardTileProps extends DashboardTileProps {
  transitionId: string;
}

function LayerCardTile({ card, index, cardPosition, scrollY, selectedIndex, onCardPress, transitionId, totalCards, disableNavigation = false }: LayerCardTileProps) {
  const router = useRouter();
  const { returnProgress } = useLocalSearchParams();

  const scale = useSharedValue(UNFOCUSED_SCALE);
  const opacity = useSharedValue(0.6);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const rotateXVal = useSharedValue(0);
  const rotateYVal = useSharedValue(0);
  const wasPressed = useSharedValue(false);
  const isSelected = useSharedValue(false);
  const originalCardPosition = useSharedValue(0);

  useEffect(() => {
    if (selectedIndex >= 0 && selectedIndex !== index) {
      const slideDirection = index < selectedIndex ? -1 : 1;
      const slideDistance = slideDirection * 400;

      translateY.value = withTiming(slideDistance, {
        duration: 250,
      });
      opacity.value = withTiming(0, {
        duration: 250,
      });
    } else if (selectedIndex < 0) {
      if (!wasPressed.value) {
        translateY.value = withSpring(0, {
          damping: 25,
          stiffness: 300,
          mass: 0.6,
        });
      }
    }
  }, [selectedIndex, index, translateY, opacity, wasPressed]);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    if (isSelected.value) {
      return { transform: [{ translateY: translateY.value }, { scale: scale.value }, { perspective: 1000 }], opacity: opacity.value, elevation: 50, zIndex: 500 };
    }

    if (selectedIndex >= 0 && selectedIndex !== index) {
      return { transform: [{ translateY: translateY.value }, { translateX: translateX.value }, { scale: scale.value }, { perspective: 1000 }], opacity: opacity.value, elevation: 0, zIndex: 0 };
    }

    try {
      const centerY = height / 2 - CARD_HEIGHT / 2;
      const currentCardY = cardPosition - scrollY.value + centerY;
      const rawDistanceFromCenter = Math.abs(currentCardY - centerY);

      if (!isFinite(rawDistanceFromCenter) || rawDistanceFromCenter < 0 || rawDistanceFromCenter > height * 2) {
        return {
          transform: [{ translateY: 0 }, { translateX: 0 }, { scale: UNFOCUSED_SCALE }, { rotateZ: '0deg' }, { perspective: 1000 }],
          opacity: 0.5,
          elevation: 5,
          zIndex: 10,
          borderWidth: 0,
          borderColor: 'transparent',
        };
      }

      const distanceFromCenter = Math.max(0, Math.min(height, rawDistanceFromCenter));

      const scaleThreshold = SCROLL_SNAP_THRESHOLD * 0.8;
      const currentScale = interpolate(distanceFromCenter, [0, scaleThreshold], [FOCUSED_SCALE, UNFOCUSED_SCALE], 'clamp');

      const isFocused = distanceFromCenter < scaleThreshold;

      const maxVisibleDistance = SCROLL_SNAP_THRESHOLD * 2.0;
      const focusThreshold = SCROLL_SNAP_THRESHOLD * 0.9;

      const opacityThreshold = SCROLL_SNAP_THRESHOLD * 0.8;
      const currentOpacity = interpolate(distanceFromCenter, [0, opacityThreshold, maxVisibleDistance], [1.0, 0.8, 0.0], 'clamp');

      const zIndexThreshold = SCROLL_SNAP_THRESHOLD * 0.8;
      let cardZIndex: number;
      let cardElevation: number;
      const screenCenter = height / 2;
      const cardCenterY = currentCardY;
      const isAboveCenter = cardCenterY < screenCenter;

      if (isAboveCenter) {
        cardZIndex = interpolate(distanceFromCenter, [0, zIndexThreshold], [2000, 800], 'clamp');
        cardElevation = interpolate(distanceFromCenter, [0, zIndexThreshold], [50, 25], 'clamp');
      } else {
        cardZIndex = interpolate(distanceFromCenter, [0, zIndexThreshold], [2000, 10], 'clamp');
        cardElevation = interpolate(distanceFromCenter, [0, zIndexThreshold], [50, 5], 'clamp');
      }

      const focusedOffset = interpolate(distanceFromCenter, [0, scaleThreshold], [-3, 0], 'clamp');
      let stackingOffset = 0;
      if (isAboveCenter) {
        stackingOffset = interpolate(distanceFromCenter, [0, scaleThreshold], [0, -5], 'clamp');
      } else {
        stackingOffset = interpolate(distanceFromCenter, [0, scaleThreshold * 1.5], [0, 150], 'clamp');
      }

      const offsetFromCenter = cardCenterY - screenCenter;

      const safeOffsetFromCenter = isNaN(offsetFromCenter) ? 0 : offsetFromCenter;
      const rotationAngle = 0;

      const borderThreshold = SCROLL_SNAP_THRESHOLD * 0.5;
      const borderWidth = interpolate(distanceFromCenter, [0, borderThreshold], [2, 0], 'clamp');
      const borderOpacity = interpolate(distanceFromCenter, [0, borderThreshold], [0.8, 0], 'clamp');

      const safeBorderOpacity = Math.max(0, Math.min(1, isNaN(borderOpacity) ? 0 : borderOpacity));
      const borderColor = `rgba(255, 255, 255, ${safeBorderOpacity.toFixed(3)})`;

      const safeRotationAngle = 0;
      const safeCurrentScale = isNaN(currentScale) ? 1 : currentScale;
      const safeCurrentOpacity = Math.max(0, Math.min(1, isNaN(currentOpacity) ? 1 : currentOpacity));
      const safeBorderWidth = Math.max(0, isNaN(borderWidth) ? 0 : borderWidth);
      const safeCardElevation = Math.max(0, isNaN(cardElevation) ? 0 : cardElevation);
      const safeCardZIndex = isNaN(cardZIndex) ? 0 : Math.round(cardZIndex);

      return {
        transform: [{ translateY: translateY.value + focusedOffset + stackingOffset }, { translateX: translateX.value }, { scale: safeCurrentScale }, { rotateZ: '0deg' }, { perspective: 1000 }],
        opacity: safeCurrentOpacity,
        elevation: safeCardElevation,
        zIndex: safeCardZIndex,
        borderWidth: safeBorderWidth,
        borderColor,
      };
    } catch (error) {
      console.warn('Animation calculation error:', error);
      return {
        transform: [{ translateY: 0 }, { translateX: 0 }, { scale: UNFOCUSED_SCALE }, { rotateZ: '0deg' }, { perspective: 1000 }],
        opacity: 0.5,
        elevation: 5,
        zIndex: 10,
        borderWidth: 0,
        borderColor: 'transparent',
      };
    }
  }, [selectedIndex, scrollY]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    const actualIndex = card.originalIndex !== undefined ? card.originalIndex : index;

    onCardPress(actualIndex);

    if (disableNavigation) {
      return;
    }

    originalCardPosition.value = cardPosition - scrollY.value;

    wasPressed.value = true;
    isSelected.value = true;

    const navigatePush = () => {
      router.push({
        pathname: '/home' as any,
        params: {
          name: card.name,
          balance: card.balance,
          ticker: card.ticker,
          usdValue: card.usdValue,
          color: card.color,
          tags: JSON.stringify(card.tags || []),
          tokenCount: card.tokenCount?.toString() || '0',
          transitionId: `card-${card.name}-${index}`,
          returnPosition: JSON.stringify({
            cardIndex: index,
            originalPosition: { translateY: 0, scale: FOCUSED_SCALE },
          }),
        },
      });
    };
    translateY.value = withTiming(-originalCardPosition.value, { duration: 300 });
    scale.value = withTiming(ZOOM_SCALE, { duration: 300 }, (finished) => {
      if (finished) runOnJS(navigatePush)();
    });
  };

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    rotateXVal.value = withTiming(-10, { duration: 150 });
    rotateYVal.value = withTiming(10, { duration: 150 });
  };
  const handlePressOut = () => {
    rotateXVal.value = withTiming(0, { duration: 150 });
    rotateYVal.value = withTiming(0, { duration: 150 });
  };

  useEffect(() => {
    if (returnProgress != null) {
      const p = parseFloat(returnProgress as string);
      runOnUI(() => {
        'worklet';
        const headerTargetPosition = 100;
        const origPos = originalCardPosition.value;
        const deltaY = headerTargetPosition - origPos;
        translateY.value = withTiming(deltaY * (1 - p), { duration: 0 });
        scale.value = 1 + (FOCUSED_SCALE - 1) * (1 - p);
        rotateXVal.value = -15 * (1 - p);
        rotateYVal.value = 15 * (1 - p);
      })();
    }
  }, [returnProgress, originalCardPosition, translateY, scale, rotateXVal, rotateYVal]);

  useFocusEffect(
    useCallback(() => {
      if (wasPressed.value && isSelected.value) {
        const headerPosition = 100;
        const returnDeltaY = originalCardPosition.value - headerPosition;

        translateY.value = -returnDeltaY;
        scale.value = 1.2;
        opacity.value = 1;

        translateY.value = withTiming(0, {
          duration: 300,
        });
        scale.value = withTiming(FOCUSED_SCALE, {
          duration: 300,
        });
        rotateXVal.value = withTiming(0, { duration: 300 });
        rotateYVal.value = withTiming(0, { duration: 300 });

        setTimeout(() => {
          wasPressed.value = false;
          isSelected.value = false;
        }, 300);
      }
    }, [scale, translateY, opacity, wasPressed, isSelected, originalCardPosition, rotateXVal, rotateYVal])
  );

  return (
    <Animated.View sharedTransitionTag={transitionId} style={[styles.card, { backgroundColor: card.color }, animatedStyle]}>
      <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handlePress} style={styles.touchableCard} activeOpacity={0.9} testID={`network-card-${card.name.toLowerCase()}`}>
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
            {card.tokenCount && card.tokenCount > 0 ? (
              <View style={styles.tagBadge}>
                <Text style={styles.tagText}>
                  {card.tokenCount} Token{card.tokenCount > 1 ? 's' : ''}
                </Text>
              </View>
            ) : (
              card.tags &&
              card.tags.map((tag: string, i: number) => (
                <View key={i} style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.cardName}>{card.name}</Text>
          <View style={styles.cardBalanceContainer}>
            <Text style={styles.cardBalance}>
              {card.balance || '0'} {card.ticker}
            </Text>
            <Text style={styles.cardUsdValue}>{card.usdValue || '0.00'} USD</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const cards: LayerCard[] = [
  {
    name: 'Bitcoin',
    ticker: 'BTC',
    balance: '1.01762',
    usdValue: '94,680.61',
    color: '#001689',
    icon: require('../assetnew/images/Frame2607760.png'),
    tokenCount: 0,
    tags: [],
  },
  {
    name: 'Rootstock',
    ticker: 'RBTC',
    balance: '1.01762',
    usdValue: '94,680.61',
    color: '#00733B',
    icon: require('../assets/images/ui/img_14.png'),
    tokenCount: 4,
    tags: ['Tether RSK', 'RIF', 'DOC', '+2'],
  },
  {
    name: 'Botanix',
    ticker: 'BTC',
    balance: '1.01762',
    usdValue: '94,680.61',
    color: '#98390B',
    icon: require('../assetnew/images/Frame2607761.png'),
    tokenCount: 2,
    tags: ['USDC.btx', 'BTC.btx'],
  },
  {
    name: 'Strata',
    ticker: 'BTC',
    balance: '1.01762',
    usdValue: '94,680.61',
    color: '#59006E',
    icon: require('../assetnew/images/Frame260722761.png'),
    tokenCount: 1,
    tags: ['zkBTC'],
  },
];

interface DashboardTilesProps {
  cards?: LayerCard[];
  onCardPress?: (index: number) => void;
  onClose?: () => void;
}

const DashboardTiles = ({ cards: externalCards, onCardPress: externalOnCardPress, onClose }: DashboardTilesProps) => {
  const flatListRef = useRef<Animated.FlatList<any>>(null);
  const scrollY = useSharedValue(0);
  const [selectedCardIndex, setSelectedCardIndex] = useState(-1);
  const [currentFocusedIndex, setCurrentFocusedIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const modalOpacity = useSharedValue(1);

  useEffect(() => {
    modalOpacity.value = withTiming(1, { duration: 150 });
  }, [modalOpacity]);

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onClose) {
      onClose();
    }
    modalOpacity.value = withTiming(0, { duration: 300 });
  }, [modalOpacity, onClose]);

  const containerAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: modalOpacity.value,
    }),
    [modalOpacity]
  );

  useFocusEffect(
    useCallback(() => {
      setSelectedCardIndex(-1);
    }, [])
  );

  const handleCardPress = useCallback(
    (index: number) => {
      if (externalOnCardPress) {
        externalOnCardPress(index);
      } else {
        setSelectedCardIndex(index);
      }
    },
    [externalOnCardPress]
  );

  const sourceCards = externalCards || cards;

  const filteredCards = sourceCards;

  const infiniteCards = useMemo(() => {
    if (filteredCards.length === 0) return [];

    const repeatCount = 7;
    const result: (LayerCard & { uniqueKey: string; originalIndex: number })[] = [];

    for (let i = 0; i < repeatCount; i++) {
      filteredCards.forEach((card, index) => {
        result.push({
          ...card,
          uniqueKey: `${i}-${index}`,
          originalIndex: index,
        });
      });
    }

    return result;
  }, [filteredCards]);

  const initialScrollIndex = useMemo(() => {
    if (infiniteCards.length === 0) return 0;
    const middleRepeat = Math.floor(7 / 2);
    return middleRepeat * filteredCards.length;
  }, [infiniteCards.length, filteredCards.length]);

  useEffect(() => {
    if (!isInitialized && infiniteCards.length > 0 && flatListRef.current) {
      const initialOffset = initialScrollIndex * SCROLL_SNAP_THRESHOLD;

      setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: initialOffset,
          animated: false,
        });
        setIsInitialized(true);
        setCurrentFocusedIndex(initialScrollIndex);
        scrollY.value = initialOffset;
      }, 100);
    }
  }, [infiniteCards.length, isInitialized, initialScrollIndex, scrollY]);

  const handleScrollEnd = useCallback(() => {
    const currentOffset = scrollY.value;
    const sectionHeight = filteredCards.length * SCROLL_SNAP_THRESHOLD;
    const currentSection = Math.floor(currentOffset / sectionHeight);

    if (currentSection <= 0 || currentSection >= 6) {
      const relativeOffset = currentOffset % sectionHeight;
      const newOffset = sectionHeight * 3 + relativeOffset;

      requestAnimationFrame(() => {
        flatListRef.current?.scrollToOffset({
          offset: newOffset,
          animated: false,
        });
        scrollY.value = newOffset;
      });
    }
  }, [scrollY, filteredCards.length]);

  const triggerHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  useAnimatedReaction(
    () => {
      return Math.round(scrollY.value / SCROLL_SNAP_THRESHOLD);
    },
    (currentIndex, previousIndex) => {
      if (currentIndex !== previousIndex && currentIndex >= 0) {
        const actualCardIndex = currentIndex % filteredCards.length;
        runOnJS(setCurrentFocusedIndex)(actualCardIndex);
        runOnJS(triggerHaptic)();
      }
    },
    [scrollY, filteredCards.length]
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const renderCard = useCallback(
    ({ item, index }: { item: LayerCard & { uniqueKey: string; originalIndex: number }; index: number }) => {
      const cardPosition = index * SCROLL_SNAP_THRESHOLD;

      const wrapperStyle = [
        styles.cardWrapper,
        {
          zIndex: 999,
          elevation: 50,
        },
      ];

      return (
        <View style={wrapperStyle}>
          <LayerCardTile
            card={item}
            index={index}
            cardPosition={cardPosition}
            scrollY={scrollY}
            selectedIndex={selectedCardIndex}
            onCardPress={handleCardPress}
            transitionId={`card-${item.name}-${index}`}
            totalCards={infiniteCards.length}
            disableNavigation={!!externalOnCardPress}
          />
        </View>
      );
    },
    [scrollY, selectedCardIndex, handleCardPress, infiniteCards.length, externalOnCardPress]
  );

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <BlurView intensity={50} tint="dark" style={styles.backgroundBlur} pointerEvents="none" />
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      )}
      <Animated.FlatList
        ref={flatListRef}
        data={infiniteCards}
        renderItem={({ item, index }) => renderCard({ item, index })}
        keyExtractor={(item) => item.uniqueKey}
        onScroll={scrollHandler}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={8}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        pagingEnabled={false}
        bounces={true}
        removeClippedSubviews={false}
        maxToRenderPerBatch={10}
        windowSize={21}
        snapToInterval={SCROLL_SNAP_THRESHOLD}
        snapToAlignment="start"
        getItemLayout={(data, index) => ({
          length: SCROLL_SNAP_THRESHOLD,
          offset: SCROLL_SNAP_THRESHOLD * index,
          index,
        })}
        contentContainerStyle={{
          paddingTop: height / 4 - CARD_HEIGHT / 2,
          paddingBottom: height / 4 - CARD_HEIGHT / 2,
        }}
        style={[
          styles.flatListContainer,
          {
            height: height / 2,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          },
        ]}
      />
    </Animated.View>
  );
};

export default DashboardTiles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'visible',
  },
  flatListContainer: {
    paddingHorizontal: 20,
    overflow: 'visible',
  },
  cardWrapper: {
    height: SCROLL_SNAP_THRESHOLD,
    width: CARD_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'visible',
    zIndex: 1,
  },
  card: {
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    backgroundColor: '#001689',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 1,
    position: 'absolute',
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
    flex: 1,
    marginRight: 12,
  },
  cardBalanceContainer: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardBalance: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  cardUsdValue: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    marginTop: 2,
    textAlign: 'right',
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
  backgroundBlur: {
    ...StyleSheet.absoluteFillObject,
  },
  blurCard: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1000,
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
