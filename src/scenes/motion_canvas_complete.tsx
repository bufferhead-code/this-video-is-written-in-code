import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Layout, Rect, Txt, Code } from '@motion-canvas/2d/lib/components';
import { NodeTree } from '../components/NodeTree';
import { MacWindow } from '../components/MacWindow';
import { Terminal } from '../components/Terminal';
import { DynamicColumnLayout } from '../components/DynamicColumnLayout';
import { waitFor, all } from '@motion-canvas/core';
import { fadeIn, slideInLeft, slideInRight, zoomIn, fadeOut, slideInBottom } from '../animation';
import { MacTerminalWindow } from '../components/MacTerminalWindow';
import { MacOSBackground } from '../components/MacOSBackground';
import { Browser } from '../components/Browser';
import motionCanvasEditor from '../images/motion_canvas_editor.jpeg';

export default makeScene2D(function* (view) {
  // Create macOS background
  const macBackground = new MacOSBackground({
    showMenuBar: false,
    showDock: false,
  });

  // Add background to view
  view.add(macBackground);

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

  yield* waitFor(0.5);

  // Animate the window zooming in
  yield* zoomIn(macTerminalWindow, { duration: 1, toScale: 2 });

  // Wait a moment before starting to type
  yield* waitFor(0.5);

  // Type the npm init command with typewriter effect
  yield* macTerminalWindow.getTerminal().typeCommandWithCursor('npm init @motion-canvas@latest', 2, 0, 2);

  // Wait for a moment
  yield* waitFor(1.5);

  // Fade out terminal
  yield* fadeOut(macTerminalWindow, { duration: 1 });

  // ==================== TRANSITION ====================
  
  yield* waitFor(0.5);

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
  yield* waitFor(2);

  // Fade out browser
  yield* fadeOut(browser, { duration: 1 });

  yield* waitFor(0.5);

  // ==================== PART 2: Node Tree Example ====================
  
  // Create main layout container for NodeTree section
  const nodeTreeLayout = new Layout({
    layout: true,
    direction: 'row',
    width: '100%',
    height: '100%',
    gap: 40,
    justifyContent: 'center',
    alignItems: 'start',
    paddingTop: 50,
  });

  // Left side - HTML DOM Tree structure
  const leftSide = new Layout({
    layout: true,
    direction: 'column',
    width: 800,
    gap: 20,
  });



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

  const leftTitle = new Txt({
    text: 'HTML Binary Tree',
    fontSize: 40,
    fontWeight: 700,
    fill: '#ffffff',
    fontFamily: '"Baloo 2", "Baloo", Arial, sans-serif',
    opacity: 0,
  });
  leftSide.add(leftTitle);

  const leftContainer = new Rect({
    layout: true,
    direction: 'column',
    width: '100%',
    height: 1500,
    fill: '#2d2d2f',
    radius: 10,
    padding: 40,
    opacity: 0,
  });
  leftSide.add(leftContainer);

  const htmlTree = new NodeTree({
    structure: htmlTreeStructure,
    elementColor: '#4fc3f7',
    textColor: '#95a5a6',
    labelColor: '#ffffff',
    textSize: 32,
    rowSize: 48,
  });
  leftContainer.add(htmlTree);

  // Right side - Motion Canvas Component Tree
  const rightSide = new Layout({
    layout: true,
    direction: 'column',
    width: 800,
    gap: 20,
  });



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

  const rightTitle = new Txt({
    text: 'Component Binary Tree',
    fontSize: 40,
    fontWeight: 700,
    fill: '#ffffff',
    fontFamily: '"Baloo 2", "Baloo", Arial, sans-serif',
    opacity: 0,
  });
  rightSide.add(rightTitle);

  const rightContainer = new Rect({
    layout: true,
    direction: 'column',
    width: '100%',
    height: 1500,
    fill: '#2d2d2f',
    radius: 10,
    padding: 40,
    opacity: 0,
  });
  rightSide.add(rightContainer);

  const sceneTree = new NodeTree({
    structure: sceneTreeStructure,
    elementColor: '#ff6b6b',
    textColor: '#95a5a6',
    labelColor: '#ffffff',
    textSize: 32,
    rowSize: 48,
  });
  rightContainer.add(sceneTree);

  // Add sides to nodeTree layout
  nodeTreeLayout.add(leftSide);
  nodeTreeLayout.add(rightSide);

  // Add nodeTree layout to view
  view.add(nodeTreeLayout);

  // ==================== PART 2 ANIMATION: NodeTree Demo ====================
  
  yield* waitFor(0.5);

  // Animate titles in
  yield* all(
    fadeIn(leftTitle, { duration: 0.8 }),
    fadeIn(rightTitle, { duration: 0.8 }),
  );

  yield* waitFor(0.3);

  // Animate containers sliding in
  yield* all(
    slideInLeft(leftContainer, { duration: 1, distance: 100 }),
    slideInRight(rightContainer, { duration: 1, distance: 100 }),
  );

  yield* waitFor(0.5);

  // Sequential fade-in animations - DOM tree first, then Motion Canvas tree
  yield* htmlTree.fadeInSequentially(0.2, 0.1);
  
  yield* waitFor(0.3);
  
  yield* sceneTree.fadeInSequentially(0.2, 0.1);

  yield* waitFor(2);

  // Fade out the DOM trees
  yield* fadeOut(nodeTreeLayout, { duration: 1 });

  yield* waitFor(0.5);

  // ==================== PART 3: Code Examples ====================
  
  // Create main layout for code examples using DynamicColumnLayout
  const codeLayout = new DynamicColumnLayout({
    width: '100%',
    y: 100,
    height: 1000,
    itemGap: 200,
  });

  // JSX Example Section as Rect for DynamicColumnLayout
  const jsxSection = new Rect({
    layout: true,
    direction: 'column',
    gap: 20,
    alignItems: 'center',
  });

  const jsxTitle = new Txt({
    text: 'Motion Canvas with JSX',
    fontSize: 40,
    fontWeight: 700,
    fill: '#ffffff',
    fontFamily: '"Baloo 2", "Baloo", Arial, sans-serif',
  });

  const jsxCodeContainer = new Rect({
    fill: '#1e1e1e',
    radius: 10,
    padding: 30,
  });

  const jsxCodeBlock = new Code({
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
    fontSize: 24,
    fontFamily: 'JetBrains Mono, Consolas, monospace',
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
    text: 'Motion Canvas without JSX',
    fontSize: 40,
    fontWeight: 700,
    fill: '#ffffff',
    fontFamily: '"Baloo 2", "Baloo", Arial, sans-serif',
  });

  const nonJsxCodeContainer = new Rect({
    fill: '#1e1e1e',
    radius: 10,
    padding: 30,
  });

  const nonJsxCodeBlock = new Code({
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
    fontSize: 24,
    fontFamily: 'JetBrains Mono, Consolas, monospace',
  });

  nonJsxCodeContainer.add(nonJsxCodeBlock);
  nonJsxSection.add(nonJsxTitle);
  nonJsxSection.add(nonJsxCodeContainer);

  // Add to view
  view.add(codeLayout);

  // ==================== PART 3 ANIMATION: Code Examples ====================
  
  // Use DynamicColumnLayout to animate the code blocks appearing
  yield* codeLayout.addItem(jsxSection, 580);
  
  yield* waitFor(0.5);
  
  yield* codeLayout.addItem(nonJsxSection, 580);

  yield* waitFor(3);

  // Final fade out
  yield* fadeOut(codeLayout, { duration: 1 });

  yield* waitFor(0.5);
});