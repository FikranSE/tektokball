import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import useGameStore from '../store/gameStore';

const VictoryBar: React.FC = () => {
  const { balance, collectedAmount, level, levelTargetAmount, resetAll } = useGameStore();

  const progress = Math.min(1, collectedAmount / levelTargetAmount);

  return (
    <View style={styles.container}>
      <View style={styles.levelBox}>
        <Text style={styles.levelText}>Level {level}</Text>
      </View>
      
      <View style={styles.progressBox}>
        <Text style={styles.progressText}>
          {collectedAmount.toLocaleString('id-ID')} / {levelTargetAmount.toLocaleString('id-ID')}$
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <View style={styles.moneyBox}>
        <Text style={styles.moneyText}>{balance.toLocaleString('id-ID')}$</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  levelBox: {
    backgroundColor: 'rgba(74, 158, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(74, 158, 255, 0.3)',
  },
  levelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4a9eff',
    textShadowColor: 'rgba(74, 158, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  progressBox: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  moneyBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  moneyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f59e0b',
    textShadowColor: 'rgba(245, 158, 11, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});

export default VictoryBar;
