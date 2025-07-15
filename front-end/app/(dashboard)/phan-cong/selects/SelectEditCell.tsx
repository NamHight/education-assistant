'use client';
import { Typography } from '@mui/material';
import React, { useEffect } from 'react';

export default function SelectEditCell({ params, giangVienOptions, fetchGiangVienByKhoaId }: any) {
  const khoaId = params.row?.monHoc?.khoaId;
  const [options, setOptions] = React.useState<any[]>(giangVienOptions[khoaId] || []);

  useEffect(() => {
    if (!giangVienOptions[khoaId]) {
      fetchGiangVienByKhoaId(khoaId).then(setOptions);
    } else {
      setOptions(giangVienOptions[khoaId]);
    }
  }, [khoaId, giangVienOptions]);

  return (
    <select
      className='bg-white border z-99 border-gray-300 p-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500'
      value={params.value || ''}
      onChange={(e) =>
        params.api.setEditCellValue({
          id: params.id,
          field: params.field,
          value: e.target.value === '' ? null : e.target.value
        })
      }
      style={{
        width: '100%',
        overflowY: 'auto',
        backgroundColor: 'white',
        textAlign: 'start',
        fontSize: '14px',
        fontWeight: 400,
        fontFamily: 'inherit'
      }}
    >
      <option value='' disabled>
        <Typography variant='body2' className='text-gray-500'>
          Chọn giảng viên
        </Typography>
      </option>
      {options.map((item: any) => (
        <option
          key={item.value}
          value={item.value}
          style={{
            fontSize: '14px',
            fontWeight: 400,
            fontFamily: 'inherit'
          }}
        >
          {item.label}
        </option>
      ))}
    </select>
  );
}
