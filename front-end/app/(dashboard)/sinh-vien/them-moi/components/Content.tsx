'use client';
import React, { FC } from 'react';
import ContentForm from '../../components/form/ContentForm';
import { motion } from 'motion/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@toolpad/core';
import { useRouter } from 'next/navigation';
import { SinhVienService } from '@/services/SinhVienService';
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
      const response = await SinhVienService.createSinhVien(formData);
      return response;
    },
    onSuccess: (data) => {
      notification.show('Thêm thành công', {
        severity: 'success',
        autoHideDuration: 5000
      });
      queryClient.invalidateQueries({
        queryKey: ['sinh-vien-list'],
        exact: false
      });
      router.push('/sinh-vien');
    },
    onError: (error: any) => {
      notification.show(error?.Message || 'Thêm thất bại', {
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
          lopHocs: anotherData?.lopHocs
        }}
      />
    </motion.div>
  );
};

export default Content;
