'use client';
import React, { FC, useEffect } from 'react';
import ContentForm from '../../components/form/ContentForm';
import { motion } from 'motion/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@toolpad/core';
import { useRouter } from 'next/navigation';
import { BoMonService } from '@/services/BoMonService';
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
      const response = await BoMonService.createBoMon(formData);
      return response;
    },
    onSuccess: (data) => {
      notification.show('Thêm thành công', {
        severity: 'success',
        autoHideDuration: 4000
      });
      queryClient.invalidateQueries({
        queryKey: ['bo-mon-list'],
        exact: false
      });
      router.push('/bo-mon');
    },
    onError: (error) => {
      notification.show('Thêm thất bại', {
        severity: 'error',
        autoHideDuration: 4000
      });
    }
  });
  useEffect(() => {
    setTitle('Thêm mới bộ môn');
    return () => setTitle('');
  }, []);
  const handleSubmitForm = (formData: any) => {
    mutationCreate.mutate(formData);
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <ContentForm
        onSubmit={handleSubmitForm}
        initialData={{
          khoas: anotherData?.khoas
        }}
      />
    </motion.div>
  );
};

export default Content;
