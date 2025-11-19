import React, { useMemo, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';
import MoneyBlock from '../MoneyBlock';
import useGameStore, { MoneyBlock as MoneyBlockType } from '../../store/gameStore';
import SoundManager from '../../utils/SoundManager';

interface Props {
  block: MoneyBlockType;
}

const ShopBlock: React.FC<Props> = ({ block }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const { placeBlockFromShop } = useGameStore();

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          console.log('PanResponderGrant triggered');
          SoundManager.playSystemSound('drag');
          pan.setOffset({ x: (pan as any).x._value, y: (pan as any).y._value });
          pan.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
        onPanResponderRelease: (evt, gesture) => {
          console.log('PanResponderRelease triggered', { evt, gesture });
          pan.flattenOffset();
          const pageX = (evt.nativeEvent as any).pageX ?? gesture.moveX;
          const pageY = (evt.nativeEvent as any).pageY ?? gesture.moveY;
          console.log('Calling placeBlockFromShop with:', { blockId: block.id, pageX, pageY });
          SoundManager.playSystemSound('drop');
          placeBlockFromShop(block.id, pageX, pageY);
          Animated.timing(pan, { toValue: { x: 0, y: 0 }, duration: 150, useNativeDriver: false }).start();
        },
      }),
    [block.id]
  );

  return (
    <Animated.View style={[styles.drag, pan.getLayout()]} {...responder.panHandlers}>
      <MoneyBlock block={block} width={80} height={35} />
      <View style={styles.grab} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drag: {
    marginHorizontal: 6,
    width: 80,
    height: 35,
  },
  grab: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default ShopBlock;
