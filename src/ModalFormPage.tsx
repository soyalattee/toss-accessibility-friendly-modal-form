import { useEffect, useState } from 'react';
import { useModal } from './entities/modal/hooks/useModal';
import { FormModal } from './entities/modal/components/FormModal';

const ModalFormPage = () => {
  const { openModal } = useModal();
  const [resultArray, setResultArray] = useState<any[]>([]);

  // 현재 포커스된 요소 확인
  console.log(document.activeElement);

  useEffect(() => {
    const logFocus = (e: FocusEvent) => {
      console.log('Focus moved to:', e.target);
    };
    // 포커스 변화 모니터링
    document.addEventListener('focusin', logFocus);

    return () => {
      document.removeEventListener('focusin', logFocus);
    };
  }, [document.activeElement]);

  const handleOpenFormModal = async () => {
    try {
      const result = await openModal(FormModal, {
        title: '새 항목 추가',
        initialData: { name: '', email: '' },
      });

      if (result) {
        setResultArray((prev) => [...prev, result]);
      } else {
        console.log('Modal cancelled');
      }
    } catch (error) {
      console.error('Modal error:', error);
    }
  };

  /* 여기에 구현해 주세요 */
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        maxWidth: '768px',
        margin: '32px auto',
      }}
    >
      <button
        className="a11y-focus"
        onClick={handleOpenFormModal}
        style={{
          padding: '8px 16px',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          backgroundColor: 'white',
          cursor: 'pointer',
          maxWidth: '320px',
        }}
      >
        Open Form Modal
      </button>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
        }}
      >
        <h2>응답 결과:</h2>
        <ul>
          {resultArray.map((result, index) => (
            <li key={index}>{JSON.stringify(result)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ModalFormPage;
