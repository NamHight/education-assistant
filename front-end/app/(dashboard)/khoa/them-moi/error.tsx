'use client';

import React from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div style={{ padding: 32 }}>
      <h2>Đã xảy ra lỗi!</h2>
      <p>{'Có lỗi không xác định.'}</p>
      <button
        style={{
          marginTop: 16,
          padding: '8px 16px',
          background: '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}
        onClick={() => reset()}
      >
        Thử lại
      </button>
    </div>
  );
}
