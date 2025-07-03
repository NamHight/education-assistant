'use client';
import React from 'react';
import { useNotifications } from '@toolpad/core';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { GiangVienService } from '@/services/GiangVienService';
import { SinhVienService } from '@/services/SinhVienService';
import { KhoaService } from '@/services/KhoaService';
import { MonHocService } from '@/services/MonHocService';
import { NganhService } from '@/services/NganhService';
import { BoMonService } from '@/services/BoMonService';
import { PhongHocService } from '@/services/PhongHocService';
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import ContentForm from './form/ContentForm';
interface IContentProps {
  anotherData?: any;
  id: string;
  query: string;
}
const Content = ({ id, anotherData, query }: IContentProps) => {
  const notifications = useNotifications();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: [query, { id: id }],
    queryFn: async () => {
      const result = await LopHocPhanService.getLopHocPhanByIdServer(id);
      return result;
    },
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000
  });

  const mutationUpdate = useMutation({
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
      <ContentForm onSubmit={handleSubmitForm} data={data} queryKey={query} />
    </motion.div>
  );
};

export default Content;
