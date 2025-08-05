import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Layout, Rect, Txt, Code } from '@motion-canvas/2d/lib/components';
import { CodeCard } from '../components/CodeCard';
import { NodeTree } from '../components/NodeTree';
import { MacWindow } from '../components/MacWindow';
import { Terminal } from '../components/Terminal';
import { DynamicColumnLayout } from '../components/DynamicColumnLayout';
import { waitFor, all, waitUntil, fadeTransition } from '@motion-canvas/core';
import { fadeIn, slideInLeft, slideInRight, zoomIn, fadeOut, slideInBottom } from '../animation';
import { MacTerminalWindow } from '../components/MacTerminalWindow';
import { MacOSBackground } from '../components/MacOSBackground';
import { Browser } from '../components/Browser';
import motionCanvasEditor from '../images/motion_canvas_editor.jpeg';

export default  makeScene2D(function* (view) {
  // Create macOS background
  const macBackground = new MacOSBackground({
    showMenuBar: false,
    showDock: false,
  });

  // Add background to view
  view.add(macBackground);

  yield* fadeTransition(1);

  // ==================== PART 1: Terminal/Motion Canvas Init ====================
  
  // Create the MacTerminalWindow
  const macTerminalWindow = new MacTerminalWindow({
    title: 'Terminal',
    width: 500,
    height: 200,
    scale: 0,
    opacity: 0,
    terminalFontSize: 20,
    // You can add more Terminal props if needed
  });

  // Add window to view
  view.add(macTerminalWindow);

  yield* waitUntil('terminal_appear');

  // Animate the window zooming in
  yield* zoomIn(macTerminalWindow, { duration: 1, toScale: 2 });

  // Wait a moment before starting to type
  yield* waitUntil('npm_command');

  // Type the npm init command with typewriter effect
  yield* macTerminalWindow.getTerminal().typeCommandWithCursor('npm init @motion-canvas@latest', 2, 0, 2);

  // Wait for a moment
  yield* waitUntil('terminal_fade');

  // Fade out terminal
  yield* fadeOut(macTerminalWindow, { duration: 1 });

  // ==================== TRANSITION ====================
  
  yield* waitUntil('show_editor');

  // ==================== PART 1.5: Browser with Motion Canvas Editor ====================
  
  // Create Browser component with motion canvas editor screenshot
  const browser = new Browser({
    url: 'http://localhost:9000',
    width: 1700,
    height: 900,
    opacity: 0,
    y: -40,
    screenshotSrc: motionCanvasEditor,
    darkMode: true,
  });

  // Add browser to view
  view.add(browser);

  // Animate browser sliding in from bottom
  yield* slideInBottom(browser, { duration: 1.5, distance: 200 });

  // Wait for a moment to show the browser
  yield* waitUntil('editor_fade');

  // Fade out browser
  yield* fadeOut(browser, { duration: 1 });

  yield* waitUntil('node_tree_start');

  // ==================== PART 2: Node Tree Example ====================
  
  // Create main layout container for NodeTree section using DynamicColumnLayout
  const nodeTreeLayout = new Layout({
    width: '100%',
    height: '100%',
    direction: 'row',
    layout: true,
    gap: 40,
    justifyContent: 'center',
    alignItems: 'start',
    padding: 50,
  });

  // Left side container
  const leftSideContainer = new Layout({
    layout: true,
    direction: 'column',
    width: 800,
    height: 1500,
    gap: 30,
    justifyContent: 'center',
    alignItems: 'center',
  });

  // Left side - HTML DOM Tree structure
  const leftSide = new Rect({
    layout: true,
    direction: 'column',
    width: 800,
    height: 1500,
    fill: '#2d2d2f',
    radius: 10,
    padding: 40,
    opacity: 0,
  });

  // Add DOM title
  const domTitle = new Txt({
    text: 'DOM',
    fontSize: 64,
    fontWeight: 700,
    fill: '#ffffff',
    fontFamily: '"Baloo 2", "Baloo", Arial, sans-serif',
    shadowColor: '#000000',
    shadowBlur: 40,
    shadowOffset: [2, 2],
  });
  leftSideContainer.add(domTitle);

  // HTML DOM node tree structure
  const htmlTreeStructure = [
    {
      name: 'html',
      type: 'element' as const,
      children: [
        {
          name: 'head',
          type: 'element' as const,
          children: [
            { name: 'title', type: 'element' as const },
            { name: 'meta', type: 'element' as const },
          ],
        },
        {
          name: 'body',
          type: 'element' as const,
          children: [
            {
              name: 'header',
              type: 'element' as const,
              children: [
                { name: 'nav', type: 'element' as const },
              ],
            },
            {
              name: 'main',
              type: 'element' as const,
              children: [
                { name: 'section', type: 'element' as const },
                { name: 'footer', type: 'element' as const },
              ],
            },
          ],
        },
      ],
    },
  ];

  const htmlTree = new NodeTree({
    structure: htmlTreeStructure,
    elementColor: '#4fc3f7',
    textColor: '#95a5a6',
    labelColor: '#ffffff',
    textSize: 40,
    rowSize: 80,
    indentAmount: 80,
  });
  leftSide.add(htmlTree);
  leftSideContainer.add(leftSide);

  // Right side container
  const rightSideContainer = new Layout({
    layout: true,
    direction: 'column',
    width: 800,
    height: 1500,
    gap: 30,
    justifyContent: 'center',
    alignItems: 'center',
  });

  // Right side - Motion Canvas Component Tree
  const rightSide = new Rect({
    layout: true,
    direction: 'column',
    width: 800,
    height: 1500,
    fill: '#2d2d2f',
    radius: 10,
    padding: 40,
    opacity: 0,
  });

  // Add Motion Canvas title
  const motionCanvasTitle = new Txt({
    text: 'Motion Canvas',
    fontSize: 64,
    fontWeight: 700,
    fill: '#ffffff',
    fontFamily: '"Baloo 2", "Baloo", Arial, sans-serif',
    shadowColor: '#000000',
    shadowBlur: 40,
    shadowOffset: [2, 2],
  });
  rightSideContainer.add(motionCanvasTitle);
  

  // Motion Canvas component node tree structure
  const sceneTreeStructure = [
    {
      name: 'View2D',
      type: 'element' as const,
      children: [
        {
          name: 'Layout',
          type: 'element' as const,
          children: [
            { name: 'Circle', type: 'element' as const },
            { name: 'Txt', type: 'element' as const },
          ],
        },
        {
          name: 'Rect',
          type: 'element' as const,
          children: [
            { name: 'Code', type: 'element' as const },
            { name: 'Polygon', type: 'element' as const },
          ],
        },
      ],
    },
  ];

  const sceneTree = new NodeTree({
    structure: sceneTreeStructure,
    elementColor: '#ff6b6b',
    textColor: '#95a5a6',
    labelColor: '#ffffff',
    textSize: 40,
    rowSize: 80,
    indentAmount: 80,
  });
  rightSide.add(sceneTree);
  rightSideContainer.add(rightSide);

  // Add nodeTree layout to view
  view.add(nodeTreeLayout);

  // ==================== PART 2 ANIMATION: NodeTree Demo ====================
  
  yield* waitUntil('dom_tree_card');

  // Add DOM tree card first using DynamicColumnLayout
  nodeTreeLayout.add(leftSideContainer),
  nodeTreeLayout.add(rightSideContainer),

  yield* all(
    fadeIn(leftSideContainer),
    fadeIn(rightSideContainer),
  );
    
  yield* waitUntil('dom_tree_fade');


  yield* all(
    fadeIn(leftSide),
    fadeIn(rightSide),
  );

  yield* all(
    htmlTree.fadeInSequentially(0.2, 0),
    sceneTree.fadeInSequentially(0.2, 0),
  );

  yield* waitUntil('trees_fade_out');

  // Fade out the DOM trees
  yield* fadeOut(nodeTreeLayout, { duration: 1 });

  yield* waitUntil('jsx_example');

  // ==================== PART 3: Code Examples ====================
  
  // Create main layout for code examples using DynamicColumnLayout
  const codeLayout = new DynamicColumnLayout({
    width: '100%',
    y: 70,
    height: 1000,
    itemGap: 60,
  });

  // JSX Example Section as Rect for DynamicColumnLayout
  const jsxSection = new Rect({
    layout: true,
    direction: 'column',
    gap: 30,
    alignItems: 'center',
  });

  const jsxTitle = new Txt({
    text: 'With JSX',
    fontSize: 60,
    shadowBlur: 50,
    shadowOffset: [2, 2],
    shadowColor: '#000000',
    fontWeight: 700,
    fill: '#ffffff',
    fontFamily: '"Baloo 2", "Baloo", Arial, sans-serif',
  });

  const jsxCodeContainer = new Rect({
  });

  const jsxCodeBlock = CodeCard({
    code: `{/* JSX */}
<Layout direction="column" gap={20}>
  <Txt fontSize={48} fill="#ffffff">
    Hello Motion Canvas
  </Txt>
  <Rect width={200} height={200} fill="#4fc3f7">
    <Circle size={100} fill="#ff6b6b" />
    <Polygon
      sides={6}
      size={80}
      fill="#4ecdc4"
      position={[0, -30]}
    />
  </Rect>
</Layout>`,
    fontSize: 30,
  });

  jsxCodeContainer.add(jsxCodeBlock);
  jsxSection.add(jsxTitle);
  jsxSection.add(jsxCodeContainer);

  // Non-JSX Example Section as Rect for DynamicColumnLayout
  const nonJsxSection = new Rect({
    layout: true,
    direction: 'column',
    gap: 20,
    alignItems: 'center',
  });

  const nonJsxTitle = new Txt({
    text: 'Without JSX',
    fontSize: 60,
    shadowBlur: 50,
    shadowOffset: [2, 2],
    shadowColor: '#000000',
    fontWeight: 700,
    fill: '#ffffff',
    fontFamily: '"Baloo 2", "Baloo", Arial, sans-serif',
  });

  const nonJsxCodeContainer = new Rect({
  });

  const nonJsxCodeBlock = CodeCard({
    code: `// No JSX
view.add([
  new Circle({
    size: 100,
    fill: '#ff6b6b',
  }),
  new Layout({
    children: [
      new Rect({
        width: 200,
        height: 200,
        fill: '#4fc3f7',
      }),
      new Txt({
        text: 'Hello Motion Canvas',
        fontSize: 32,
        fill: '#ffffff',
      }),
    ],
  }),
]);`,
    fontSize: 30,
  });

  nonJsxCodeContainer.add(nonJsxCodeBlock);
  nonJsxSection.add(nonJsxTitle);
  nonJsxSection.add(nonJsxCodeContainer);

  // Add to view
  view.add(codeLayout);

  // ==================== PART 3 ANIMATION: Code Examples ====================
  
  // Use DynamicColumnLayout to animate the code blocks appearing
  yield* codeLayout.addItem(jsxSection, 940);
  
  yield* waitUntil('no_jsx_example');
  
  yield* codeLayout.addItem(nonJsxSection, 722);

  yield* waitUntil('jsx_fade_out');

  // Final fade out
  yield* fadeOut(codeLayout, { duration: 1 });

  yield* waitUntil('scene_end');
});