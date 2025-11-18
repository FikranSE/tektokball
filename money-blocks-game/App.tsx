import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Platform, StatusBar as RNStatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import GameScreen from './src/screens/GameScreen';
import SplashScreen from './src/components/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: '#050816',
            paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 0) : 0,
          }}
        >
          <GameScreen />
        </SafeAreaView>
      )}
    </GestureHandlerRootView>
  );
}
