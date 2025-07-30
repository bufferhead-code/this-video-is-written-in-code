import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Layout, Rect, Txt } from '@motion-canvas/2d/lib/components';
import { FileTree, FileTreeItem } from '../components/FileTree';
import { waitFor, all } from '@motion-canvas/core';
import { fadeIn, slideInLeft, slideInRight } from '../animation';

export default makeScene2D(function* (view) {
  // Add dark gray background
  view.fill('#1a1a1a');

  // Create main layout container
  const mainLayout = new Layout({
    layout: true,
    direction: 'row',
    width: '100%',
    height: '100%',
    gap: 40,
    justifyContent: 'center',
    alignItems: 'start',
    paddingTop: 50,
  });

  // Left side - DOM Tree structure
  const leftSide = new Layout({
    layout: true,
    direction: 'column',
    width: 400,
    gap: 20,
  });

  const leftTitle = new Txt({
    text: 'DOM Structure',
    fontSize: 24,
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
    height: 500,
    fill: '#2d2d2f',
    radius: 10,
    padding: 20,
    opacity: 0,
  });
  leftSide.add(leftContainer);

  // DOM tree structure
  const domStructure: FileTreeItem[] = [
    {
      name: 'html',
      type: 'folder',
      children: [
        {
          name: 'head',
          type: 'folder',
          children: [
            { name: 'title', type: 'file' },
            { name: 'meta', type: 'file' },
            { name: 'link', type: 'file' },
          ],
        },
        {
          name: 'body',
          type: 'folder',
          children: [
            {
              name: 'header',
              type: 'folder',
              children: [
                { name: 'nav', type: 'file' },
                { name: 'h1', type: 'file' },
              ],
            },
            {
              name: 'main',
              type: 'folder',
              children: [
                { name: 'section', type: 'file' },
                { name: 'article', type: 'file' },
                { name: 'div.container', type: 'file' },
              ],
            },
            {
              name: 'footer',
              type: 'folder',
              children: [
                { name: 'p', type: 'file' },
                { name: 'ul', type: 'file' },
              ],
            },
          ],
        },
      ],
    },
  ];

  const domTree = new FileTree({
    structure: domStructure,
    folderColor: '#e67e22',
    fileColor: '#3498db',
    labelColor: '#ecf0f1',
    textSize: 14,
    rowSize: 28,
    indentAmount: 24,
  });
  leftContainer.add(domTree);

  // Right side - Motion Canvas project structure
  const rightSide = new Layout({
    layout: true,
    direction: 'column',
    width: 400,
    gap: 20,
  });

  const rightTitle = new Txt({
    text: 'Motion Canvas Project',
    fontSize: 24,
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
    height: 500,
    fill: '#2d2d2f',
    radius: 10,
    padding: 20,
    opacity: 0,
  });
  rightSide.add(rightContainer);

  // Motion Canvas project structure
  const projectStructure: FileTreeItem[] = [
    {
      name: 'motion-canvas-project',
      type: 'folder',
      children: [
        {
          name: 'src',
          type: 'folder',
          children: [
            {
              name: 'scenes',
              type: 'folder',
              children: [
                { name: 'intro.tsx', type: 'file', extension: 'tsx' },
                { name: 'animation.tsx', type: 'file', extension: 'tsx' },
                { name: 'outro.tsx', type: 'file', extension: 'tsx' },
              ],
            },
            {
              name: 'components',
              type: 'folder',
              children: [
                { name: 'FileTree.tsx', type: 'file', extension: 'tsx' },
                { name: 'Terminal.tsx', type: 'file', extension: 'tsx' },
                { name: 'MacWindow.tsx', type: 'file', extension: 'tsx' },
              ],
            },
            { name: 'project.ts', type: 'file', extension: 'ts' },
            { name: 'animation.ts', type: 'file', extension: 'ts' },
          ],
        },
        {
          name: 'assets',
          type: 'folder',
          children: [
            { name: 'logo.svg', type: 'asset', extension: 'svg' },
            { name: 'background.jpg', type: 'asset', extension: 'jpg' },
            { name: 'sound.mp3', type: 'asset', extension: 'mp3' },
          ],
        },
        { name: 'package.json', type: 'file', extension: 'json' },
        { name: 'vite.config.ts', type: 'file', extension: 'ts' },
        { name: 'README.md', type: 'file', extension: 'md' },
      ],
    },
  ];

  const projectTree = new FileTree({
    structure: projectStructure,
    folderColor: '#f39c12',
    fileColor: '#95a5a6',
    assetColor: '#e74c3c',
    labelColor: '#ecf0f1',
    textSize: 14,
    rowSize: 28,
    indentAmount: 24,
  });
  rightContainer.add(projectTree);

  // Add sides to main layout
  mainLayout.add(leftSide);
  mainLayout.add(rightSide);

  // Add main layout to view
  view.add(mainLayout);

  // Animation sequence
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

  yield* waitFor(1);

  // Demonstrate tree emphasis animations
  // Emphasize DOM elements
  yield* domTree.emphasize('1-head', 0.5);
  yield* waitFor(0.5);
  yield* domTree.emphasize('2-title', 0.5);
  yield* waitFor(1);
  yield* domTree.reset('1-head', 0.5);
  yield* domTree.reset('2-title', 0.5);

  yield* waitFor(0.5);

  // Emphasize Motion Canvas project elements
  yield* projectTree.emphasize('1-src', 0.5);
  yield* waitFor(0.5);
  yield* projectTree.emphasize('2-scenes', 0.5);
  yield* waitFor(0.5);
  yield* projectTree.emphasize('3-intro.tsx', 0.5);
  yield* waitFor(1);

  // Reset all
  yield* all(
    projectTree.resetAll(0.8),
    domTree.resetAll(0.8),
  );

  yield* waitFor(2);
});