'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useOpenLHP } from '@/stores/selectors';
import { Box, Button, CircularProgress, Tooltip, Typography } from '@mui/material';
import Input2 from '@/components/inputs/Input2';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SinhVienService } from '@/services/SinhVienService';
import useDebounce from '@/hooks/useDebounce';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useNotifications } from '@toolpad/core';
export interface IFormData {
  mssv: number;
}
interface ISearch {
  id: string;
  query: string;
}
const Search = ({ id, query }: ISearch) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const notification = useNotifications();
  const queryClient = useQueryClient();
  const debouncedSearchValue = useDebounce(searchValue, 600);
  const openLHP = useOpenLHP();
  useEffect(() => {
    if (!openLHP) {
      setSearchValue('');
    }
  }, [openLHP]);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['search-sinh-vien', debouncedSearchValue],
    queryFn: async () => {
      const response = await SinhVienService.getSinhVienByMssv(debouncedSearchValue);
      return response;
    },
    enabled: !!debouncedSearchValue,
    refetchOnWindowFocus: false
  });
  const mutationAdd = useMutation({
    mutationFn: async (data: any) => {
      const response = await SinhVienService.dangKyMonHoc(data);
      return response;
    },
    onSuccess: async (data) => {
      notification.show('Thêm sinh viên thành công', {
        severity: 'success',
        autoHideDuration: 3000
      });
      queryClient.invalidateQueries({
        queryKey: [query, id, { page: 0, pageSize: 10 }, { field: '', sort: '' }, { items: [] }]
      });
    },
    onError: (error: any) => {
      notification.show(error?.Message || 'Lỗi khi thêm sinh viên', {
        severity: 'error',
        autoHideDuration: 3000
      });
    }
  });
  const handleAdd = () => {
    if (!data) return;
    const formData = new FormData();
    formData.append('LopHocPhanId', id);
    formData.append('SinhVienId', data.id);
    mutationAdd.mutate(formData);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // ✅ Prevent Enter from submitting
      e.stopPropagation();
    }
  };
  return (
    <AnimatePresence>
      {openLHP && (
        <motion.div
          initial={{
            maxHeight: 0,
            opacity: 0,
            paddingTop: 0,
            paddingBottom: 0
          }}
          animate={{
            maxHeight: 500, // Ước tính chiều cao tối đa
            opacity: 1,
            paddingTop: 16,
            paddingBottom: 16
          }}
          exit={{
            maxHeight: 0,
            opacity: 0,
            paddingTop: 0,
            paddingBottom: 0
          }}
          transition={{
            maxHeight: { duration: 0.4, ease: 'easeInOut' },
            opacity: { duration: 0.3 },
            padding: { duration: 0.4, ease: 'easeInOut' }
          }}
          className='flex flex-col gap-2 border border-gray-200 rounded-md p-4 shadow-sm w-[40%] overflow-hidden'
        >
          <Box component={'form'} className='flex gap-2 items-end justify-center'>
            <Box className='flex flex-col  w-full'>
              <Typography className='!font-semibold'>MSSV</Typography>
              <Box className='flex gap-2 justify-center items-center'>
                <Box className='flex flex-col w-full'>
                  <Input2
                    name='mssv'
                    placeholder='Nhập MSSV'
                    isDisabled={false}
                    isDisableMessError
                    type='text'
                    value={searchValue}
                    onChange={(e: any) => {
                      setSearchValue(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          {isLoading ? (
            <Box className='flex justify-center items-center h-10 my-4'>
              <CircularProgress />
            </Box>
          ) : isError ? (
            <Typography>Lỗi ...</Typography>
          ) : data ? (
            <Box className='flex items-center gap-4 p-4 rounded-lg border border-gray-200 shadow-sm bg-white relative'>
              <Box className='shrink-0'>
                <img
                  src={data.anhDaiDien}
                  alt={data.hoTen}
                  className='w-14 h-14 rounded-full object-cover border border-gray-300'
                />
              </Box>
              <Box className='flex flex-col justify-center gap-1 flex-1 min-w-0'>
                <Typography
                  variant='subtitle1'
                  className='!font-bold !mb-1 truncate'
                  style={{ fontSize: '1.05rem', wordBreak: 'break-word' }}
                  title={data.hoTen}
                >
                  {data.hoTen}
                </Typography>
                <Box className='grid grid-cols-3 gap-x-3 gap-y-1 text-sm'>
                  <Typography variant='body2' className='font-semibold text-gray-500 truncate col-span-1'>
                    MSSV:
                  </Typography>
                  <Typography variant='body2' className='truncate col-span-2' title={data.mssv}>
                    {data.mssv}
                  </Typography>

                  <Typography variant='body2' className='font-semibold text-gray-500 truncate col-span-1'>
                    Email:
                  </Typography>
                  <Typography variant='body2' className='truncate col-span-2' title={data.email}>
                    {data.email}
                  </Typography>

                  <Typography variant='body2' className='font-semibold text-gray-500 truncate col-span-1'>
                    Ngày sinh:
                  </Typography>
                  <Typography
                    variant='body2'
                    className='truncate col-span-2'
                    title={new Date(data.ngaySinh).toLocaleDateString()}
                  >
                    {new Date(data.ngaySinh).toLocaleDateString()}
                  </Typography>

                  <Typography variant='body2' className='font-semibold text-gray-500 truncate col-span-1'>
                    Giới tính:
                  </Typography>
                  <Typography variant='body2' className='truncate col-span-2'>
                    {data.gioiTinh === 1 ? 'Nam' : 'Nữ'}
                  </Typography>

                  <Typography variant='body2' className='font-semibold text-gray-500 truncate col-span-1'>
                    Lớp:
                  </Typography>
                  <Typography variant='body2' className='truncate col-span-2' title={data.lopHoc?.maLopHoc}>
                    {data.lopHoc?.maLopHoc}
                  </Typography>
                </Box>
              </Box>
              <Box className='absolute top-2 right-2'>
                <Tooltip title='Thêm sinh viên vào lớp học phần' placement='right'>
                  <Button
                    onClick={() => handleAdd()}
                    sx={{
                      minWidth: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      padding: 0
                    }}
                    className='!bg-blue-500 hover:!bg-blue-600  !text-white'
                  >
                    <Plus />
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          ) : (
            <Typography className='text-gray-500 text-center mt-4'>Không tìm thấy sinh viên nào</Typography>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Search;
