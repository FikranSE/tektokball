import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import useGameStore from '../../store/gameStore';
import ShopBlock from './ShopBlock';

const ShopStrip: React.FC = () => {
  const { shopBlocks, refreshShop } = useGameStore();

  return (
    <View style={styles.container}>
      <View style={styles.shop}>
        {shopBlocks.map((b) => (
          <ShopBlock key={b.id} block={b} />
        ))}
        {shopBlocks.length === 0 && (
          <TouchableOpacity style={styles.addButton} onPress={refreshShop}>
            <Text style={styles.addText}>+3</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  shop: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  addButton: {
    backgroundColor: 'rgba(74, 158, 255, 0.2)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(74, 158, 255, 0.4)',
    shadowColor: '#4a9eff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  addText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4a9eff',
    textShadowColor: 'rgba(74, 158, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default ShopStrip;
