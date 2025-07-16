import InputSelect2 from '@/components/selects/InputSelect2';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import { NganhService } from '@/services/NganhService';
import { HocKyLopHocPhan, IOption, yearOptions } from '@/types/options';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@toolpad/core';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
export interface IFormData {
  Nganh?: IOption;
  HocKy?: IOption;
  Khoa?: IOption;
}

interface IAddModalProps {
  openAdd: boolean;
  handleCloseAdd: () => void;
}
const AddModal = ({ openAdd, handleCloseAdd }: IAddModalProps) => {
  const notification = useNotifications();
  const queryClient = useQueryClient();
  const schema = useMemo(() => {
    return yup.object().shape({
      Nganh: yup.object().required('Ngành là bắt buộc'),
      HocKy: yup.object().required('Học kỳ là bắt buộc'),
      Khoa: yup.object().required('Khoá là bắt buộc')
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
      Nganh: null,
      HocKy: null,
      Khoa: null
    }
  });
  const { data: nganhs, isLoading: isLoadingNganh } = useQuery({
    queryKey: ['nganhs'],
    queryFn: async () => {
      const response = await NganhService.getAllNganhNoPage();
      return response;
    },
    select: (data: any) => {
      return data.map((item: any) => ({
        id: item.id,
        name: item.tenNganh
      }));
    },
    enabled: openAdd,
    refetchOnWindowFocus: false
  });
  const mutationCreate = useMutation({
    mutationFn: async (data: FormData) => {
      const result = await LopHocPhanService.createLopHocPhanAuto(data);
      return result;
    },
    onSuccess: async (data: any) => {
      notification.show('Thêm lớp học phần thành công', {
        severity: 'success',
        autoHideDuration: 5000
      });
      await queryClient.invalidateQueries({ queryKey: ['lop-hoc-phan-list'], exact: false });
      handleCloseAdd();
      reset();
    },
    onError: (error: any) => {
      notification.show(error.Message, {
        severity: 'error',
        autoHideDuration: 5000
      });
    }
  });
  const handleSubmitData = async (data: IFormData) => {
    const formData = new FormData();
    formData.append('NganhId', String(data?.Nganh?.id));
    formData.append('HocKy', String(data?.HocKy?.id));
    formData.append('Khoa', String(data?.Khoa?.id));
    await mutationCreate.mutateAsync(formData);
  };

  return (
    <Dialog
      open={openAdd}
      onClose={() => {
        handleCloseAdd();
        reset();
      }}
      slotProps={{
        paper: {
          className: 'p-2 w-[500px] max-w-full',
          component: 'form',
          onSubmit: handleSubmit(handleSubmitData)
        }
      }}
    >
      <DialogTitle>Thêm mới lớp học phần</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} rowSpacing={1}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
            <InputSelect2
              control={control}
              fullWidth
              name={'Nganh'}
              placeholder={'Ngành'}
              title={'Ngành'}
              isLoading={isLoadingNganh}
              data={nganhs ?? []}
              getOptionKey={(option) => option.id}
              getOptionLabel={(option: any) => option.name}
              error={(errors.Nganh as any)?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
            <InputSelect2
              control={control}
              fullWidth
              name={'HocKy'}
              placeholder={'Học kỳ'}
              title={'Học kỳ'}
              data={HocKyLopHocPhan ?? []}
              getOptionKey={(option) => option.id}
              getOptionLabel={(option: any) => option.name}
              error={(errors.HocKy as any)?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
            <InputSelect2
              control={control}
              fullWidth
              name={'Khoa'}
              placeholder={'Khoá'}
              title={'Khoá'}
              data={yearOptions ?? []}
              getOptionKey={(option) => option.id}
              getOptionLabel={(option: any) => option.name}
              error={(errors.Khoa as any)?.message}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button title='hủy' onClick={handleCloseAdd} type='button'>
          Hủy
        </Button>
        <Button title='Thêm' type='submit' className='!bg-blue-500 !text-white hover:!bg-blue-600'>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddModal;
