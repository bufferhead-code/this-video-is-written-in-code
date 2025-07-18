/* @jsxImportSource preact */

import {
  Movie,
  emphasize,
  Pane,
  PluginTabConfig,
  PluginTabProps,
  Tab,
  useApplication,
  usePanels,
  useReducedMotion,
} from '@motion-canvas/ui';
import {useSignalEffect} from '@preact/signals';
import {useEffect, useRef} from 'preact/hooks';
import {FunctionComponent} from 'preact';
import {usePluginState} from './Provider';
import {ScriptElementList} from './tree';

const TabComponent: FunctionComponent<PluginTabProps> = ({tab}) => {
  const {sidebar} = usePanels();
  const inspectorTab = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const {selectedElement, selectElement} = usePluginState();
  const {logger} = useApplication();

  useEffect(
    () =>
      logger.onInspected.subscribe(key => {
        sidebar.set(tab);
        selectElement(key);
      }),
    [tab],
  );

  useSignalEffect(() => {
    if (
      selectedElement.value &&
      sidebar.current.peek() !== tab &&
      !reducedMotion &&
      inspectorTab.current &&
      inspectorTab.current.getAnimations().length < 2
    ) {
      inspectorTab.current.animate(emphasize(), {duration: 400});
      inspectorTab.current.animate([{color: 'white'}, {color: ''}], {
        duration: 800,
      });
    }
  });

  return (
    <Tab
      forwardRef={inspectorTab}
      title="Script Editor"
      id="script-editor-tab"
      tab={tab}
    >
      <Movie />
    </Tab>
  );
};

const PaneComponent: FunctionComponent<PluginTabProps> = () => {
  return (
    <Pane title="Script Editor" id="script-editor-pane">
      <ScriptElementList />
    </Pane>
  );
};

export const ScriptTabConfig: PluginTabConfig = {
  name: 'motion-canvas-plugin-script-editor',
  tabComponent: TabComponent as any,
  paneComponent: PaneComponent as any,
}; 