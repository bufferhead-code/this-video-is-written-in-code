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
import positionDemo from './scenes/08_position_demo?scene';
import positioningExplanation from './scenes/09_positioning_explanation?scene';
import layoutsShowcase from './scenes/10_layouts_showcase?scene';
import animationGenerators from './scenes/09_animation_generators?scene';
import motionCanvasGenerator from './scenes/motion_canvas_generator?scene';
import motionCanvasComplete from './scenes/motion_canvas_complete?scene';
import manimPython from './scenes/07_manim_python?scene';
import loadingBars from './scenes/loading_bars?scene';
import motionCanvasSceneSection from './scenes/motion_canvas_scene_section?scene';
import scriptEditor from './script-editor';
import './global.css';
import audio from '../audio/voiceover.mp3';
import generatorsShowcase from './scenes/10_generators_showcase?scene';
import crashCourseBanner from './scenes/crash_course_banner?scene';
import logoSpeechBubble from './scenes/11_logo_speech_bubble?scene';
import motionCanvasDocsScroll from './scenes/motion_canvas_docs_scroll?scene';
import timeEventsZoom from './scenes/time_events_zoom?scene';
import timeEventsExplanation from './scenes/time_events_explanation?scene';
import signalsDemo from './scenes/signals_demo?scene';
import circleAreaExample from './scenes/circle_area_example?scene';
import logoZoomDemo from './scenes/logo_zoom_demo?scene';
import doesItScaleMeme from './scenes/does_it_scale_meme?scene';

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
    motionCanvasGenerator,
    logoHexagon,
    motionCanvasComplete,
    motionCanvasSceneSection,
    positionDemo,
    positioningExplanation,
    layoutsShowcase,
    animationGenerators,
    generatorsShowcase,
    crashCourseBanner,
    logoSpeechBubble,
    motionCanvasDocsScroll,
    signalsDemo,
    circleAreaExample,
    timeEventsZoom,
    timeEventsExplanation,
    logoZoomDemo,
    doesItScaleMeme,
  ],
  experimentalFeatures: true,
  plugins: [scriptEditor],
  audio: audio,
});
