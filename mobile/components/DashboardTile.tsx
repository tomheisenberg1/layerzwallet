import React from 'react';
import { View, StyleSheet } from 'react-native';

interface DashboardTileProps {
  children?: React.ReactNode;
  style?: any;
}

export default function DashboardTile({ children, style }: DashboardTileProps) {
  return <View style={[styles.tile, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  tile: {
    width: '45%',
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
