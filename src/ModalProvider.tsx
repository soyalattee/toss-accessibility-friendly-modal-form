import React, { useEffect, useMemo } from 'react';
import { useModalStore } from './entities/modal/store/modal';
import { ModalRenderer } from './entities/modal/ModalRenderer';
import type { ModalInstance } from './entities/modal/types/modal';

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const modalsMap = useModalStore((state) => state.modals);
  const modals = useMemo(() => Array.from(modalsMap.values()), [modalsMap]);

  // ESC 키 핸들링
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const activeModal = useModalStore.getState().getActiveModal();
        if (activeModal) {
          useModalStore.getState().closeModal(activeModal.id);
        }
      }
    };

    if (modals.length > 0) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [modals.length]);

  return (
    <>
      {children}
      {modals.map((modalInstance: ModalInstance) => (
        <ModalRenderer key={modalInstance.id} modalInstance={modalInstance} />
      ))}
    </>
  );
};

export default ModalProvider;
