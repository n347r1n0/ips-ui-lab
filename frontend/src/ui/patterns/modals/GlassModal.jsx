// frontend/src/ui/patterns/modals/GlassModal.jsx

import React from 'react';
import { Modal } from '@/ui/surfaces/Modal';
import { Button } from '@/ui/primitives/Button';

export function GlassModal({
  title,
  onClose,
  size = 'md',
  children,
  footer,
  // новые явные контролы слотов:
  headerVariant = 'solid',
  footerVariant = 'solid',
  headerDeco = false, // арт-деко только в хедере
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  ...rest
}) {
  return (
    <Modal open onClose={onClose} size={size} variant="glass" backdrop="normal" aria-labelledby="modal-title" {...rest}>
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
