import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { ModalManagerState, ModalInstance } from '../types/modal';

let modalIdCounter = 0;
const generateModalId = () => `modal-${++modalIdCounter}`;

interface ModalStore extends ModalManagerState {
  openModal: <T>(
    component: React.ComponentType<any>,
    props?: any
  ) => Promise<T | null>;
  closeModal: (id: string, result?: any) => void;
  closeAllModals: () => void;
  getActiveModal: () => ModalInstance | null;
}

export const useModalStore = create<ModalStore>()(
  subscribeWithSelector((set, get) => ({
    modals: new Map(),
    activeModalId: null,

    openModal: <T>(component: React.ComponentType<any>, props: any = {}) => {
      return new Promise<T | null>((resolve, reject) => {
        const id = generateModalId();
        // 현재 활성화된 요소 (트리거 버튼) 저장
        const triggerElement = document.activeElement as HTMLElement;

        const modalInstance: ModalInstance<T> = {
          id,
          component,
          props: {
            ...props,
            modalId: id,
            onClose: (result?: T) => get().closeModal(id, result),
          },
          resolve,
          reject,
          triggerElement,
        };

        set((state) => {
          const newModals = new Map(state.modals);
          newModals.set(id, modalInstance);
          return {
            modals: newModals,
            activeModalId: id,
          };
        });
      });
    },

    closeModal: (id: string, result: any = null) => {
      const { modals } = get();
      const modalInstance = modals.get(id);

      if (modalInstance) {
        modalInstance.resolve(result);

        // 트리거 요소로 포커스 복원
        if (
          modalInstance.triggerElement &&
          document.body.contains(modalInstance.triggerElement)
        ) {
          // 다음 tick에서 포커스 복원 (모달이 완전히 제거된 후)
          setTimeout(() => {
            modalInstance.triggerElement?.focus();
          }, 0);
        }

        set((state) => {
          const newModals = new Map(state.modals);
          newModals.delete(id);

          // 마지막 모달을 활성화 (스택 구조)
          const remainingModals = Array.from(newModals.keys());
          const newActiveModalId =
            remainingModals.length > 0
              ? remainingModals[remainingModals.length - 1]
              : null;

          return {
            modals: newModals,
            activeModalId: newActiveModalId,
          };
        });
      }
    },

    closeAllModals: () => {
      const { modals } = get();

      // 모든 열린 모달들을 null로 resolve
      modals.forEach((modalInstance) => {
        modalInstance.resolve(null);
      });

      set({
        modals: new Map(),
        activeModalId: null,
      });
    },

    getActiveModal: () => {
      const { modals, activeModalId } = get();
      return activeModalId ? modals.get(activeModalId) || null : null;
    },
  }))
);
