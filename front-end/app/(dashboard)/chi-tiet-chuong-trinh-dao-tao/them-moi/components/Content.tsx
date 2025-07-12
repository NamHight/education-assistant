'use client';
import { alpha, Box, Divider, FormControl, Grid, TextField, Typography } from '@mui/material';
import React, { FC, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import ContentForm from '../../components/form/ContentForm';
import { motion } from 'motion/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@toolpad/core';
import { GiangVienService } from '@/services/GiangVienService';
import { useRouter } from 'next/navigation';
import { SinhVienService } from '@/services/SinhVienService';
import { KhoaService } from '@/services/KhoaService';
import { MonHocService } from '@/services/MonHocService';
import { NganhService } from '@/services/NganhService';
import { BoMonService } from '@/services/BoMonService';
import { PhongHocService } from '@/services/PhongHocService';
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';
import { ChitietChuongTrinhDaoTaoService } from '@/services/ChitietChuongTrinhDaoTaoService';
import ListMonHoc from './ListMonHoc';
import { ref } from 'yup';
interface ContentProps {
  initialData?: any;
  anotherData?: any;
}
const queryKey = 'danh-sach-mon-hoc-chi-tiet-chuong-trinh-dao-tao';
const Content: FC<ContentProps> = ({ initialData, anotherData }) => {
  const notification = useNotifications();
  const [khoas, setkhoas] = useState<any[]>([]);
  const refForm = useRef<{ handleResetForm: (data: any) => void; setValue: (name: string, value: any) => void }>(null);
  const router = useRouter();
  const [filter, setFilter] = useState<{
    chuongTrinhDaoTaoId?: string;
    boMonId?: string | number | null;
    hocKy?: string | number | null;
    monHocId?: string | null;
  } | null>(null);
  const queryClient = useQueryClient();
  const mutationCreate = useMutation({
    mutationFn: async (formData: any) => {
      const response = await ChitietChuongTrinhDaoTaoService.createChiTietChuongTrinhDaoTao(formData);
      return response;
    },
    onSuccess: async (data) => {
      console.log('Thêm chi tiết chương trình đào tạo thành công:', data);
      notification.show('Thêm thành công', {
        severity: 'success',
        autoHideDuration: 5000
      });
      queryClient.invalidateQueries({
        queryKey: ['chi-tiet-chuong-trinh-dao-tao-list'],
        exact: false
      });
      setFilter({
        chuongTrinhDaoTaoId: data?.chuongTrinhDaoTaoId || null,
        boMonId: data?.boMonId || null,
        hocKy: data?.hocKy || null,
        monHocId: data?.monHocId || null
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKey],
        exact: false
      });
      refForm.current?.setValue('SoTinChi', 0);
      refForm.current?.setValue('LoaiMonHoc', null);
      refForm.current?.setValue('HocKy', null);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className='flex flex-col gap-3'
    >
      <ContentForm
        setKhoas={setkhoas}
        ref={refForm}
        initialData={{
          chuongTrinhDaoTaos: anotherData.chuongTrinhDaoTaos || [],
          khoas: anotherData.khoas || []
        }}
        onSubmit={handleSubmitForm}
      />
      <Divider className='!my-2 !bg-amber-200' />
      <Box className='flex flex-col gap-3'>
        <ListMonHoc
          khoas={khoas}
          monHocId={filter?.monHocId}
          queryKey={queryKey}
          chuongTrinhDaoTaoId={filter?.chuongTrinhDaoTaoId}
          hocKy={filter?.hocKy}
        />
      </Box>
    </motion.div>
  );
};

export default Content;
