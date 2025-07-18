/* @jsxImportSource preact */

import {useSignal, useSignalEffect} from '@preact/signals';
import {usePluginState} from '../Provider';
import {ScriptElement} from './ScriptElement';
import {TreeRoot} from './TreeRoot';

export function ScriptElementList() {
  const {scene, selectElement} = usePluginState();
  const elements = useSignal<Array<{id: string, type: string, content: string}>>([]);

  useSignalEffect(() => {
    // Mock data for script elements - in a real implementation, this would come from the scene
    elements.value = [
      {id: 'element-1', type: 'dialogue', content: 'Welcome to Motion Canvas!'},
      {id: 'element-2', type: 'action', content: 'Fade in title animation'},
      {id: 'element-3', type: 'dialogue', content: 'This is a script editor demo'},
      {id: 'element-4', type: 'scene-change', content: 'Cut to: Next scene'},
    ];
  });

  const handleElementSelect = (elementId: string) => {
    selectElement(elementId);
  };

  return (
    <TreeRoot>
      {elements.value.map(element => (
        <ScriptElement
          key={element.id}
          element={element}
          onSelect={handleElementSelect}
        />
      ))}
    </TreeRoot>
  );
} 