import 'modern-normalize';
import './styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ModalFormPage from './ModalFormPage';
import { ModalProvider } from './ModalProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ModalProvider>
      <ModalFormPage />
    </ModalProvider>
  </StrictMode>
);
