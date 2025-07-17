'use client';
import { MenuItem, Select, Typography } from '@mui/material';
import React, { use, useEffect, useMemo } from 'react';

export default function SelectEditCell({ params, giangVienOptions, fetchGiangVienByBoMonId }: {
  params: any;
  giangVienOptions: { [boMonId: string]: any[] };
  fetchGiangVienByBoMonId: (boMonId: string) => Promise<any[]>;
}) {
  const boMonId = useMemo(() => params.row?.monHoc?.chiTietChuongTrinhDaoTao?.boMonId, [params.row]);
  const [options, setOptions] = React.useState<any[]>(giangVienOptions[boMonId] || []);
  useEffect(() => {
    const fetchOptions = async () => {
    if (boMonId) {
      if (!giangVienOptions[boMonId]) {
        const result = await fetchGiangVienByBoMonId(boMonId);
        setOptions(result);
      } else {
        setOptions(giangVienOptions[boMonId]);
      }
    }
  };
  fetchOptions();
  }, [boMonId, giangVienOptions]);
  return (
    <Select
      className='bg-white border z-99 border-gray-300 p-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500'
      value={params.value || ''}
      onChange={(e) =>
        params.api.setEditCellValue({
          id: params.id,
          field: params.field,
          value: e.target.value === '' ? null : e.target.value
        })
      }
      MenuProps={{
      PaperProps: {
        style: {
          maxHeight: 200, // chiều cao tối đa, có scroll
        },
      },
    }}
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
      <MenuItem value='' disabled>
        <Typography variant='body2' className='text-gray-500'>
          Chọn giảng viên
        </Typography>
      </MenuItem>
      {options.map((item: any) => (
        <MenuItem
          key={item.value}
          value={item.value}
          style={{
            fontSize: '14px',
            fontWeight: 400,
            fontFamily: 'inherit'
          }}
        >
          {item.label}
        </MenuItem>
      ))}
    </Select>
  );
}
