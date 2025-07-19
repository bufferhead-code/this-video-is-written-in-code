import { makeProject } from '@motion-canvas/core';
import premiereCrash from './scenes/01_premiere_crash?scene';
import timeForAChange from './scenes/02_time_for_a_change?scene';
import adobePricing from './scenes/03_adobe_pricing?scene';
import universityLoophole from './scenes/04_university_loophole?scene';
import theAlternatives from './scenes/05_the_alternatives?scene';
import codeAutomation from './scenes/06_code_automation?scene';
import programmaticVideoTools from './scenes/07_programmatic_video_tools?scene';
import motionCanvas from './scenes/08_motion_canvas?scene';
import logoHexagon from './scenes/08_logo_hexagon?scene';
import motionCanvasGenerator from './scenes/motion_canvas_generator?scene';
import manimPython from './scenes/07_manim_python?scene';
import loadingBars from './scenes/loading_bars?scene';
import testYoutubeCard from './scenes/test_youtube_card?scene';
import scriptEditor from './script-editor';
import './global.css';
import audio from '../audio/voiceover.mp3';

import { Code, LezerHighlighter } from '@motion-canvas/2d';
import { parser } from '@lezer/javascript';

Code.defaultHighlighter = new LezerHighlighter(
  // @ts-ignore
  parser.configure({
    // Provide a space-separated list of dialects to enable:
    dialect: 'jsx ts',
  }),
);

export default makeProject({
  scenes: [
    premiereCrash,
    adobePricing,
    theAlternatives,
    codeAutomation,
    programmaticVideoTools,
    motionCanvas,
    logoHexagon,
    motionCanvasGenerator,
    testYoutubeCard,
  ],
  experimentalFeatures: true,
  plugins: [scriptEditor],
  audio: audio,
});
