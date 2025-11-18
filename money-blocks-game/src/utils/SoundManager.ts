import { Audio } from 'expo-av';
import { Platform } from 'react-native';

class SoundManager {
  private dragSound: Audio.Sound | null = null;
  private dropSound: Audio.Sound | null = null;
  private bounceSound: Audio.Sound | null = null;
  private levelWinSound: Audio.Sound | null = null;
  private initialized = false;

  constructor() {
    this.initializeSounds();
  }

  private async initializeSounds() {
    console.log('SoundManager initializing...');
    
    try {
      // Load drop sound
      console.log('Loading drop.mp3...');
      const { sound: dropSound } = await Audio.Sound.createAsync(
        require('../../assets/game/drop.mp3')
      );
      
      // Load bounce sound
      console.log('Loading bouncy-ball.mp3...');
      const { sound: bounceSound } = await Audio.Sound.createAsync(
        require('../../assets/game/bouncy-ball.mp3')
      );
      
      // Load level win sound
      console.log('Loading level-win.mp3...');
      const { sound: levelWinSound } = await Audio.Sound.createAsync(
        require('../../assets/game/level-win.mp3')
      );
      
      this.dropSound = dropSound;
      this.dragSound = dropSound; // Use same sound for drag
      this.bounceSound = bounceSound;
      this.levelWinSound = levelWinSound;
      
      console.log('All sounds loaded successfully');
      this.initialized = true;
      
    } catch (error) {
      console.log('Failed to load sound:', error);
      this.initialized = true; // Still mark as initialized to allow console fallback
    }
  }

  async playDragSound() {
    if (!this.initialized) return;
    
    if (this.dragSound) {
      try {
        // Replay sound from beginning
        await this.dragSound.replayAsync();
        console.log('🎵 Drag sound played successfully');
      } catch (error) {
        console.log('Error playing drag sound:', error);
      }
    } else {
      console.log('🎵 Drag sound not loaded yet');
    }
  }

  async playDropSound() {
    if (!this.initialized) return;
    
    if (this.dropSound) {
      try {
        // Replay sound from beginning
        await this.dropSound.replayAsync();
        console.log('🎵 Drop sound played successfully');
      } catch (error) {
        console.log('Error playing drop sound:', error);
      }
    } else {
      console.log('🎵 Drop sound not loaded yet');
    }
  }

  async playBounceSound() {
    if (!this.initialized) return;
    
    if (this.bounceSound) {
      try {
        // Replay sound from beginning
        await this.bounceSound.replayAsync();
        console.log('🎵 Bounce sound played successfully');
      } catch (error) {
        console.log('Error playing bounce sound:', error);
      }
    } else {
      console.log('Bounce sound not loaded');
    }
  }

  async playLevelWinSound() {
    if (!this.initialized) return;
    
    if (this.levelWinSound) {
      try {
        // Replay sound from beginning
        await this.levelWinSound.replayAsync();
        console.log('🎵 Level win sound played successfully');
      } catch (error) {
        console.log('Error playing level win sound:', error);
      }
    } else {
      console.log('Level win sound not loaded');
    }
  }

  // For React Native, we can use the built-in sound capabilities
  async playSystemSound(type: 'drag' | 'drop' | 'bounce' | 'levelWin') {
    try {
      // Use system sounds or vibration as fallback
      if (type === 'drag') {
        console.log('🎵 Drag feedback');
        await this.playDragSound();
        // Light vibration for drag
        if (Platform.OS === 'android') {
          // For Android, you could use react-native-vibration
          // Vibration.vibrate(10);
        }
      } else if (type === 'drop') {
        console.log('🎵 Drop feedback');
        await this.playDropSound();
        // Stronger vibration for drop
        if (Platform.OS === 'android') {
          // For Android, you could use react-native-vibration
          // Vibration.vibrate(50);
        }
      } else if (type === 'bounce') {
        console.log('🎵 Bounce feedback');
        await this.playBounceSound();
        // Light vibration for bounce
        if (Platform.OS === 'android') {
          // For Android, you could use react-native-vibration
          // Vibration.vibrate(15);
        }
      } else if (type === 'levelWin') {
        console.log('🎵 Level win feedback');
        await this.playLevelWinSound();
        // Celebration vibration for level win
        if (Platform.OS === 'android') {
          // For Android, you could use react-native-vibration
          // Vibration.vibrate([100, 50, 100]);
        }
      }
    } catch (error) {
      console.log('Sound playback failed:', error);
    }
  }

  // Cleanup method
  async unload() {
    if (this.dropSound) {
      await this.dropSound.unloadAsync();
    }
    if (this.bounceSound) {
      await this.bounceSound.unloadAsync();
    }
    if (this.levelWinSound) {
      await this.levelWinSound.unloadAsync();
    }
  }
}

export default new SoundManager();
