'use client';
import React, { FC, useEffect } from 'react';
import ContentForm from '../../components/form/ContentForm';
import { motion } from 'motion/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@toolpad/core';
import { useRouter } from 'next/navigation';
import { KhoaService } from '@/services/KhoaService';
import { useBreadcrumb } from '@/hooks/context/BreadCrumbContext';
interface ContentProps {
  initialData?: any;
  anotherData?: any;
}

const Content: FC<ContentProps> = ({ initialData, anotherData }) => {
  const notification = useNotifications();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setTitle } = useBreadcrumb();
  const mutationCreate = useMutation({
    mutationFn: async (formData: any) => {
      const response = await KhoaService.createKhoa(formData);
      return response;
    },
    onSuccess: (data) => {
      notification.show('Thêm thành công', {
        severity: 'success',
        autoHideDuration: 5000
      });
      queryClient.invalidateQueries({
        queryKey: ['khoa-list'],
        exact: false
      });
      router.push('/khoa');
    },
    onError: (error) => {
      notification.show('Thêm thất bại', {
        severity: 'error',
        autoHideDuration: 5000
      });
    }
  });
  useEffect(() => {
    setTitle('Thêm mới khoa');
    return () => setTitle('');
  }, []);
  const handleSubmitForm = (formData: any) => {
    mutationCreate.mutate(formData);
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <ContentForm onSubmit={handleSubmitForm} />
    </motion.div>
  );
};

export default Content;
