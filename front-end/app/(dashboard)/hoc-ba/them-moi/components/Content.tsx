'use client';
import React, { FC } from 'react';
import ContentForm from '../../components/form/ContentForm';
import { motion } from 'motion/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@toolpad/core';
import { useRouter } from 'next/navigation';
import { HocBaService } from '@/services/HocBaService';
interface ContentProps {
  initialData?: any;
  anotherData?: any;
}

const Content: FC<ContentProps> = ({ initialData, anotherData }) => {
  const notification = useNotifications();
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutationCreate = useMutation({
    mutationFn: async (formData: any) => {
      const response = await HocBaService.createHocBa(formData);
      return response;
    },
    onSuccess: (data) => {
      notification.show('Thêm thành công', {
        severity: 'success',
        autoHideDuration: 5000
      });
      queryClient.invalidateQueries({
        queryKey: ['hoc-ba-list'],
        exact: false
      });
      router.push('/hoc-ba');
    },
    onError: (error) => {
      notification.show('Thêm thất bại', {
        severity: 'error',
        autoHideDuration: 5000
      });
    }
  });

  const handleSubmitForm = (formData: any) => {
    mutationCreate.mutate(formData);
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <ContentForm
        onSubmit={handleSubmitForm}
        initialData={{
          sinhViens: anotherData?.sinhViens,
          lopHocPhans: anotherData?.lopHocPhans,
          chiTietChuongTrinhDaoTaos: anotherData?.chiTietChuongTrinhDaoTaos
        }}
      />
    </motion.div>
  );
};

export default Content;
