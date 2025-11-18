import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Props {
  x: number;
  y: number;
  size?: number;
}

const Ball: React.FC<Props> = ({ x, y, size = 28 }) => {
  return (
    <View style={[
      styles.container,
      { left: x, top: y, width: size, height: size, transform: [{ translateX: -size / 2 }, { translateY: -size / 2 }] }
    ]}>
      <Image
        source={require('../../../assets/game/blue-ball.png')}
        style={{ width: size, height: size, resizeMode: 'contain' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});

export default Ball;
