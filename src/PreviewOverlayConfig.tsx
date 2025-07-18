/* @jsxImportSource preact */

import {Vector2} from '@motion-canvas/core';
import {
  MouseButton,
  OverlayWrapper,
  PluginOverlayConfig,
  useViewportContext,
  useViewportMatrix,
} from '@motion-canvas/ui';
import {ComponentChildren, FunctionComponent} from 'preact';
import {usePluginState} from './Provider';

const Component: FunctionComponent<{children?: ComponentChildren}> = ({children}) => {
  const state = useViewportContext();
  const {scene, selectElement} = usePluginState();
  const matrix = useViewportMatrix();

  return (
    <OverlayWrapper
      onPointerDown={event => {
        if (event.button !== MouseButton.Left || event.shiftKey) return;
        if (!scene.value) return;
        event.stopPropagation();

        const position = new Vector2(
          event.x - state.rect.x,
          event.y - state.rect.y,
        ).transformAsPoint(matrix.inverse());

        // For script editor, we can implement custom element selection logic here
        selectElement(`script-element-${Math.floor(position.x)}-${Math.floor(position.y)}`);
      }}
    >
      {children}
    </OverlayWrapper>
  );
};

function drawHook() {
  const {selectedElement, hoveredKey, afterRender, scene} = usePluginState();
  selectedElement.value;
  hoveredKey.value;
  afterRender.value;

  return (ctx: CanvasRenderingContext2D, matrix: DOMMatrix) => {
    const currentScene = scene.peek();
    if (!currentScene) return;

    // Draw overlay for selected script element
    const selected = selectedElement.value;
    if (selected) {
      ctx.strokeStyle = '#ffeb3b';
      ctx.lineWidth = 2;
      ctx.strokeRect(100, 100, 200, 50); // Example overlay
    }

    // Draw overlay for hovered element
    const hovered = hoveredKey.value;
    if (hovered && hovered !== selected) {
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = '#2196f3';
      ctx.lineWidth = 2;
      ctx.strokeRect(100, 200, 200, 50); // Example overlay
    }
  };
}

export const PreviewOverlayConfig: PluginOverlayConfig = {
  drawHook,
  component: Component as any,
}; 