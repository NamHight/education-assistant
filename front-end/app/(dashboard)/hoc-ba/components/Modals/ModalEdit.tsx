import Input2 from '@/components/inputs/Input2';
import InputSelect2 from '@/components/selects/InputSelect2';
import { HocBa } from '@/models/HocBa';
import { TrangThaiLopHocPhanEnum } from '@/models/LopHocPhan';
import { ChitietChuongTrinhDaoTaoService } from '@/services/ChitietChuongTrinhDaoTaoService';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import { IOption, KetQuaHocBa } from '@/types/options';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as yup from 'yup';
import React, { useEffect, useMemo } from 'react'
import { SinhVienService } from '@/services/SinhVienService';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { HocBaService } from '@/services/HocBaService';
import { useNotifications } from '@toolpad/core';


interface ModalEditProps {
    open: boolean;
    handleClose: () => void;
    idHocBa: string
}
export interface IFormData {
  DiemTongKet: number;
  KetQua: IOption;
  SinhVien: IOption;
  LopHocPhan: IOption;
  ChiTietChuongTrinhDaoTao: IOption;
}

const ModalEdit = ({ open, handleClose,idHocBa }: ModalEditProps) => {
  const queryClient = useQueryClient();
  const notification = useNotifications();
    const {data} = useQuery({
        queryKey: ['hoc-ba', idHocBa],
        queryFn: async () => {
          if (!idHocBa) return null;
          const response = await HocBaService.getHocBaById(idHocBa).catch(() => null);
          return response;
        },
        refetchOnWindowFocus: false,
        enabled: open && !!idHocBa
    })
     const schema = useMemo(() => {
        return yup.object().shape({
          DiemTongKet: yup
            .number()
            .min(0, 'Điểm tổng kết không hợp lệ')
            .max(10, 'Điểm tổng kết tối đa 10')
            .required('Điểm tổng kết không được để trống'),
        });
      }, [data]);
     const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control
      } = useForm<IFormData | any>({
        mode: 'onChange',
        resolver: yupResolver(schema),
        defaultValues: {
          DiemTongKet: 0,
        }
      });
      const mutateUpdateHocBa = useMutation({
        mutationFn: async (formData: IFormData) => {
          const result = await HocBaService.updateHocBa(idHocBa, formData);
          return result;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['hoc-ba-list'], exact: false});
          notification.show('Cập nhật học bạ thành công',{
            severity: 'success',
            autoHideDuration: 3000
          });
          handleClose();
          reset();
        },
        onError: (error: any) => {
          notification.show(error?.Message || 'Cập nhật học bạ thất bại',{
            severity: 'error',
            autoHideDuration: 3000
          });
        }
      })
      const handleSubmitForm = (formData: IFormData) => {
        mutateUpdateHocBa.mutate(formData);
      };
      useEffect(() => {
        if (data) {
          reset({
            DiemTongKet: data.diemTongKet,
            KetQua: KetQuaHocBa.find((item) => item.id === data.ketQua) || null,
            SinhVien: {
              id: data.sinhVien?.id,
              name: data.sinhVien?.hoTen
            },
            LopHocPhan: data.lopHocPhan ? {
              id: data.lopHocPhan?.id,
              name: data.lopHocPhan?.maHocPhan
            } : null,
            ChiTietChuongTrinhDaoTao: {
              id: data.chiTietChuongTrinhDaoTao?.id,
              name: data.chiTietChuongTrinhDaoTao?.chuongTrinhDaoTao?.tenChuongTrinh
            }
          });
        }
      }, [reset, data]);
  return (
     <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        slotProps={{
          paper: {
            component: 'form',
            sx: {
              maxWidth: '600px',
              width: '100%',
              backgroundColor: 'white',
            },
            onSubmit: handleSubmit(handleSubmitForm),
          }
        }}
      >
        <DialogTitle id="alert-dialog-title" className="text-lg font-semibold text-blue-600">
          Thay đổi thông tin học bạ
        </DialogTitle>
        <DialogContent>
           <Grid container spacing={2} rowSpacing={1}>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Box className='flex flex-col gap-1'>
                <Typography className='!text-[16px] !font-[500] !leading-6 !text-gray-500 mb-1'>Họ và Tên</Typography>
                <Box
                  className='rounded bg-gray-100 px-3 py-2 border border-gray-200 text-[15px] text-gray-800 font-medium'
                  style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}
                >
                  {data?.sinhVien?.hoTen || ''}
                </Box>
              </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Box className='flex flex-col gap-1'>
                <Typography className='!text-[16px] !font-[500] !leading-6 !text-gray-500 mb-1'>Lớp học phần</Typography>
                <Box
                  className='rounded bg-gray-100 px-3 py-2 border border-gray-200 text-[15px] text-gray-800 font-medium'
                  style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}
                >
                  {data?.lopHocPhan?.maHocPhan || ''}
                </Box>
              </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Input2
            {...register('DiemTongKet')}
            title='Điểm tổng kết'
            placeholder='Nhập điểm tổng kết'
            error={errors?.DiemTongKet?.message}
            isDisabled={false}
            type='text'
          />
              </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Box className='flex flex-col gap-1'>
                <Typography className='!text-[16px] !font-[500] !leading-6 !text-gray-500 mb-1'>Chương trình đào tạo</Typography>
                <Box
                  className='rounded bg-gray-100 px-3 py-2 border border-gray-200 text-[15px] text-gray-800 font-medium'
                  style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}
                >
                  {data?.chiTietChuongTrinhDaoTao?.chuongTrinhDaoTao?.tenChuongTrinh || ''}
                </Box>
              </Box>
              </Grid>
      </Grid>
        </DialogContent>
        <DialogActions className='!pb-5 !px-5'>
          <Button type='button' onClick={handleClose} className='!border !border-solid !text-[14px] !leading-6' >Hủy</Button>
          <Button type='submit' onClick={handleClose} className='!border !text-white !border-solid !text-[14px] !leading-6 !bg-blue-600 hover:!bg-blue-500 ' >Lưu</Button>
        </DialogActions>
      </Dialog>
  )
}

export default ModalEdit