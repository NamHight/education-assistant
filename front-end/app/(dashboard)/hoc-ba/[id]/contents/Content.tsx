'use client';
import React from 'react';
import ContentForm from '../../components/form/ContentForm';
import { useNotifications } from '@toolpad/core';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { HocBaService } from '@/services/HocBaService';
interface IContentProps {
  initialData: any;
  anotherData?: any;
  id: string;
}
const Content = ({ initialData, id, anotherData }: IContentProps) => {
  const notifications = useNotifications();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ['hoc-ba', { id: id }],
    queryFn: async () => {
      const result = await HocBaService.getHocBaById(id);
      return result;
    },
    initialData: initialData,
    refetchOnWindowFocus: false,
    gcTime: 0
  });
  const mutationUpdate = useMutation({
    mutationFn: async (data: FormData) => {
      const result = await HocBaService.updateHocBa(id, data);
      return result;
    },
    onSuccess: async (data: any) => {
      notifications.show('Thay đổi thành công', {
        severity: 'success',
        autoHideDuration: 5000
      });
      await queryClient.invalidateQueries({ queryKey: ['hoc-ba'], exact: false });
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
          sinhViens: anotherData?.sinhViens,
          lopHocPhans: anotherData?.lopHocPhans,
          chiTietChuongTrinhDaoTaos: anotherData?.chiTietChuongTrinhDaoTaos
        }}
      />
    </motion.div>
  );
};

export default Content;
