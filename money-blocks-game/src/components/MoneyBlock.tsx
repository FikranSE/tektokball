import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, View, Animated } from 'react-native';
import { MoneyBlock as MoneyBlockType } from '../store/gameStore';

interface Props {
  block: MoneyBlockType;
  width?: number;
  height?: number;
  triggerEarning?: boolean;
}

const MoneyBlock: React.FC<Props> = ({ block, width = 120, height = 50, triggerEarning = false }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const earningOpacityAnim = useRef(new Animated.Value(0)).current;
  const earningTranslateAnim = useRef(new Animated.Value(0)).current;

  // Trigger earning animation when ball hits
  useEffect(() => {
    if (triggerEarning) {
      // Scale effect - block grows and shrinks
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Floating earning text effect
      earningOpacityAnim.setValue(1);
      earningTranslateAnim.setValue(20); // Start from below
      
      Animated.parallel([
        Animated.timing(earningOpacityAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(earningTranslateAnim, {
          toValue: -20, // Float upward
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [triggerEarning]);

  // Warna berbeda berdasarkan level untuk visibilitas lebih baik
  const getBlockColor = (level: number) => {
    switch (level) {
      case 1: return '#10b981'; // hijau terang
      case 2: return '#3b82f6'; // biru terang
      case 3: return '#8b5cf6'; // ungu terang
      case 4: return '#f59e0b'; // orange terang
      case 5: return '#ef4444'; // merah terang
      default: return '#7c3aed'; // ungu default
    }
  };

  return (
    <View style={[styles.container, { width, height }]}>
      <Animated.View style={[styles.gradient, { backgroundColor: getBlockColor(block.level), transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.text}>{block.incomePerHit}$</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  gradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
    borderRadius: 9,
  },
  text: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  earningText: {
    position: 'absolute',
    bottom: 40, // Position below the block
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  earningAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default MoneyBlock;
