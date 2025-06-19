import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DashboardTiles from '@/components/DashboardTiles';
import { LayerzStorage } from '@/src/class/layerz-storage';
import { BackgroundExecutor } from '@/src/modules/background-executor';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const hasMnemonic = await BackgroundExecutor.hasMnemonic();
        const hasEncryptedMnemonic = await BackgroundExecutor.hasEncryptedMnemonic();

        if (!isMounted) return;

        if (!hasMnemonic) {
          router.replace('/onboarding/intro');
          return;
        }

        if (!hasEncryptedMnemonic) {
          router.replace('/onboarding/create-password');
          return;
        }

        const sessionAuth = await LayerzStorage.getItem('session_authenticated');
        if (sessionAuth !== 'true') {
          router.replace('/unlock');
        }
      } catch (error) {
        console.error('Error during setup checks:', error);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with Search */}
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput placeholder="Search" placeholderTextColor="#999" style={styles.searchInput} />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <MaterialCommunityIcons name="filter-variant" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Dashboard Tiles */}
        <View style={styles.dashboardContainer}>
          <DashboardTiles />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#121318' },
  container: { flex: 1, backgroundColor: '#121318' },
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
  filterButton: {
    marginLeft: 12,
  },
  closeButton: {
    marginLeft: 12,
  },
  dashboardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
