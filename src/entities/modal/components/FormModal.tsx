import { useState } from 'react';
import type { BaseModalProps } from '../types/modal';

// 예시 모달 컴포넌트들

interface FormModalProps extends BaseModalProps {
  title: string;
  description?: string;
  initialData?: { name: string; email: string };
}

export const FormModal = ({
  title,
  description,
  initialData = { name: '', email: '' },
  onClose,
  modalId,
}: FormModalProps) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const titleId = `modal-title-${modalId}`;
  const descriptionId = `modal-description-${modalId}`;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onClose(formData);
    } else {
      // 첫 번째 에러 필드에 포커스
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(
        `[name="${firstErrorField}"]`
      ) as HTMLElement;
      errorElement?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 실시간 에러 제거
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div style={{ padding: '24px', minWidth: '400px' }}>
      <h2
        id={titleId}
        style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold' }}
      >
        {title}
      </h2>
      {description && (
        <p id={descriptionId} style={{ margin: '0 0 16px 0' }}>
          {description}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="name"
            style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}
          >
            이름 *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${errors.name ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '4px',
              fontSize: '14px',
            }}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <div
              id="name-error"
              role="alert"
              style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}
            >
              {errors.name}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label
            htmlFor="email"
            style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}
          >
            이메일 *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${errors.email ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '4px',
              fontSize: '14px',
            }}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <div
              id="email-error"
              role="alert"
              style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}
            >
              {errors.email}
            </div>
          )}
        </div>

        <div
          style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}
        >
          <button
            type="button"
            onClick={() => onClose(null)}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
          >
            취소
          </button>
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#3b82f6',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            제출
          </button>
        </div>
      </form>
    </div>
  );
};
