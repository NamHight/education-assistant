'use client';
import React, { FC, memo, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import {
  IOption,
  TrangThaiLopHocPhan
} from '@/types/options';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LopHocPhan } from '@/models/LopHocPhan';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import { useNotifications } from '@toolpad/core';

export interface IFormData {
  siSo?: string;
  trangThai?: IOption;
  giangVien?: IOption;
  monHoc?: IOption;
}

interface IContentFormProps {
  data: LopHocPhan;
  queryKey?: string;
  initialData?: any;
  onSubmit: (data: any) => void;
}

const ContentForm: FC<IContentFormProps> = ({ onSubmit, data, initialData, queryKey }) => {
  const notification = useNotifications();
  const queryClient = useQueryClient();
  const [isChangeSiSo, setIsChange] = React.useState<boolean>(false);
  const [numberSiSo, setNumberSiSo] = useState(data?.siSo || 0);
  const [errorSiSo, setErrorSiSo] = useState<string | null>(null);
  const mutationChangeStatus = useMutation({
    mutationFn: async ({ id, data }: { id: string | number | null; data: any }) => {
      const result = await LopHocPhanService.changeStatusLopHocPhan(id, data);
      return result;
    },
    onSuccess: async () => {
      queryClient.setQueryData([queryKey, { id: data?.id }], (oldData: any) => {
        if (oldData) {
          return {
            ...oldData,
            trangThai: Number(oldData.trangThai) === 1 ? 2 : 1
          };
        }
        return oldData;
      });

      notification.show('Thay đổi trạng thái thành công', {
        severity: 'success',
        autoHideDuration: 4000
      });
    },
    onError: (error: any) => {
      notification.show(error?.Message || 'Thay đổi trạng thái thất bại', {
        severity: 'error',
        autoHideDuration: 4000
      });
    }
  });

  const mutationUpdate = useMutation({
    mutationFn: async (form: FormData) => {
      const result = await LopHocPhanService.updateLopHocPhan(data?.id, form);
      return { id: data?.id, ...result };
    },
    onSuccess: (data: any) => {
      queryClient.setQueryData([queryKey, { id: data?.id }], (oldData: any) => {
        if (oldData) {
          return {
            ...oldData,
            siSo: numberSiSo || 0
          };
        }
        return oldData;
      });
      notification.show('Thay đổi sỉ số thành công', {
        severity: 'success',
        autoHideDuration: 5000
      });
      setErrorSiSo(null);
    },
    onError: (error: any) => {
      setErrorSiSo(null);
      notification.show(error.Message || 'Thay đổi sỉ số thất bại', {
        severity: 'error',
        autoHideDuration: 5000
      });
    }
  });
  const handleChangeStatus = () => {
    const formData = new FormData();
    formData.append('trangThai', Number(data?.trangThai) === 1 ? '2' : '1');
    mutationChangeStatus.mutate({ id: data?.id, data: formData });
  };
  const handleChangeSiSo = () => {
    setIsChange((prev) => !prev);
  };
  const handleChangeSiSoSubmit = () => {
    if (numberSiSo === data?.siSo) {
      setIsChange(false);
      return;
    }
    if (numberSiSo <= 0) {
      setErrorSiSo('Sỉ số không được nhỏ hơn hoặc bằng 0');
      return;
    }
    const formData = new FormData();
    if (data?.id) formData.append('id', String(data.id));
    formData.append('siSo', String(numberSiSo || 0));
    mutationUpdate.mutate(formData);
    handleChangeSiSo();
  };
  return (
    <FormControl fullWidth component={'form'} className='flex flex-col gap-4'>
      <Grid container spacing={2} rowSpacing={1}>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} className='relative'>
          <Box className='flex flex-col gap-1'>
            <Typography className='!text-[16px] !font-[500] !leading-6 !text-gray-500 mb-1'>Sỉ số</Typography>
              <Box
                className='rounded bg-gray-100 px-3 py-2 border border-gray-200 text-[15px] text-gray-800 font-medium'
                style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}
              >
                {data?.siSo || 0}
              </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Box className='flex flex-col gap-1'>
            <Typography className='!text-[16px] !font-[500] !leading-6 !text-gray-500 mb-1'>Giảng viên</Typography>
            <Box
              className='rounded bg-gray-100 px-3 py-2 border border-gray-200 text-[15px] text-gray-800 font-medium'
              style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}
            >
              {data?.giangVien?.hoTen || ''}
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Box className='flex flex-col gap-1'>
            <Typography className='!text-[16px] !font-[500] !leading-6 !text-gray-500 mb-1'>Môn học</Typography>
            <Box
              className='rounded bg-gray-100 px-3 py-2 border border-gray-200 text-[15px] text-gray-800 font-medium'
              style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}
            >
              {data?.monHoc?.tenMonHoc || ''}
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} className='relative'>
          <Box className='flex flex-col gap-1'>
            <Typography className='!text-[16px] !font-[500] !leading-6 !text-gray-500 mb-1'>Trạng thái</Typography>
            <Box
              className='rounded bg-gray-100 px-3 py-2 border border-gray-200 text-[15px] text-gray-800 font-medium'
              style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}
            >
              {TrangThaiLopHocPhan.find((item) => item.id === data?.trangThai)?.name || ''}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </FormControl>
  );
};

export default memo(ContentForm);
