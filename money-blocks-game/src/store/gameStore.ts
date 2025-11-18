import { create } from 'zustand';

const DEFAULT_BALANCE = 200; // enough to buy ball (100) and upgrade/blocks (>=50)

export interface MoneyBlock {
  id: string;
  level: number;
  incomePerHit: number;
  x: number;
  y: number;
}

interface UpgradeCosts {
  moneyBlock: number;
  ball: number;
  profit: number;
}

interface GameState {
  balance: number;
  collectedAmount: number;
  levelTargetAmount: number;
  level: number;
  blocksOnField: MoneyBlock[];
  balls: { id: string; x: number; y: number; vx: number; vy: number }[];
  ballCount: number;
  profitMultiplier: number;
  upgradeCosts: UpgradeCosts;
  // shop & field
  shopBlocks: MoneyBlock[];
  fieldLayout: { x: number; y: number; width: number; height: number } | null;
  setFieldLayout: (layout: { x: number; y: number; width: number; height: number }) => void;
  refreshShop: () => void;
  placeBlockFromShop: (id: string, dropX: number, dropY: number) => void;
  tryMergeAt: (blockId: string) => void;
  // economy
  addBalance: (amount: number) => void;
  spend: (amount: number) => boolean;
  setBalls: (balls: { id: string; x: number; y: number; vx: number; vy: number }[]) => void;
  // game control
  gameRunning: boolean;
  setGameRunning: (running: boolean) => void;
  // victory
  victoryShown: boolean;
  setVictoryShown: (v: boolean) => void;
  // level completion popup
  showLevelCompletePopup: boolean;
  setLevelCompletePopup: (show: boolean) => void;
  nextLevel: () => void;
  // reset
  resetAll: () => void;
  clearField: () => void;
  upgradeMoneyBlocks: () => void;
  upgradeAddBall: () => void;
  upgradeProfitMultiplier: () => void;
}

const useGameStore = create<GameState>((set, get) => ({
  balance: DEFAULT_BALANCE,
  collectedAmount: 0,
  levelTargetAmount: 1000,
  level: 1,
  showLevelCompletePopup: false,
  gameRunning: false,
  blocksOnField: [],
  balls: [],
  ballCount: 1,
  profitMultiplier: 1,
  upgradeCosts: {
    moneyBlock: 50,
    ball: 100,
    profit: 150,
  },
  shopBlocks: [
    { id: 's1', level: 1, incomePerHit: 35, x: 0, y: 0 },
    { id: 's2', level: 1, incomePerHit: 35, x: 0, y: 0 },
    { id: 's3', level: 1, incomePerHit: 35, x: 0, y: 0 },
  ],
  fieldLayout: null,
  setFieldLayout: (layout) => set({ fieldLayout: layout }),
  refreshShop: () => set({
    shopBlocks: [
      { id: 's' + Date.now(), level: 1, incomePerHit: 35, x: 0, y: 0 },
      { id: 's' + (Date.now() + 1), level: 1, incomePerHit: 35, x: 0, y: 0 },
      { id: 's' + (Date.now() + 2), level: 1, incomePerHit: 35, x: 0, y: 0 },
    ],
  }),
  placeBlockFromShop: (id, dropX, dropY) => {
    console.log('placeBlockFromShop called:', { id, dropX, dropY });
    const { shopBlocks, blocksOnField, fieldLayout } = get();
    console.log('Current state:', { shopBlocksCount: shopBlocks.length, blocksOnFieldCount: blocksOnField.length, fieldLayout });
    
    if (!fieldLayout) {
      console.log('No field layout - field not measured yet');
      return;
    }
    
    const inside =
      dropX >= fieldLayout.x &&
      dropY >= fieldLayout.y &&
      dropX <= fieldLayout.x + fieldLayout.width &&
      dropY <= fieldLayout.y + fieldLayout.height;
    
    console.log('Drop position check:', { 
      dropX, 
      dropY, 
      fieldBounds: { x: fieldLayout.x, y: fieldLayout.y, width: fieldLayout.width, height: fieldLayout.height },
      inside 
    });
    
    if (!inside) {
      console.log('Drop outside field bounds');
      return;
    }
    
    const relX = dropX - fieldLayout.x;
    const relY = dropY - fieldLayout.y;
    
    const picked = shopBlocks.find((b) => b.id === id);
    if (!picked) {
      console.log('Block not found in shop, available blocks:', shopBlocks.map(b => b.id));
      return;
    }
    
    const remaining = shopBlocks.filter((b) => b.id !== id);
    
    // Block dimensions
    const blockWidth = 120;
    const blockHeight = 50;
    
    // Calculate block position with boundary constraints
    const margin = 5; // Small margin from edges
    const newX = Math.max(margin, Math.min(fieldLayout.width - blockWidth - margin, relX - blockWidth / 2));
    const newY = Math.max(margin, Math.min(fieldLayout.height - blockHeight - margin, relY - blockHeight / 2));
    
    // Check for collision with existing blocks
    let hasCollision = false;
    for (const existing of blocksOnField) {
      const existingRight = existing.x + blockWidth;
      const existingBottom = existing.y + blockHeight;
      const newRight = newX + blockWidth;
      const newBottom = newY + blockHeight;
      
      if (newX < existingRight && newRight > existing.x && newY < existingBottom && newBottom > existing.y) {
        hasCollision = true;
        break;
      }
    }
    
    if (hasCollision) {
      console.log('Block would overlap with existing block');
      console.log('Placement blocked due to collision');
      return;
    }
    
    const newBlock: MoneyBlock = {
      id: 'f' + Date.now(),
      level: picked.level,
      incomePerHit: picked.incomePerHit,
      x: newX,
      y: newY,
    };
    console.log('Block placed successfully:', newBlock.id);
    set({ shopBlocks: remaining, blocksOnField: [...blocksOnField, newBlock] });
    // auto-merge if placed near same-level block
    get().tryMergeAt(newBlock.id);
  },
  tryMergeAt: (blockId) => {
    const { blocksOnField } = get();
    const idx = blocksOnField.findIndex((b) => b.id === blockId);
    if (idx < 0) return;
    const me = blocksOnField[idx];
    
    // Block dimensions
    const blockWidth = 120;
    const blockHeight = 50;
    
    // Find adjacent blocks of the same level (touching or very close)
    const targetIdx = blocksOnField.findIndex((b, i) => {
      if (i === idx || b.level !== me.level) return false;
      
      const myLeft = me.x;
      const myRight = me.x + blockWidth;
      const myTop = me.y;
      const myBottom = me.y + blockHeight;
      
      const otherLeft = b.x;
      const otherRight = b.x + blockWidth;
      const otherTop = b.y;
      const otherBottom = b.y + blockHeight;
      
      // Check if blocks are touching or very close (within 8px to allow for small gaps)
      const margin = 8;
      const horizontallyAdjacent = 
        (Math.abs(myLeft - otherRight) <= margin || Math.abs(myRight - otherLeft) <= margin) &&
        (myTop < otherBottom && myBottom > otherTop); // Overlapping in Y axis
      
      const verticallyAdjacent = 
        (Math.abs(myTop - otherBottom) <= margin || Math.abs(myBottom - otherTop) <= margin) &&
        (myLeft < otherRight && myRight > otherLeft); // Overlapping in X axis
      
      return horizontallyAdjacent || verticallyAdjacent;
    });
    
    if (targetIdx >= 0) {
      const target = blocksOnField[targetIdx];
      // Create merged block at the target's position
      const merged = { 
        ...target, 
        level: target.level + 1, 
        incomePerHit: Math.round(target.incomePerHit * 2) 
      };
      const next = blocksOnField.filter((b, i) => i !== idx && i !== targetIdx);
      next.push(merged);
      set({ blocksOnField: next });
    }
  },
  addBalance: (amount: number) => set((s) => ({ balance: s.balance + amount, collectedAmount: s.collectedAmount + amount })),
  spend: (amount: number) => {
    const { balance } = get();
    if (balance < amount) return false;
    set({ balance: balance - amount });
    return true;
  },
  setBalls: (balls) => set({ balls }),
  setGameRunning: (running) => set({ gameRunning: running }),
  victoryShown: false,
  setVictoryShown: (v) => set({ victoryShown: v }),
  setLevelCompletePopup: (show) => set({ showLevelCompletePopup: show }),
  nextLevel: () => set((s) => {
    // Create new balls for the new level
    const newBalls = Array.from({ length: s.ballCount || 1 }, (_, i) => ({
      id: 'ball-' + Date.now() + '-' + i,
      x: 160 + (i % 2 === 0 ? -20 : 20), // FIELD_WIDTH / 2
      y: 120, // FIELD_HEIGHT - 100
      vx: (Math.random() > 0.5 ? 1 : -1) * (100 + Math.random() * 80),
      vy: -(100 + Math.random() * 80),
    }));
    
    return {
      level: s.level + 1,
      collectedAmount: 0,
      levelTargetAmount: Math.round(s.levelTargetAmount * 1.25),
      victoryShown: false,
      balls: newBalls,
      gameRunning: false, // Reset game running state for new level
    };
  }),
  resetAll: () => set(() => ({
    balance: DEFAULT_BALANCE,
    collectedAmount: 0,
    level: 1,
    levelTargetAmount: 1000,
    blocksOnField: [],
    balls: [],
    ballCount: 0,
    profitMultiplier: 1,
    upgradeCosts: { moneyBlock: 50, ball: 100, profit: 150 },
    victoryShown: false,
    shopBlocks: [],
    gameRunning: false,
  })),
  clearField: () => set(() => ({
    blocksOnField: [],
    balls: [],
    gameRunning: false, // Reset game running state when clearing field
  })),
  upgradeMoneyBlocks: () => set((s) => {
    if (!s.spend(s.upgradeCosts.moneyBlock)) return {};
    return {
      blocksOnField: s.blocksOnField.map(b => ({ ...b, incomePerHit: b.incomePerHit + 10 })),
      upgradeCosts: { ...s.upgradeCosts, moneyBlock: s.upgradeCosts.moneyBlock * 1.5 },
    };
  }),
  upgradeAddBall: () => set((s) => {
    if (!s.spend(s.upgradeCosts.ball)) return {};
    const newBallId = 'ball' + Date.now();
    return {
      balls: [...s.balls, { id: newBallId, x: 30, y: 150, vx: 120, vy: 140 }],
      ballCount: s.ballCount + 1,
      upgradeCosts: { ...s.upgradeCosts, ball: s.upgradeCosts.ball * 2 },
    };
  }),
  upgradeProfitMultiplier: () => set((s) => {
    if (!s.spend(s.upgradeCosts.profit)) return {};
    return {
      profitMultiplier: s.profitMultiplier + 0.1,
      upgradeCosts: { ...s.upgradeCosts, profit: s.upgradeCosts.profit * 1.75 },
    };
  }),
}));

export default useGameStore;
