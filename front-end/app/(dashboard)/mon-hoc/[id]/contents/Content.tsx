'use client';
import React, { use, useEffect } from 'react';
import ContentForm from '../../components/form/ContentForm';
import { useNotifications } from '@toolpad/core';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { GiangVienService } from '@/services/GiangVienService';
import { SinhVienService } from '@/services/SinhVienService';
import { KhoaService } from '@/services/KhoaService';
import { MonHocService } from '@/services/MonHocService';
import { useBreadcrumb } from '@/hooks/context/BreadCrumbContext';
import { Typography } from '@mui/material';
interface IContentProps {
  initialData: any;
  anotherData?: any;
  id: string;
}
const Content = ({ initialData, id, anotherData }: IContentProps) => {
  const notifications = useNotifications();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setTitle, setBreadcrumbs } = useBreadcrumb();
  const { data } = useQuery({
    queryKey: ['mon-hoc', { id: id }],
    queryFn: async () => {
      const result = await MonHocService.getMonHocById(id);
      return result;
    },
    initialData: initialData,
    refetchOnWindowFocus: false,
    gcTime: 0
  });
  useEffect(() => {
    if(data){
      setTitle(`Chỉnh sửa: ${data?.tenMonHoc}`);
      setBreadcrumbs(
          <Typography className="relative text-[14px] flex gap-1 items-center">
          <Typography component={'span'} sx={(theme) => ({
            color: theme.palette.mode === 'dark' ? 'white !important' : 'black !important',
            fontWeight: 500
          })}>
            {data?.tenMonHoc}
          </Typography>
          </Typography>
      )
      return () => {
        setTitle('')
        setBreadcrumbs(null);
      };
    }
  }, [data, setTitle, setBreadcrumbs]);
  const mutationUpdate = useMutation({
    mutationFn: async (data: FormData) => {
      const result = await MonHocService.updateMonHoc(id, data);
      return result;
    },
    onSuccess: async (data: any) => {
      notifications.show('Thay đổi thành công', {
        severity: 'success',
        autoHideDuration: 5000
      });
      await queryClient.invalidateQueries({ queryKey: ['khoa-list'], exact: false });
      router.push('/mon-hoc');
    },
    onError: (error: any) => {
      notifications.show(error.Message, {
        severity: 'error',
        autoHideDuration: 5000
      });
    }
  });
  const handleSubmitForm = (formData: any) => {
    mutationUpdate.mutate(formData);
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <ContentForm
        onSubmit={handleSubmitForm}
        data={data}
        initialData={{
          khoas: anotherData?.khoas
        }}
      />
    </motion.div>
  );
};

export default Content;
