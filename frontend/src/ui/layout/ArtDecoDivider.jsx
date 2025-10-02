// frontend/src/ui/layout/ArtDecoDivider.jsx

import React from 'react';

export function ArtDecoDivider({ className = '', style, ...rest }) {
  return (
    <div
      className={`deco-line ${className}`}
      style={style}
      aria-hidden="true"
      {...rest}
    />
  );
}