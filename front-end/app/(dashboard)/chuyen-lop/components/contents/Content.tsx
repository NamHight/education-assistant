'use client';
import React from 'react';
import InputSelect2 from '@/components/selects/InputSelect2';
import { LopHocService } from '@/services/LopHocService';
import { SinhVienService } from '@/services/SinhVienService';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@toolpad/core';
import { SaveIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckIcon from '@mui/icons-material/Check';
import { error } from 'console';
import { useBreadcrumb } from '@/hooks/context/BreadCrumbContext';

interface ContentProps {
  query?: string;
  initialData?: any;
}
const Content = ({ query, initialData }: ContentProps) => {
  const queryKey = 'all-sinh-vien-by-lop-hoc';
  const router = useRouter();
  const notification = useNotifications();
  const queryClient = useQueryClient();
  const [lopHocHienTaiId, setLopHocHienTaiId] = useState('');
  const [lopHocChuyenDenId, setLopHocChuyenDenId] = useState('');
  const [sinhVienDaChonIds, setSinhVienDaChonIds] = useState<string[]>([]);
  const [sinhVienDaChon, setSinhVienDaChon] = useState<any[]>([]);
  const {setTitle} = useBreadcrumb();
  const { data: lopHocs, isLoading: isLoadingLopHoc } = useQuery({
    queryKey: ['lophocs-chuyen-lop'],
    queryFn: async () => {
      const result = await LopHocService.getLopHocNoPage();
      return result;
    },
    initialData: initialData?.lopHocs,
    select: (data) => {
      return data.map((item: any) => ({
        id: item.id,
        name: item.maLopHoc
      }));
    },
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    setSinhVienDaChon([]);
    setSinhVienDaChonIds([]);
  }, [lopHocHienTaiId]);

  const { data: sinhViens, isLoading: isLoadingSinhVien } = useQuery({
    queryKey: [queryKey, lopHocHienTaiId],
    queryFn: async () => {
      const result = await SinhVienService.getAllSinhVienByLopHoc(lopHocHienTaiId);
      return result;
    },
    refetchOnWindowFocus: false,
    enabled: !!lopHocHienTaiId,
  });

  const mutationChuyenLop = useMutation({
    mutationFn: async (formData: any) => {
      const response = await SinhVienService.ChuyenLopSinhVien(formData);
      return response;
    },
    onSuccess: (data) => {
      notification.show('Chuyển thành công', {
        severity: 'success',
        autoHideDuration: 5000
      });
      setLopHocChuyenDenId('');
      setSinhVienDaChon([]);
      setSinhVienDaChonIds([]);
      queryClient.invalidateQueries({
        queryKey: [queryKey, lopHocHienTaiId]
      });
      queryClient.invalidateQueries({
        queryKey: [queryKey, lopHocChuyenDenId]
      });
    },
    onError: (error: any) => {
      notification.show(error?.Message, {
        severity: 'error',
        autoHideDuration: 5000
      });
    }
  });

  const handleSinhVienDachon = (sv: any) => {
    const { id } = sv;
    setSinhVienDaChonIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    setSinhVienDaChon((prev) => {
      const exists = prev.find((x) => x.id === id);
      if (exists) {
        return prev.filter((x) => x.id !== id);
      } else {
        return [...prev, sv];
      }
    });
  };

  const handleSinhVienLuuChuyenLop = () => {
    if (!lopHocHienTaiId || !lopHocChuyenDenId || sinhVienDaChonIds.length === 0) {
      notification.show('Vui lòng đầy đủ thông tin', {
        severity: 'error',
        autoHideDuration: 5000
      });
      return;
    }
    if (lopHocHienTaiId == lopHocChuyenDenId) {
      notification.show('Lớp học hiện tại và lớp học chuyển đến không được giống nhau', {
        severity: 'error',
        autoHideDuration: 5000
      });
      return;
    }
    const formData = {
      SinhVienIds: sinhVienDaChonIds,
      LopHocId: lopHocChuyenDenId
    };
    mutationChuyenLop.mutate(formData);
  };
  useEffect(() => {
    setTitle('Chuyển lớp');
    return () => setTitle('');
  },[setTitle]);
  return (
    <Box className='flex flex-col gap-4'>
      <Box display='flex' gap={2} className='border border-gray-200 rounded-lg p-4 shadow-sm'>
        <InputSelect2
          fullWidth
          name={'lophochientaiid'}
          placeholder={'Chọn lớp hiện tại'}
          isLoading={isLoadingLopHoc}
          title={'Lớp học hiện tại'}
          data={lopHocs ?? []}
          getOptionKey={(option) => option.id}
          getOptionLabel={(option) => option.name}
          getOnChangeValue={(option) => setLopHocHienTaiId(option?.id)}
        />
        <InputSelect2
          fullWidth
          name={'chuyenlopid'}
          placeholder={'Lớp học chuyển đến'}
          isLoading={isLoadingLopHoc}
          title={'Lớp học chuyển đến'}
          data={lopHocs ?? []}
          getOptionKey={(option) => option.id}
          getOptionLabel={(option) => option.name}
          getOnChangeValue={(option) => setLopHocChuyenDenId(option?.id)}
        />
      </Box>
      <Box display='flex' gap={2}>
        <Box flex={1} className='border border-gray-200 rounded-lg p-4 shadow-sm'>
          <Typography className='mb-6'>Danh sách sinh viên</Typography>
          {
            <Box className='flex flex-col mt-4 gap-2 h-[300px] overflow-y-auto'>
              {isLoadingSinhVien ? <Box>
                <Typography className='text-gray-500'>Đang tải danh sách sinh viên...</Typography>
              </Box> : sinhViens?.length > 0 ?
                sinhViens.map((sv: any) => (
                  <Box
                    key={sv.id}
                    className={`flex items-center justify-between border p-2 rounded ${sinhVienDaChonIds.includes(sv.id) ? '' : 'border-gray-200'}`}
                  >
                    <Box className='flex items-center justify-start'>
                      <Typography className='w-[100px] pr-3'>{sv.mssv}</Typography>
                      <Typography>{sv.hoTen}</Typography>
                    </Box>
                    {sinhVienDaChonIds.includes(sv.id) ? (
                      <Button
                        onClick={() => handleSinhVienDachon(sv)}
                        className='!w-[14px] !h-[14px] hover:!bg-transparent hover:!text-inherit'
                        title='Đã chọn'
                      >
                        <CheckIcon />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleSinhVienDachon(sv)}
                        className='!w-[14px] !h-[14px] hover:!bg-transparent hover:!text-inherit'
                        title='Chưa chọn'
                      >
                        <CheckBoxOutlineBlankOutlinedIcon />
                      </Button>
                    )}
                  </Box>
                )) : (
                  <Box className='flex items-center justify-center h-full'>
                    <Typography className='text-gray-500'>Không có sinh viên nào</Typography>
                  </Box>
                )
              }
            </Box>
          }
        </Box>
        <Box flex={1} className='border border-gray-200 rounded-lg p-4 shadow-sm'>
          <Typography className='mb-6'>Danh sách sinh viên sẽ được chuyển</Typography>
          {sinhVienDaChon.length > 0 ? (
            <Box className='flex flex-col mt-4 gap-2 h-[300px] overflow-y-auto'>
              {sinhVienDaChon.map((sv: any) => (
                <Box key={sv.id} className='flex items-center justify-between border p-2 rounded bg-blue-50'>
                  <Box className='flex items-center justify-start'>
                    <Typography className='w-[100px] pr-4'>{sv.mssv}</Typography>
                    <Typography>{sv.hoTen}</Typography>
                  </Box>
                  <Button
                    onClick={() => handleSinhVienDachon(sv)}
                    className='!w-[14px] !h-[14px] hover:!bg-transparent hover:!text-inherit'
                    title='Xóa khỏi danh sách'
                  >
                    <CloseIcon />
                  </Button>
                </Box>
              ))}
            </Box>
          ) : null}
        </Box>
      </Box>
      <Box className='flex justify-end'>
        <Button
          onClick={handleSinhVienLuuChuyenLop}
          className='flex items-center gap-3 !bg-blue-500 !px-4 !py-2 rounded !hover:bg-blue-600 transition-all !duration-200 !ease-in-out !shadow-sm !text-white !font-semibold !text-base !leading-6 hover:transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <SaveIcon className='!text-white !w-6 !h-6' />
          <Typography className='!text-lg !text-white !leading-6 !font-semibold'>Lưu</Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default Content;
