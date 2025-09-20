import { useCallback } from 'react';
import { modalManager } from '../modalManager';

export const useModal = () => {
  const openModal = useCallback(
    <T = any>(
      component: React.ComponentType<any>,
      props?: any
    ): Promise<T | null> => {
      return modalManager.open<T>(component, props);
    },
    []
  );

  const closeModal = useCallback((id: string, result?: any) => {
    modalManager.close(id, result);
  }, []);

  const closeAllModals = useCallback(() => {
    modalManager.closeAll();
  }, []);

  return {
    openModal,
    closeModal,
    closeAllModals,
    getActiveModal: modalManager.getActive,
    getModalCount: modalManager.getCount,
    isModalOpen: modalManager.isOpen,
  };
};
