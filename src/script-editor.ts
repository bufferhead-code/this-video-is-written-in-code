import './index.css';

import {makeEditorPlugin} from '@motion-canvas/ui';
import {ScriptInspectorConfig} from './ScriptInspectorConfig';
import {PreviewOverlayConfig} from './PreviewOverlayConfig';
import {Provider} from './Provider';
import {ScriptTabConfig} from './ScriptTabConfig';

export default makeEditorPlugin(() => {
  return {
    name: 'motion-canvas-plugin-script-editor',
    provider: Provider,
    previewOverlay: PreviewOverlayConfig,
    tabs: [ScriptTabConfig],
    inspectors: [ScriptInspectorConfig],
  };
});