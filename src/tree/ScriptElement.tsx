/* @jsxImportSource preact */

import {usePluginState} from '../Provider';
import {useComputed} from '@preact/signals';

interface ScriptElementProps {
  element: {
    id: string;
    type: string;
    content: string;
  };
  onSelect: (elementId: string) => void;
}

export function ScriptElement({element, onSelect}: ScriptElementProps) {
  const {selectedElement, hoveredKey} = usePluginState();
  
  const isSelected = useComputed(() => selectedElement.value === element.id);
  const isHovered = useComputed(() => hoveredKey.value === element.id);

  const handleClick = () => {
    onSelect(element.id);
  };

  const handleMouseEnter = () => {
    hoveredKey.value = element.id;
  };

  const handleMouseLeave = () => {
    hoveredKey.value = null;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dialogue':
        return '💬';
      case 'action':
        return '🎬';
      case 'scene-change':
        return '🎞️';
      default:
        return '📝';
    }
  };

  return (
    <div
      className={`script-element ${isSelected.value ? 'selected' : ''} ${isHovered.value ? 'hovered' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        padding: '8px 12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: isSelected.value ? 'var(--theme-overlay)' : isHovered.value ? 'var(--surface-color-hover)' : 'transparent',
        color: isSelected.value ? 'var(--theme)' : 'inherit',
        borderRadius: 'var(--radius)',
        userSelect: 'none',
      }}
    >
      <span style={{fontSize: '16px'}}>{getTypeIcon(element.type)}</span>
      <div>
        <div style={{fontWeight: 'bold', fontSize: '12px', opacity: 0.7}}>
          {element.type.toUpperCase()}
        </div>
        <div style={{fontSize: '14px'}}>
          {element.content.length > 50 
            ? element.content.substring(0, 50) + '...' 
            : element.content
          }
        </div>
      </div>
    </div>
  );
} 