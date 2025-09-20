import type { ComponentType } from 'react';
export interface ModalInstance<T = any> {
  id: string;
  component: ComponentType<any>;
  props: any;
  resolve: (value: T | null) => void;
  reject: (error: Error) => void;
  triggerElement: HTMLElement;
}

export interface ModalResult<T> {
  type: 'submit' | 'cancel';
  data?: T;
}

export interface ModalManagerState {
  modals: Map<string, ModalInstance>;
  activeModalId: string | null;
}

export interface BaseModalProps {
  modalId: string;
  onClose: (result?: any) => void;
}
