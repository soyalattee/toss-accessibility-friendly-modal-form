import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ModalInstance } from './types/modal';
import { modalManager } from './modalManager';

interface ModalRendererProps {
  modalInstance: ModalInstance;
}

type ModalState = 'opening' | 'open' | 'closing' | 'closed';

export const ModalRenderer = ({ modalInstance }: ModalRendererProps) => {
  const [state, setState] = useState<ModalState>('opening');
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // 포털 루트 설정
  useEffect(() => {
    let root = document.getElementById('modal-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'modal-root';
      root.setAttribute('aria-live', 'polite');
      document.body.appendChild(root);
    }
    setPortalRoot(root);

    return () => {
      // 마지막 모달이 제거될 때만 portal root 정리
      if (root && root.children.length === 0) {
        document.body.removeChild(root);
      }
    };
  }, []);

  // 애니메이션 상태 관리
  useEffect(() => {
    const timer = setTimeout(() => {
      if (state === 'opening') {
        setState('open');
      }
    }, 10); // 다음 프레임에서 애니메이션 시작

    return () => clearTimeout(timer);
  }, [state]);

  // body scroll lock
  useEffect(() => {
    if (state === 'open') {
      const scrollY = window.scrollY;
      const body = document.body;

      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.overflow = 'hidden';

      return () => {
        body.style.position = '';
        body.style.top = '';
        body.style.left = '';
        body.style.right = '';
        body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [state]);

  // 포커스 트랩
  useEffect(() => {
    if (state === 'open' && modalRef.current) {
      // 모달을 열 때 현재 활성화된 요소(버튼) 저장
      const modal = modalRef.current;
      // 처음에는 제목 요소에 포커스
      const titleElement = modal.querySelector(
        'h1, h2, h3, h4, h5, h6, [role="heading"]'
      );

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = titleElement as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      };

      // 첫 번째 포커스 가능한 요소에 포커스
      firstElement?.focus();

      modal.addEventListener('keydown', handleTabKey);
      return () => modal.removeEventListener('keydown', handleTabKey);
    }
  }, [state]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      handleClose();
    }
  };

  const handleClose = (result?: any) => {
    setState('closing');
    setTimeout(() => {
      modalManager.close(modalInstance.id, result ?? null);
    }, 200); // 애니메이션 시간과 맞춤
  };

  // 접근성 속성
  const modalA11yProps = {
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': `modal-title-${modalInstance.id}`,
    'aria-describedby': `modal-description-${modalInstance.id}`,
  };

  // prefers-reduced-motion 확인
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    opacity: state === 'open' ? 1 : 0,
    transition: prefersReducedMotion ? 'none' : 'opacity 0.2s ease-out',
  };

  const modalStyles: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow:
      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'auto',
    transform: state === 'open' ? 'scale(1)' : 'scale(0.95)',
    transition: prefersReducedMotion ? 'none' : 'transform 0.2s ease-out',
    outline: 'none',
  };

  if (!portalRoot) {
    return null;
  }

  const { component: Component, props } = modalInstance;

  return createPortal(
    <div ref={overlayRef} style={overlayStyles} onClick={handleOverlayClick}>
      <div ref={modalRef} style={modalStyles} {...modalA11yProps} tabIndex={-1}>
        <Component
          {...props}
          modalId={modalInstance.id}
          onClose={handleClose}
        />
      </div>
    </div>,
    portalRoot
  );
};

export default ModalRenderer;
