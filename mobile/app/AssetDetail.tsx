import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

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
              <Ionicons name="chevron-down" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.savingsButton}>
              <Text style={styles.savingsText}>Savings</Text>
              <Ionicons name="chevron-down" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Layer Header */}
          <View style={styles.layerContainer}>
            <FontAwesome5 name="bitcoin" size={24} color="white" />
            <Text style={styles.layerText}>Layer</Text>
          </View>

          {/* Asset Info */}
          <View style={styles.assetInfoContainer}>
            <Text style={styles.assetName}>{asset.name}</Text>
            <TouchableOpacity onPress={() => router.back()}>
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
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionLabel}>Sent:</Text>
                <Text style={styles.transactionValue}>{asset.sent}</Text>
              </View>
              <View style={styles.chartContainer}>
                <View style={styles.miniChart}>
                  {/* Gradient background with controlled height */}
                  <LinearGradient
                    colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.05)', 'transparent']}
                    style={[styles.chartGradientAreaBounded, { height: '60%', top: '5%' }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  />
                  {/* Line points */}
                  <View style={styles.chartLineOverlay}>
                    <View style={[styles.chartLinePoint, { left: '5%', top: '40%' }]} />
                    <View style={[styles.chartLinePoint, { left: '15%', top: '30%' }]} />
                    <View style={[styles.chartLinePoint, { left: '25%', top: '25%' }]} />
                    <View style={[styles.chartLinePoint, { left: '35%', top: '20%' }]} />
                    <View style={[styles.chartLinePoint, { left: '45%', top: '18%' }]} />
                    <View style={[styles.chartLinePoint, { left: '55%', top: '15%' }]} />
                    <View style={[styles.chartLinePoint, { left: '65%', top: '12%' }]} />
                    <View style={[styles.chartLinePoint, { left: '75%', top: '10%' }]} />
                    <View style={[styles.chartLinePoint, { left: '85%', top: '8%' }]} />
                    <View style={[styles.chartLinePoint, { left: '95%', top: '5%' }]} />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.transactionRow}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionLabel}>Received:</Text>
                <Text style={styles.transactionValue}>{asset.received}</Text>
              </View>
              <View style={styles.chartContainer}>
                <View style={styles.miniChart}>
                  {/* Gradient background with controlled height */}
                  <LinearGradient
                    colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.05)', 'transparent']}
                    style={[styles.chartGradientAreaBounded, { height: '90%', top: '10%' }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  />
                  {/* Line points */}
                  <View style={styles.chartLineOverlay}>
                    <View style={[styles.chartLinePoint, { left: '5%', top: '55%' }]} />
                    <View style={[styles.chartLinePoint, { left: '15%', top: '60%' }]} />
                    <View style={[styles.chartLinePoint, { left: '25%', top: '50%' }]} />
                    <View style={[styles.chartLinePoint, { left: '35%', top: '45%' }]} />
                    <View style={[styles.chartLinePoint, { left: '45%', top: '40%' }]} />
                    <View style={[styles.chartLinePoint, { left: '55%', top: '35%' }]} />
                    <View style={[styles.chartLinePoint, { left: '65%', top: '25%' }]} />
                    <View style={[styles.chartLinePoint, { left: '75%', top: '20%' }]} />
                    <View style={[styles.chartLinePoint, { left: '85%', top: '15%' }]} />
                    <View style={[styles.chartLinePoint, { left: '95%', top: '10%' }]} />
                  </View>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.seeAllButton}>
              <Ionicons name="arrow-forward-circle-outline" size={22} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.seeAllText}>See All Transactions</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Page Indicators */}
        <View style={styles.pageIndicators}>
          <View style={[styles.pageIndicator, styles.pageIndicatorInactive]} />
          <View style={[styles.pageIndicator, styles.pageIndicatorInactive]} />
          <View style={[styles.pageIndicator, styles.pageIndicatorActive]} />
          <View style={[styles.pageIndicator, styles.pageIndicatorInactive]} />
        </View>

        {/* Bottom Actions */}
        <View style={[styles.bottomActions, { backgroundColor: gradientEndColor }]}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="arrow-up-outline" size={24} color="white" />
            <Text style={styles.actionText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="swap-horizontal-outline" size={24} color="white" />
            <Text style={styles.actionText}>Swap</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="link-outline" size={24} color="white" />
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

  layerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  layerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 8,
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
  transactionInfo: {
    flex: 1,
  },
  chartContainer: {
    width: 80,
    height: 40,
    marginLeft: 16,
  },
  miniChart: {
    flex: 1,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  chartGradientArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
  },
  chartLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  chartLinePoint: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: 'white',
    borderRadius: 1.5,
    opacity: 0.9,
  },
  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  pageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pageIndicatorActive: {
    backgroundColor: 'white',
    width: 24,
  },
  pageIndicatorInactive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  chartGradientAreaBounded: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
  },
  chartLineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
