// frontend/src/ui/patterns/modals/NeoModal.jsx

import React from 'react';
import { Modal } from '@/ui/surfaces/Modal';

export function NeoModal({
  title,
  onClose,
  size = 'xl',
  children,
  footer,
  headerVariant = 'solid',
  footerVariant = 'solid',
  headerDeco = false, // только в хедере
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  ...rest
}) {
  return (
    <Modal open onClose={onClose} size={size} variant="solid" backdrop="heavy" aria-labelledby="modal-title" {...rest}>
      <Modal.Header
        onClose={onClose}
        variant={headerVariant}
        decoDivider={headerDeco}
        className={headerClassName}
      >
        <span id="modal-title" className="font-brand">{title}</span>
      </Modal.Header>

      <Modal.Body className={bodyClassName}>
        {children}
      </Modal.Body>

      {footer && (
        <Modal.Footer variant={footerVariant} className={footerClassName}>
          {footer}
        </Modal.Footer>
      )}
    </Modal>
  );
}
