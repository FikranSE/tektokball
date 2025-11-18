import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';

const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const tiktokOpacity = useRef(new Animated.Value(0)).current;
  const otomediaOpacity = useRef(new Animated.Value(0)).current;
  const tiktokScale = useRef(new Animated.Value(0.8)).current;
  const otomediaScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Step 1: Show TEKTOKBALL
    Animated.parallel([
      Animated.timing(tiktokOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(tiktokScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Step 2: Hide TEKTOKBALL after 1 second
      setTimeout(() => {
        Animated.timing(tiktokOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          // Step 3: Show OTOMEDIA
          Animated.parallel([
            Animated.timing(otomediaOpacity, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(otomediaScale, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ]).start(() => {
            // Step 4: Hide OTOMEDIA and finish after 1 second
            setTimeout(() => {
              Animated.timing(otomediaOpacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
              }).start(() => {
                onFinish();
              });
            }, 1000);
          });
        });
      }, 1000);
    });
  }, [tiktokOpacity, otomediaOpacity, tiktokScale, otomediaScale, onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      
      <Animated.Text 
        style={[
          styles.brand, 
          { 
            opacity: tiktokOpacity,
            transform: [{ scale: tiktokScale }]
          }
        ]}
      >
        TEKTOKBALL
      </Animated.Text>
      
      <Animated.Text 
        style={[
          styles.company, 
          { 
            opacity: otomediaOpacity,
            transform: [{ scale: otomediaScale }]
          }
        ]}
      >
        OTOMEDIA
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brand: {
    fontSize: 48,
    fontWeight: '900',
    color: '#4a9eff',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(74, 158, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: 8,
  },
  company: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 4,
    opacity: 0.7,
  },
});

export default SplashScreen;
