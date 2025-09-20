import { useModalStore } from './store/modal';
import type { ModalInstance } from './types/modal';

export const modalManager = {
  open: <T = any>(
    component: React.ComponentType<any>,
    props?: any
  ): Promise<T | null> => {
    return useModalStore.getState().openModal<T>(component, props);
  },

  close: (id: string, result?: any) => {
    useModalStore.getState().closeModal(id, result);
  },

  closeAll: () => {
    useModalStore.getState().closeAllModals();
  },

  getActive: (): ModalInstance | null => {
    return useModalStore.getState().getActiveModal();
  },

  getCount: (): number => {
    return useModalStore.getState().modals.size;
  },

  isOpen: (id: string): boolean => {
    return useModalStore.getState().modals.has(id);
  },
};
