import { Typography } from '@mui/material';
import React from 'react';

export default function SelectEditCell({ params, giangVienOptions, fetchGiangVienByKhoaId }: any) {
  const khoaId = params.row?.monHoc?.khoaId;
  const [options, setOptions] = React.useState<any[]>(giangVienOptions[khoaId] || []);

  React.useEffect(() => {
    if (!giangVienOptions[khoaId]) {
      fetchGiangVienByKhoaId(khoaId).then(setOptions);
    } else {
      setOptions(giangVienOptions[khoaId]);
    }
  }, [khoaId, giangVienOptions]);

  return (
    <select
      className='bg-white border border-gray-300 p-1 text-[13px] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
      value={params.value || ''}
      onChange={(e) => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.value })}
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: 400,
        fontFamily: 'inherit'
      }}
    >
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
