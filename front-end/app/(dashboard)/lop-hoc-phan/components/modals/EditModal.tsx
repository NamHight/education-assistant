import Input2 from '@/components/inputs/Input2';
import InputSelect2 from '@/components/selects/InputSelect2';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import { IOption, TrangThaiLopHocPhan } from '@/types/options';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@toolpad/core';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

interface IEditModalProps {
  open: boolean;
  onClose: () => void;
  id: string | null;
}
export interface IFormData {
  siSo?: string;
  trangThai?: IOption;
}

const EditModal = ({ open, onClose, id }: IEditModalProps) => {
  const notification = useNotifications();
  const queryClient = useQueryClient();
  const schema = useMemo(() => {
    return yup.object().shape({
      siSo: yup
        .number()
        .required('Sỉ số là bắt buộc')
        .transform((value: any, originalValue: any) => (originalValue === '' ? null : value))
        .min(0, 'Sỉ số không được nhỏ hơn 0'),
      trangThai: yup.object().required('Trạng thái là bắt buộc')
    });
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue
  } = useForm<IFormData | any>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      hocKy: null,
      maHocPhan: '',
      siSo: 0
    }
  });
  const { data: lopHocPhan } = useQuery({
    queryKey: ['lop-hoc-phan', { id: id }],
    queryFn: async () => {
      const result = await LopHocPhanService.getLopHocPhanById(id);
      return result;
    },
    refetchOnWindowFocus: false,
    gcTime: 0,
    enabled: !!id
  });

  const mutationUpdate = useMutation({
    mutationFn: async (data: FormData) => {
      const result = await LopHocPhanService.updateLopHocPhan(id, data);
      return result;
    },
    onSuccess: (data: any) => {
      notification.show('Thay đổi thành công', {
        severity: 'success',
        autoHideDuration: 5000
      });
      queryClient.invalidateQueries({ queryKey: ['lop-hoc-phan-list'], exact: false });
      onClose();
      reset();
    },
    onError: (error: any) => {
      notification.show(error.Message, {
        severity: 'error',
        autoHideDuration: 5000
      });
    }
  });
  useEffect(() => {
    if (lopHocPhan) {
      reset({
        siSo: lopHocPhan.siSo || 0,
        trangThai: TrangThaiLopHocPhan.find((item) => item.id === lopHocPhan.trangThai) || null
      });
    }
  }, [reset, lopHocPhan]);
  const handleSubmitForm = (data: IFormData) => {
    const formData = new FormData();
    if (lopHocPhan?.id) formData.append('id', String(lopHocPhan.id));
    formData.append('siSo', String(data.siSo || 0));
    formData.append('trangThai', String(data.trangThai?.id));
    mutationUpdate.mutate(formData);
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        reset();
      }}
      slotProps={{
        paper: {
          className: 'p-2 w-[500px] max-w-full',
          component: 'form',
          onSubmit: handleSubmit(handleSubmitForm)
        }
      }}
    >
      <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} rowSpacing={1}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
            <Input2
              {...register('siSo')}
              title='Sỉ số'
              placeholder='Nhập sỉ sổ'
              error={errors.siSo?.message}
              isDisabled={false}
              type='number'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
            <InputSelect2
              control={control}
              fullWidth
              name={'trangThai'}
              placeholder={'Trạng thái'}
              title={'Trạng thái'}
              data={TrangThaiLopHocPhan ?? []}
              getOptionKey={(option) => option.id}
              getOptionLabel={(option: any) => option.name}
              error={(errors.trangThai as any)?.message}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          title='hủy'
          onClick={() => {
            onClose();
            reset();
          }}
          type='button'
        >
          Hủy
        </Button>
        <Button title='Cập nhật' type='submit'>
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;
