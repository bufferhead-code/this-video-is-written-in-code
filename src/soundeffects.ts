import { sound } from '@motion-canvas/core';

import whooshSound from './sounds/whoosh_soft.mp3';
import zoomInSound from './sounds/zoom_in.mp3';
import typewriterSound from './sounds/typewriter.mp3';
import errorSound from './sounds/error.mp3';
import highlighterSound from './sounds/highlighter.mp3';

export interface SoundEffectConfig {
  gain?: number;
  trimStart?: number;
  trimEnd?: number;
}

export interface AnimationSoundConfig extends SoundEffectConfig {
  duration?: number;
}

/**
 * Sound Effects for Motion Canvas
 * Provides centralized sound effect management with consistent settings
 */
export class SoundEffects {
  // Default configurations
  private static readonly DEFAULT_GAIN = -15;
  private static readonly DEFAULT_TRIM_START = 0;

  /**
   * WHOOSH SOUND EFFECTS
   */

  // Play whoosh sound for slide animations
  public static playWhoosh(config: AnimationSoundConfig = {}) {
    const whooshAudio = this.createWhooshSound(config);
    if (whooshAudio) {
      whooshAudio.play();
    }
    return whooshAudio;
  }

  // Create whoosh sound instance without playing (for repeated use)
  public static createWhooshSound(config: AnimationSoundConfig = {}) {
    const {
      gain = this.DEFAULT_GAIN,
      trimStart = this.DEFAULT_TRIM_START,
      trimEnd = config.duration || 0.5,
    } = config;

    try {
      const whooshAudio = sound(whooshSound);
      whooshAudio.gain(gain);
      whooshAudio.trim(trimStart, trimEnd);
      return whooshAudio;
    } catch (error) {
      console.warn('Failed to create whoosh sound:', error);
      return null;
    }
  }

  /**
   * ZOOM SOUND EFFECTS
   */

  // Play zoom in sound for zoom animations
  public static playZoomIn(config: AnimationSoundConfig = {}) {
    const zoomAudio = this.createZoomInSound(config);
    if (zoomAudio) {
      zoomAudio.play();
    }
    return zoomAudio;
  }

  // Create zoom in sound instance without playing (for repeated use)
  public static createZoomInSound(config: AnimationSoundConfig = {}) {
    const {
      gain = -20,
      trimStart = 0.5,
      trimEnd = config.duration || 0.5,
    } = config;

    try {
      const zoomAudio = sound(zoomInSound);
      zoomAudio.gain(gain);
      zoomAudio.trim(trimStart, trimEnd);
      return zoomAudio;
    } catch (error) {
      console.warn('Failed to create zoom in sound:', error);
      return null;
    }
  }

  /**
   * TYPEWRITER SOUND EFFECTS
   */

  // Play typewriter sound for text animations
  public static playTypewriter(config: SoundEffectConfig = {}) {
    const typewriterAudio = this.createTypewriterSound(config);
    if (typewriterAudio) {
      typewriterAudio.play();
    }
    return typewriterAudio;
  }

  // Create typewriter sound instance without playing (for repeated use)
  public static createTypewriterSound(config: SoundEffectConfig = {}) {
    const {
      gain = -10, // Typewriter typically uses 0 gain
      trimStart = 0.2,
      trimEnd = 1,
    } = config;

    try {
      const typewriterAudio = sound(typewriterSound);
      typewriterAudio.gain(gain);
      typewriterAudio.trim(trimStart, trimEnd);
      return typewriterAudio;
    } catch (error) {
      console.warn('Failed to create typewriter sound:', error);
      return null;
    }
  }

  /**
   * HIGHLIGHTER SOUND EFFECTS
   */

  // Play highlighter sound for highlighting animations
  public static playHighlighter(config: SoundEffectConfig = {}) {
    const highlighterAudio = this.createHighlighterSound(config);
    if (highlighterAudio) {
      highlighterAudio.play();
    }
    return highlighterAudio;
  }

  // Create highlighter sound instance without playing (for repeated use)
  public static createHighlighterSound(config: SoundEffectConfig = {}) {
    const {
      gain = -20, // Highlighter sound typically uses -20 gain
      trimStart = this.DEFAULT_TRIM_START,
      trimEnd = 1,
    } = config;

    try {
      const highlighterAudio = sound(highlighterSound);
      highlighterAudio.gain(gain);
      highlighterAudio.trim(trimStart, trimEnd);
      return highlighterAudio;
    } catch (error) {
      console.warn('Failed to create highlighter sound:', error);
      return null;
    }
  }

  /**
   * ERROR SOUND EFFECTS
   */

  // Play error sound for error notifications
  public static playError(config: SoundEffectConfig = {}) {
    const errorAudio = this.createErrorSound(config);
    if (errorAudio) {
      errorAudio.play();
    }
    return errorAudio;
  }

  // Create error sound instance without playing (for repeated use)
  public static createErrorSound(config: SoundEffectConfig = {}) {
    const {
      gain = -25, // Error sound typically uses -15 gain
      trimStart = this.DEFAULT_TRIM_START,
      trimEnd = 0.4,
    } = config;

    try {
      const errorAudio = sound(errorSound);
      errorAudio.gain(gain);
      errorAudio.trim(trimStart, trimEnd);
      return errorAudio;
    } catch (error) {
      console.warn('Failed to create error sound:', error);
      return null;
    }
  }

  /**
   * UTILITY METHODS
   */

  // Create a sound instance without playing it
  public static createSound(soundFile: any, config: SoundEffectConfig = {}) {
    const {
      gain = this.DEFAULT_GAIN,
      trimStart = this.DEFAULT_TRIM_START,
      trimEnd = 1,
    } = config;

    try {
      const audio = sound(soundFile);
      audio.gain(gain);
      audio.trim(trimStart, trimEnd);
      return audio;
    } catch (error) {
      console.warn('Failed to create sound:', error);
      return null;
    }
  }

  // Play a custom sound with configuration
  public static playCustomSound(soundFile: any, config: SoundEffectConfig = {}) {
    const audio = this.createSound(soundFile, config);
    if (audio) {
      audio.play();
    }
    return audio;
  }

  // Stop all sounds (if needed)
  public static stopAllSounds() {
    // Note: This is a placeholder as Motion Canvas doesn't have a direct stopAll method
    // Individual sound instances would need to be tracked and stopped
    console.log('Stop all sounds - implement if needed');
  }
}

/**
 * Quick access sound effect functions (shorthand)
 */

// Whoosh sound shortcuts
export const playWhoosh = (config?: AnimationSoundConfig) =>
  SoundEffects.playWhoosh(config);

export const whoosh = (config?: AnimationSoundConfig) =>
  SoundEffects.playWhoosh(config);

export const createWhooshSound = (config?: AnimationSoundConfig) =>
  SoundEffects.createWhooshSound(config);

// Zoom sound shortcuts
export const playZoomIn = (config?: AnimationSoundConfig) =>
  SoundEffects.playZoomIn(config);

export const zoomIn = (config?: AnimationSoundConfig) =>
  SoundEffects.playZoomIn(config);

export const createZoomInSound = (config?: AnimationSoundConfig) =>
  SoundEffects.createZoomInSound(config);

// Typewriter sound shortcuts
export const playTypewriter = (config?: SoundEffectConfig) =>
  SoundEffects.playTypewriter(config);

export const typewriter = (config?: SoundEffectConfig) =>
  SoundEffects.playTypewriter(config);

export const createTypewriterSound = (config?: SoundEffectConfig) =>
  SoundEffects.createTypewriterSound(config);

// Error sound shortcuts
export const playError = (config?: SoundEffectConfig) =>
  SoundEffects.playError(config);

export const error = (config?: SoundEffectConfig) =>
  SoundEffects.playError(config);

export const createErrorSound = (config?: SoundEffectConfig) =>
  SoundEffects.createErrorSound(config);

// Highlighter sound shortcuts
export const playHighlighter = (config?: SoundEffectConfig) =>
  SoundEffects.playHighlighter(config);

export const highlighter = (config?: SoundEffectConfig) =>
  SoundEffects.playHighlighter(config);

export const createHighlighterSound = (config?: SoundEffectConfig) =>
  SoundEffects.createHighlighterSound(config);

// Custom sound shortcuts
export const playSound = (soundFile: any, config?: SoundEffectConfig) =>
  SoundEffects.playCustomSound(soundFile, config);

export const createSound = (soundFile: any, config?: SoundEffectConfig) =>
  SoundEffects.createSound(soundFile, config); 