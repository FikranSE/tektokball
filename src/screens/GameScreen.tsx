import React, { useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Text } from 'react-native';
import VictoryBar from '../components/VictoryBar';
import Field from '../components/Field';
import ShopStrip from '../components/shop/ShopStrip';
import UpgradePanel from '../components/UpgradePanel';
import LevelCompletePopup from '../components/LevelCompletePopup';
import useGameStore from '../store/gameStore';

const GameScreen = () => {
  const { 
    level, 
    collectedAmount, 
    levelTargetAmount, 
    showLevelCompletePopup, 
    setLevelCompletePopup, 
    nextLevel,
    clearField,
    resetAll,
    gameRunning,
    setGameRunning 
  } = useGameStore();

  // Check for level completion
  useEffect(() => {
    if (collectedAmount >= levelTargetAmount) {
      setLevelCompletePopup(true);
    }
  }, [collectedAmount, levelTargetAmount, setLevelCompletePopup]);

  const handleClosePopup = () => {
    resetAll(); // Reset everything to initial state
    setLevelCompletePopup(false);
    // Auto-start game after reset
    setTimeout(() => setGameRunning(true), 100);
  };

  const handleNextLevel = () => {
    setLevelCompletePopup(false);
    clearField();
    nextLevel();
    // Auto-start game for level 2 and beyond
    setTimeout(() => setGameRunning(true), 100);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Top Section - Victory Bar */}
      <View style={styles.topSection}>
        <VictoryBar />
      </View>

      {/* Middle Section - Game Area */}
      <View style={styles.middleSection}>
        <View style={styles.gameArea}>
          <View style={styles.vignette} />
          <Field />
          {/* Start/Play Button Overlay */}
          {!gameRunning && (
            <View style={styles.startButtonOverlay}>
              <TouchableOpacity 
                style={styles.startButton}
                onPress={() => setGameRunning(true)}
              >
                <Text style={styles.startButtonText}>START</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Bottom Section - Shop and Upgrades */}
      <View style={styles.bottomSection}>
        <View style={styles.shopContainer}>
          <ShopStrip />
        </View>
        <View style={styles.upgradeContainer}>
          <UpgradePanel />
        </View>
      </View>

      {/* Level Complete Popup */}
      <LevelCompletePopup
        visible={showLevelCompletePopup}
        onClose={handleClosePopup}
        onNextLevel={handleNextLevel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  topSection: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  middleSection: {
    flex: 2,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameArea: {
    width: '100%',
    maxWidth: 400,
    aspectRatio: 1.45,
    position: 'relative',
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
    pointerEvents: 'none',
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  shopContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  upgradeContainer: {
    justifyContent: 'center',
  },
  startButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GameScreen;
