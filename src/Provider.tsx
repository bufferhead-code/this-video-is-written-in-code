/* @jsxImportSource preact */

import {Scene} from '@motion-canvas/core';
import {useApplication, useCurrentScene} from '@motion-canvas/ui';
import {
  ReadonlySignal,
  Signal,
  computed,
  signal,
  useSignalEffect,
} from '@preact/signals';
import {ComponentChildren, createContext} from 'preact';
import {useContext, useMemo} from 'preact/hooks';
import {SignalSet} from './utils';

export interface ScriptPluginState {
  selectedElement: ReadonlySignal<string | null>;
  hoveredKey: Signal<string | null>;
  selectElement: (elementKey: string | null) => void;
  openElements: SignalSet<string>;
  openDetached: Signal<boolean>;
  visibleElements: Set<string>;
  scene: ReadonlySignal<Scene | null>;
  afterRender: ReadonlySignal<number>;
}

export const ScriptInspectorKey = 'script-inspector';

const PluginContext = createContext<ScriptPluginState | null>(null);

export function usePluginState(): ScriptPluginState {
  const state = useContext(PluginContext);
  if (!state) {
    throw new Error('Plugin state not found');
  }
  return state;
}

export function Provider({children}: {children?: ComponentChildren}) {
  const {inspection} = useApplication();
  const currentScene = useCurrentScene();

  const state = useMemo(() => {
    const afterRender = signal(0);
    const openDetached = signal(false);
    const visibleElements = new Set<string>();
    const scene = signal(currentScene);
    const selectedElement = computed(() => {
      afterRender.value;
      const {key, payload} = inspection.value;
      if (key === ScriptInspectorKey) {
        return payload as string;
      }
      return null;
    });
    const hoveredKey = signal<string | null>(null);
    const openElements = new SignalSet<string>();
    const selectElement = (elementKey: string | null) => {
      const {key, payload} = inspection.peek();

      if (key === ScriptInspectorKey && !elementKey) {
        inspection.value = {key: '', payload: null};
      } else if (payload !== elementKey) {
        inspection.value = {key: ScriptInspectorKey, payload: elementKey};
      }
    };

    return {
      selectedElement,
      selectElement,
      hoveredKey,
      afterRender,
      openElements,
      openDetached,
      visibleElements,
      scene,
    } satisfies ScriptPluginState;
  }, []);

  state.scene.value = currentScene;

  useSignalEffect(() => {
    // Update afterRender signal when scene changes
    const timer = setInterval(() => {
      state.afterRender.value++;
    }, 100);
    
    return () => clearInterval(timer);
  });

  return (
    <PluginContext.Provider value={state}>
      {children}
    </PluginContext.Provider>
  );
} 