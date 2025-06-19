import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AssetDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Data can be passed via params, with fallback for direct access
  const asset = {
    name: (params.name as string) || 'Base (BTC)',
    balance: (params.balance as string) || '1.01762',
    ticker: (params.ticker as string) || 'BTC',
    usdValue: (params.usdValue as string) || '94,680.61 USD',
    color: (params.color as string) || '#001689',
    sent: '0.0853 BTC',
    received: '0.0289 BTC',
  };

  const getDarkerColor = (color: string) => {
    if (color.startsWith('#') && color.length === 7) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const darkerR = Math.floor(r * 0.6);
      const darkerG = Math.floor(g * 0.6);
      const darkerB = Math.floor(b * 0.6);
      return `#${darkerR.toString(16).padStart(2, '0')}${darkerG.toString(16).padStart(2, '0')}${darkerB.toString(16).padStart(2, '0')}`;
    }
    return '#00052C'; // Fallback
  };

  const gradientEndColor = getDarkerColor(asset.color);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: gradientEndColor }]}>
      <LinearGradient colors={[asset.color, gradientEndColor]} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.savingsButton}>
              <Text style={styles.savingsText}>Savings</Text>
              <Ionicons name="chevron-down" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Asset Info */}
          <View style={styles.assetInfoContainer}>
            <View style={styles.assetHeader}>
              <FontAwesome5 name="bitcoin" size={24} color="white" />
              <Text style={styles.assetName}>{asset.name}</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="chevron-down" size={28} color="white" />
            </TouchableOpacity>
          </View>

          <Text style={styles.usdValue}>{asset.usdValue}</Text>
          <Text style={styles.balance}>
            {asset.balance} {asset.ticker}
          </Text>

          {/* Transactions Card */}
          <View style={styles.transactionsCard}>
            <Text style={styles.transactionsTitle}>This week's transaction</Text>
            <View style={styles.transactionRow}>
              <Text style={styles.transactionLabel}>Sent:</Text>
              <Text style={styles.transactionValue}>{asset.sent}</Text>
              {/* Placeholder for graph */}
            </View>
            <View style={styles.transactionRow}>
              <Text style={styles.transactionLabel}>Received:</Text>
              <Text style={styles.transactionValue}>{asset.received}</Text>
              {/* Placeholder for graph */}
            </View>
            <TouchableOpacity style={styles.seeAllButton}>
              <Ionicons name="arrow-forward-circle-outline" size={22} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.seeAllText}>See All Transactions</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={[styles.bottomActions, { backgroundColor: gradientEndColor }]}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="arrow-up" size={24} color="white" />
            <Text style={styles.actionText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="swap-horizontal" size={24} color="white" />
            <Text style={styles.actionText}>Swap</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="card" size={24} color="white" />
            <Text style={styles.actionText}>Buy</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#00052C', // This will be overridden
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90, // Ensure content is not hidden behind bottom actions
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  savingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  savingsText: {
    color: 'white',
    marginRight: 4,
    fontSize: 16,
  },
  assetInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
  },
  assetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  usdValue: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 18,
    paddingHorizontal: 16,
    marginTop: 24,
  },
  balance: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  transactionsCard: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    marginTop: 32,
  },
  transactionsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 20,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
  transactionValue: {
    color: 'white',
    fontSize: 16,
  },
  seeAllButton: {
    flexDirection: 'row',
    backgroundColor: '#000',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  seeAllText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: 24,
    backgroundColor: '#00052C', // This will be overridden
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    marginTop: 4,
  },
});
