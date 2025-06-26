'use client';
import React from 'react';
import ContentForm from '../../components/form/ContentForm';
import { useNotifications } from '@toolpad/core';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { GiangVienService } from '@/services/GiangVienService';
import { LopHocPhanService } from '@/services/LopHocPhanService';
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
    queryKey: ['lop-hoc-phan', { id: id }],
    queryFn: async () => {
      const result = await LopHocPhanService.getLopHocPhanById(id);
      return result;
    },
    initialData: initialData,
    refetchOnWindowFocus: false,
    gcTime: 0
  });

  const mutationUpdate = useMutation({
    mutationKey: ['edit-lop-hoc-phan', { id: id }],
    mutationFn: async (data: FormData) => {
      const result = await LopHocPhanService.updateLopHocPhan(id, data);
      return result;
    },
    onSuccess: async (data: any) => {
      notifications.show('Thay đổi thành công', {
        severity: 'success',
        autoHideDuration: 5000
      });
      await queryClient.invalidateQueries({ queryKey: ['lop-hoc-phan-list'], exact: false });
      router.push('/lop-hoc-phan');
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
          monHocs: anotherData?.monHocs,
          giangViens: anotherData?.giangViens
        }}
      />
    </motion.div>
  );
};

export default Content;
