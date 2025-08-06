# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Motion Canvas project that creates a video about transitioning from Adobe Premiere Pro to programmatic video creation. The project uses local Motion Canvas packages and includes sophisticated custom components for realistic macOS UI simulation.

## Development Commands

```bash
# Start development server with hot reload (typically runs on http://localhost:9000)
npm start

# Build project (TypeScript + Vite)
npm run build

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```
IMPORTANT: 
After applying changes check if the build process still works.

## Architecture

### Motion Canvas Framework

- Uses local Motion Canvas packages (linked from `../motion-canvas/packages/`)
- No React dependency - uses Motion Canvas 2D components and Preact for custom components
- Refer to https://motioncanvas.io/docs/ for Motion Canvas documentation

### Project Structure

- `src/project.ts` - Main project configuration defining scenes and plugins
- `src/scenes/` - Individual animation scenes (7 total)
- `src/components/` - Reusable components with comprehensive `.md` usage guides
- `src/animation.ts` - Animation preset library with professional easing functions
- `audio/` - Voiceover with word-level timestamps for synchronization
- `output/` - Rendered frames and final video

### Key Custom Components

**MacWindow** (`src/components/MacWindow.tsx`)

- macOS-style window with authentic traffic light controls
- Includes close, minimize, maximize interactions

**Browser** (`src/components/Browser.tsx`)

- Safari-style browser that takes real screenshots using Puppeteer
- Screenshots cached in `media/screenshots/`
- Can navigate to actual URLs and capture content

**TextMarker** (`src/components/TextMarker.tsx`)\*\*

- OCR-powered text detection and highlighting using Tesseract.js
- Automatically finds and animates text highlights in images

**StyledText** (`src/components/StyledText.tsx`)\*\*

- Fixed-width typewriter effect to prevent layout shifts
- Supports character-by-character reveals with sound effects

### Animation System

- `src/animation.ts` exports slide, fade, zoom, and overshoot animation presets
- Uses spring-based easing for professional motion feel
- All animations support customizable duration and easing

### Scene Management

Scenes are imported with `?scene` suffix and defined in `src/project.ts`. Current active scenes:

1. `01_premiere_crash` - Simulates Adobe Premiere crash
2. `03_adobe_pricing` - Adobe subscription pricing critique
3. `05_the_alternatives` - Alternative video editing tools
4. `06_code_automation` - Benefits of code-based automation
5. `07_manim_python` - Manim and Python discussion

### Code Animations

when doing Code animations look at https://motioncanvas.io/docs/code/ for reference

### Audio Integration

- Main voiceover: `audio/voiceover.mp3`
- Word-level timestamps for precise synchronization
- Sound effects: `src/sounds/error.mp3`, `src/sounds/typewriter.mp3`

### Development Notes

- Project uses local Motion Canvas packages for development
- Browser component requires internet connection for real screenshots
- OCR components may need time to process text detection
- Plugin system includes custom script editor for enhanced development experience
- No formal test suite - relies on live preview for validation

### Important Constraints

- DO NOT USE REACT - use Motion Canvas 2D components or Preact
- Browser screenshots are cached - delete `media/screenshots/` to refresh
- Audio synchronization requires precise timing adjustments in scene files
