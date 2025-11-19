import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import useGameStore from '../store/gameStore';

const VictoryModal: React.FC = () => {
  const { collectedAmount, levelTargetAmount, victoryShown, setVictoryShown, nextLevel, level } = useGameStore();

  const isWin = collectedAmount >= levelTargetAmount;

  return (
    <Modal transparent visible={isWin || victoryShown} animationType="fade" onRequestClose={() => setVictoryShown(false)}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Level {level} Complete!</Text>
          <Text style={styles.amount}>Rp {collectedAmount.toLocaleString('id-ID')} / Rp {levelTargetAmount.toLocaleString('id-ID')}</Text>
          <Text style={styles.subtitle}>You Win! 🎉</Text>
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => {
              setVictoryShown(false);
              nextLevel();
            }}
          >
            <Text style={styles.nextText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#34d399',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    elevation: 10,
  },
  title: {
    color: '#064e3b',
    fontSize: 22,
    fontWeight: '900',
  },
  amount: {
    marginTop: 8,
    color: '#022c22',
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    color: '#064e3b',
    fontSize: 18,
    fontWeight: '800',
  },
  nextBtn: {
    marginTop: 16,
    backgroundColor: '#60a5fa',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  nextText: {
    color: '#082f49',
    fontWeight: '900',
    fontSize: 14,
  },
});

export default VictoryModal;
