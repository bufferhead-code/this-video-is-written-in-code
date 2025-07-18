/* @jsxImportSource preact */

import {ComponentChildren} from 'preact';

interface TreeRootProps {
  children?: ComponentChildren;
}

export function TreeRoot({children}: TreeRootProps) {
  return (
    <div
      style={{
        marginTop: '-1px',
        padding: '3px 0 4px',
        borderTop: '2px solid var(--background-color)',
        width: 'max-content',
        minWidth: '100%',
      }}
    >
      {children}
    </div>
  );
} 