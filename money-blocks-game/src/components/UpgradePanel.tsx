import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import useGameStore from '../store/gameStore';

const UpgradePanel: React.FC = () => {
  const { upgradeMoneyBlocks, upgradeAddBall, upgradeProfitMultiplier, upgradeCosts } = useGameStore();

  return (
    <View style={styles.container}>
      <UpgradeButton
        price={`${upgradeCosts.ball}$`}
        label="+1 ball"
        icon={<Image source={require('../../assets/game/blue-ball.png')} style={styles.iconBall} />}
        onPress={upgradeAddBall}
      />
      <UpgradeButton
        price={`${upgradeCosts.moneyBlock}$`}
        label="+3 blocks"
        icon={<Image source={require('../../assets/game/block.png')} style={styles.iconBlock} />}
        onPress={upgradeMoneyBlocks}
      />
      <UpgradeButton
        price={`${upgradeCosts.profit}$`}
        label="Blocks +1$"
        icon={<Image source={require('../../assets/game/block.png')} style={styles.iconChest} />}
        onPress={upgradeProfitMultiplier}
      />
    </View>
  );
};

interface BtnProps {
  price: string;
  label: string;
  onPress: () => void;
  icon: React.ReactNode;
}

const UpgradeButton: React.FC<BtnProps> = ({ price, label, onPress, icon }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={onPress}>
      {icon}
      <Text style={styles.price}>{price}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  iconBall: {
    width: 28,
    height: 28,
    marginBottom: 4,
  },
  iconBlock: {
    width: 32,
    height: 20,
    marginBottom: 4,
  },
  iconChest: {
    width: 32,
    height: 32,
    marginBottom: 4,
  },
  price: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffd700',
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});

export default UpgradePanel;
