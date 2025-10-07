// frontend/src/ui/patterns/SectionAnchor.jsx

import React from 'react';

/**
 * SectionAnchor — оборачивает секцию, навешивает id и ref.
 * props: id, register, children
 */
export function SectionAnchor({ id, register, children }) {
  return (
    <div id={`section-${id}`} data-nav-id={id} ref={register(id)}>
      {children}
    </div>
  );
}
