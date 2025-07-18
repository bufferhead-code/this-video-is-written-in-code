/* @jsxImportSource preact */

import {
  AutoField,
  Button,
  Group,
  Label,
  Pane,
  PluginInspectorConfig,
  Separator,
  UnknownField,
  findAndOpenFirstUserFile,
  useApplication,
} from '@motion-canvas/ui';
import {useComputed} from '@preact/signals';
import {FunctionComponent} from 'preact';
import {ScriptInspectorKey, usePluginState} from './Provider';

const Component: FunctionComponent = () => {
  const {inspection} = useApplication();
  const {scene, afterRender} = usePluginState();
  
  const element = useComputed(() => {
    afterRender.value;
    const {payload} = inspection.value;
    // For script editor, we can implement custom element retrieval logic here
    return payload ? {key: payload, type: 'script-element', content: 'Sample script content'} : null;
  });

  const attributes = useComputed(() => {
    afterRender.value;
    const currentElement = element.value;
    const attributes: [string, unknown][] = [];

    if (currentElement) {
      // Add script-specific attributes
      attributes.push(['type', currentElement.type]);
      attributes.push(['content', currentElement.content]);
      attributes.push(['timestamp', new Date().toISOString()]);
    }

    return attributes;
  });

  // Mock stack for now - in a real implementation, this would come from the element
  const stack = element.value ? 'script-editor.ts:1:1' : null;

  return (
    <Pane title="Script Inspector" id="script-inspector-pane">
      <Separator size={1} />
      {stack && (
        <Group>
          <Label />
          <Button onClick={() => findAndOpenFirstUserFile(stack)} main>
            GO TO SOURCE
          </Button>
        </Group>
      )}
      <Group>
        <Label>element</Label>
        <UnknownField value={inspection.value.payload} />
      </Group>
      {!element.value && (
        <Group>
          <Label />
          Couldn't find the script element. It may have been deleted or doesn't exist yet.
        </Group>
      )}
      {attributes.value.map(([key, value]) => (
        <Group key={key}>
          <Label>{key}</Label>
          <AutoField value={value} />
        </Group>
      ))}
    </Pane>
  );
};

export const ScriptInspectorConfig: PluginInspectorConfig = {
  key: ScriptInspectorKey,
  component: Component as any,
}; 