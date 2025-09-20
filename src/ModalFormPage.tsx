import { useEffect, useState } from 'react';
import { useModal } from './entities/modal/hooks/useModal';
import { FormModal } from './entities/modal/components/FormModal';
import { LongFormModal } from './entities/modal/components/LongFormModal';

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

  // 스타일 객체들
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    maxWidth: '768px',
    margin: '32px auto',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
    maxWidth: '320px',
  };

  const resultContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
  };

  const spacerStyle: React.CSSProperties = {
    height: '1000px',
  };

  const handleOpenFormModal = async () => {
    try {
      const result = await openModal(FormModal, {
        title: '회원가입',
        description: '회원가입 폼입니다.',
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
  const handleOpenLongFormModal = async () => {
    try {
      const result = await openModal(LongFormModal, {
        title: '긴 회원가입',
        description: '긴 회원가입 폼입니다.',
        initialData: { name: '', email: '', specialty: '' },
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
    <div style={containerStyle}>
      <button
        className="a11y-focus"
        onClick={handleOpenFormModal}
        style={buttonStyle}
      >
        Open Form Modal
      </button>
      <button
        className="a11y-focus"
        onClick={handleOpenLongFormModal}
        style={buttonStyle}
      >
        Open Long Form Modal
      </button>
      <div style={resultContainerStyle}>
        <h2>응답 결과:</h2>
        <ul>
          {resultArray.map((result, index) => (
            <li key={index}>{JSON.stringify(result)}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>스크롤 생성을 위한 빈공간입니다</h3>
        <div style={spacerStyle}></div>
      </div>
    </div>
  );
};

export default ModalFormPage;
