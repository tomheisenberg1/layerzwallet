import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, Text, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';

import DashboardTiles from '@/components/DashboardTiles';
import { LayerzStorage } from '@/src/class/layerz-storage';
import { BackgroundExecutor } from '@/src/modules/background-executor';

export default function IndexScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const filterOpacity = useSharedValue(0);
  const filterScale = useSharedValue(0.8);
  const filterTranslateY = useSharedValue(-20);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);

    if (!isFilterOpen) {
      // Opening filter
      filterOpacity.value = withTiming(1, { duration: 300 });
      filterScale.value = withSpring(1, { damping: 15, stiffness: 150 });
      filterTranslateY.value = withTiming(0, { duration: 300 });
    } else {
      // Closing filter
      filterOpacity.value = withTiming(0, { duration: 200 });
      filterScale.value = withTiming(0.8, { duration: 200 });
      filterTranslateY.value = withTiming(-20, { duration: 200 });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    Keyboard.dismiss();
  };

  const handleClose = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setActiveFilter('all');
    setIsFilterOpen(false);
    Keyboard.dismiss();
    filterOpacity.value = withTiming(0, { duration: 200 });
    filterScale.value = withTiming(0.8, { duration: 200 });
    filterTranslateY.value = withTiming(-20, { duration: 200 });
  };

  const filterAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: filterOpacity.value,
      transform: [{ scale: filterScale.value }, { translateY: filterTranslateY.value }],
    };
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Header with Search - Fixed at top */}
          <View style={styles.header}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                placeholder="Search"
                placeholderTextColor="#999"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                onSubmitEditing={() => Keyboard.dismiss()}
                blurOnSubmit={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={[styles.filterButton, (isFilterOpen || activeFilter !== 'all') && styles.filterButtonActive]} onPress={handleFilterToggle}>
              <MaterialCommunityIcons name="filter-variant" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          {/* Filter Options */}
          {isFilterOpen && (
            <Animated.View style={[styles.filterContainer, filterAnimatedStyle]}>
              <View style={styles.filterOptions}>
                <TouchableOpacity style={[styles.filterOption, activeFilter === 'all' && styles.filterOptionActive]} onPress={() => setActiveFilter('all')}>
                  <Text style={[styles.filterOptionText, activeFilter === 'all' && styles.filterOptionTextActive]}>All Assets</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterOption, activeFilter === 'btc' && styles.filterOptionActive]} onPress={() => setActiveFilter('btc')}>
                  <Text style={[styles.filterOptionText, activeFilter === 'btc' && styles.filterOptionTextActive]}>Bitcoin</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterOption, activeFilter === 'tokens' && styles.filterOptionActive]} onPress={() => setActiveFilter('tokens')}>
                  <Text style={[styles.filterOptionText, activeFilter === 'tokens' && styles.filterOptionTextActive]}>Tokens</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterOption, activeFilter === 'high-value' && styles.filterOptionActive]} onPress={() => setActiveFilter('high-value')}>
                  <Text style={[styles.filterOptionText, activeFilter === 'high-value' && styles.filterOptionTextActive]}>High Value</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}{' '}
          {/* Dashboard Tiles - This area will adjust for keyboard */}
          <KeyboardAvoidingView style={styles.dashboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
                <DashboardTiles searchQuery={debouncedSearchQuery} activeFilter={activeFilter} />
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#121318' },
  container: { flex: 1, backgroundColor: '#121318' },
  content: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1F25',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 8,
  },
  filterButton: {
    marginLeft: 12,
  },
  filterButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 4,
  },
  closeButton: {
    marginLeft: 12,
  },
  dashboardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  filterContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#1E1F25',
    borderRadius: 12,
    padding: 16,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterOptionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  filterOptionActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterOptionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});
