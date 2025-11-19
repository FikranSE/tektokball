import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import useGameStore from '../store/gameStore';
import MoneyBlock from './MoneyBlock';
import Ball from './ball/Ball';
import SoundManager from '../utils/SoundManager';

const FIELD_WIDTH = 340;
const FIELD_HEIGHT = 200;
const BALL_SIZE = 48;
const BALL_RADIUS = BALL_SIZE / 2;

const Field: React.FC = () => {
  const { blocksOnField, balls, setFieldLayout, setBalls, addBalance, profitMultiplier, levelTargetAmount, collectedAmount, level, gameRunning, setGameRunning } = useGameStore();
  const innerRef = useRef<View>(null);
  const animRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const ballsRef = useRef(balls);
  const blocksRef = useRef(blocksOnField);
  const profitRef = useRef(profitMultiplier);
  const winRef = useRef(collectedAmount >= levelTargetAmount);
  const [earningBlocks, setEarningBlocks] = useState<Set<string>>(new Set());
  const [earningAnimations, setEarningAnimations] = useState<Map<string, { opacity: Animated.Value; translateY: Animated.Value }>>(new Map());

  // Trigger earning effect for a block
  const triggerEarningEffect = (blockId: string, amount: number) => {
    setEarningBlocks(prev => new Set(prev).add(blockId));
    
    // Create new animations for this block
    const opacityAnim = new Animated.Value(1);
    const translateYAnim = new Animated.Value(20);
    
    setEarningAnimations(prev => new Map(prev).set(blockId, { opacity: opacityAnim, translateY: translateYAnim }));
    
    // Start animations
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 2000, // Increased from 1000ms
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: -20,
        duration: 2000, // Increased from 1000ms
        useNativeDriver: true,
      }),
    ]).start();
    
    // Clean up after animation
    setTimeout(() => {
      setEarningBlocks(prev => {
        const newSet = new Set(prev);
        newSet.delete(blockId);
        return newSet;
      });
      setEarningAnimations(prev => {
        const newMap = new Map(prev);
        newMap.delete(blockId);
        return newMap;
      });
    }, 2100); // Increased from 1100ms
  };

  // keep refs updated with latest store state
  useEffect(() => { ballsRef.current = balls; }, [balls]);
  useEffect(() => { blocksRef.current = blocksOnField; }, [blocksOnField]);
  useEffect(() => { profitRef.current = profitMultiplier; }, [profitMultiplier]);
  useEffect(() => { 
    const newWinState = collectedAmount >= levelTargetAmount;
    console.log('Win condition update:', { collectedAmount, levelTargetAmount, newWinState, level });
    winRef.current = newWinState; 
  }, [collectedAmount, levelTargetAmount]);

  // Reset winRef when level changes
  useEffect(() => {
    console.log('Level changed, resetting winRef:', { level, collectedAmount, levelTargetAmount });
    winRef.current = false; // Reset win condition for new level
  }, [level]);

  // Restart animation when level changes (to unfreeze balls)
  useEffect(() => {
    // Cancel any existing animation
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
      lastTsRef.current = null;
    }
    // The main animation useEffect will restart automatically
  }, [level]);

  useEffect(() => {
    const step = (ts: number) => {
      const last = lastTsRef.current ?? ts;
      const dt = Math.min(0.033, (ts - last) / 1000); // cap dt
      lastTsRef.current = ts;

      const awardOnHit = (amount: number) => {
        if (winRef.current) {
          console.log('Win condition active, skipping award');
          return;
        }
        if (amount > 0) addBalance(Math.round(amount * profitRef.current));
      };

      // integrate with 2 sub-steps per frame to avoid tunneling
      let next = ballsRef.current.map((b) => {
        let x = b.x, y = b.y, vx = b.vx, vy = b.vy;
        const sub = 2; const subDt = dt / sub;
        for (let s = 0; s < sub; s++) {
          // advance
          x += vx * subDt; y += vy * subDt;
          // walls
          if (x < BALL_RADIUS) { x = BALL_RADIUS; vx = Math.abs(vx); }
          if (x > FIELD_WIDTH - BALL_RADIUS) { x = FIELD_WIDTH - BALL_RADIUS; vx = -Math.abs(vx); }
          if (y < BALL_RADIUS) { y = BALL_RADIUS; vy = Math.abs(vy); }
          if (y > FIELD_HEIGHT - BALL_RADIUS) { y = FIELD_HEIGHT - BALL_RADIUS; vy = -Math.abs(vy); }

          // blocks
          for (const blk of blocksRef.current) {
            const bw = 120; const bh = 50;
            const cx = Math.max(blk.x, Math.min(x, blk.x + bw));
            const cy = Math.max(blk.y, Math.min(y, blk.y + bh));
            const dx = x - cx; const dy = y - cy;
            const dist2 = dx * dx + dy * dy;
            if (dist2 <= BALL_RADIUS * BALL_RADIUS) {
              const overlapX = BALL_RADIUS - Math.abs(x - cx);
              const overlapY = BALL_RADIUS - Math.abs(y - cy);
              if (overlapX < overlapY) { vx = -vx; x += Math.sign(dx || 1) * overlapX; }
              else { vy = -vy; y += Math.sign(dy || 1) * overlapY; }
              awardOnHit(blk.incomePerHit);
              SoundManager.playSystemSound('bounce');
            }
          }
        }
        return { ...b, x, y, vx, vy };
      });

      if (animRef.current !== null) setBalls(next);
      console.log('Animation step:', { 
        gameRunning,
        winRef: winRef.current, 
        collectedAmount, 
        levelTargetAmount,
        ballsCount: ballsRef.current.length,
        ballVelocity: ballsRef.current[0]?.vx
      });
      if (gameRunning && !winRef.current) {
        animRef.current = requestAnimationFrame(step);
      } else {
        console.log('Animation stopped:', { gameRunning, winRef: winRef.current });
      }
    };
    // Don't auto-start animation, wait for gameRunning to be true
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = null; lastTsRef.current = null;
    };
  }, []);

  // Start/stop animation based on gameRunning state
  useEffect(() => {
    console.log('GameRunning useEffect triggered:', { 
      gameRunning, 
      winRef: winRef.current, 
      animRef: animRef.current,
      level,
      collectedAmount,
      levelTargetAmount
    });
    
    if (gameRunning && !winRef.current && !animRef.current) {
      console.log('Starting animation loop...');
      const awardOnHit = (amount: number) => {
        if (winRef.current) {
          console.log('Win condition active, skipping award');
          return;
        }
        if (amount > 0) addBalance(Math.round(amount * profitRef.current));
      };
      
      const step = (ts: number) => {
        if (!lastTsRef.current) lastTsRef.current = ts;
        const dt = Math.min((ts - lastTsRef.current) / 1000, 0.1);
        lastTsRef.current = ts;

        const next = ballsRef.current.map((b) => {
          let { x, y, vx, vy } = b;
          x += vx * dt;
          y += vy * dt;

          // wall bounce
          if (x <= BALL_RADIUS || x >= FIELD_WIDTH - BALL_RADIUS) {
            vx = -vx;
            x = x <= BALL_RADIUS ? BALL_RADIUS : FIELD_WIDTH - BALL_RADIUS;
          }
          if (y <= BALL_RADIUS || y >= FIELD_HEIGHT - BALL_RADIUS) {
            vy = -vy;
            y = y <= BALL_RADIUS ? BALL_RADIUS : FIELD_HEIGHT - BALL_RADIUS;
            SoundManager.playSystemSound('bounce');
          }

          // block collision
          for (const blk of blocksRef.current) {
            const blkRight = blk.x + 120;
            const blkBottom = blk.y + 50;
            const ballRight = x + BALL_SIZE;
            const ballBottom = y + BALL_SIZE;

            if (x < blkRight && ballRight > blk.x && y < blkBottom && ballBottom > blk.y) {
              const overlapLeft = ballRight - blk.x;
              const overlapRight = blkRight - x;
              const overlapTop = ballBottom - blk.y;
              const overlapBottom = blkBottom - y;

              const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
              if (minOverlap === overlapLeft || minOverlap === overlapRight) {
                vx = -vx;
                if (minOverlap === overlapLeft) x -= overlapLeft;
                else x += overlapRight;
              } else {
                vy = -vy;
                if (minOverlap === overlapTop) y -= overlapTop;
                else y += overlapBottom;
              }
              awardOnHit(blk.incomePerHit);
              triggerEarningEffect(blk.id, blk.incomePerHit); // Trigger earning animation with amount
              SoundManager.playSystemSound('bounce');
            }
          }
          return { ...b, x, y, vx, vy };
        });

        if (animRef.current !== null) setBalls(next);
        console.log('Animation step:', { 
          gameRunning,
          winRef: winRef.current, 
          collectedAmount, 
          levelTargetAmount,
          ballsCount: ballsRef.current.length,
          ballVelocity: ballsRef.current[0]?.vx
        });
        if (gameRunning && !winRef.current) {
          animRef.current = requestAnimationFrame(step);
        } else {
          console.log('Animation stopped:', { gameRunning, winRef: winRef.current });
        }
      };
      animRef.current = requestAnimationFrame(step);
      console.log('Animation started by gameRunning state');
    } else if (!gameRunning && animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
      console.log('Animation stopped by gameRunning state');
    }
  }, [gameRunning]);

  // On win: freeze balls (vx,vy = 0) and cancel RAF if still running
  useEffect(() => {
    const isWin = collectedAmount >= levelTargetAmount;
    if (isWin) {
      // Play level win sound
      SoundManager.playSystemSound('levelWin');
      
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
      const frozen = ballsRef.current.map((b) => ({ ...b, vx: 0, vy: 0 }));
      setBalls(frozen);
    }
  }, [collectedAmount, levelTargetAmount]);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.frame, { width: FIELD_WIDTH + 24, height: FIELD_HEIGHT + 24 }]}>
        <View
          ref={innerRef}
          onLayout={() => {
            // measure in window to get absolute coordinates for drop detection
            innerRef.current?.measureInWindow((x, y, width, height) => {
              setFieldLayout({ x, y, width, height });
            });
          }}
          style={[styles.inner, { width: FIELD_WIDTH, height: FIELD_HEIGHT }]}
        >
          <View style={styles.stripes}>
            {Array.from({ length: 8 }).map((_, i) => (
              <View key={i} style={[styles.stripe, { left: i * (FIELD_WIDTH / 8) }]} />
            ))}
          </View>

          {blocksOnField.map((block) => (
            <View key={block.id} style={[styles.blockPos, { left: block.x, top: block.y }]}>
              <MoneyBlock 
                block={block} 
                width={80} 
                height={35} 
                triggerEarning={earningBlocks.has(block.id)}
              />
            </View>
          ))}

          {/* Earning texts outside blocks */}
          {blocksOnField.map((block) => {
            const animation = earningAnimations.get(block.id);
            if (!animation) return null;
            
            return (
              <Animated.View
                key={`earning-${block.id}`}
                style={[
                  styles.earningText,
                  {
                    left: block.x + 40, // Center of block
                    top: block.y - 20, // Above block
                    opacity: animation.opacity,
                    transform: [{ translateY: animation.translateY }]
                  }
                ]}
              >
                <Text style={styles.earningAmount}>+{block.incomePerHit}$</Text>
              </Animated.View>
            );
          })}

          {balls.map((b) => (
            <Ball key={b.id} x={b.x} y={b.y} size={BALL_SIZE} />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  frame: {
    borderWidth: 2,
    borderColor: '#4a9eff',
    borderRadius: 16,
    padding: 12,
    backgroundColor: 'rgba(74, 158, 255, 0.05)',
    shadowColor: '#4a9eff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  inner: {
    backgroundColor: '#0d1f1a',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(74, 158, 255, 0.15)',
  },
  stripes: {
    ...StyleSheet.absoluteFillObject,
  },
  stripe: {
    position: 'absolute',
    width: 4,
    height: '100%',
    backgroundColor: 'rgba(74, 158, 255, 0.03)',
  },
  blockPos: {
    position: 'absolute',
  },
  earningText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
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

export default Field;
