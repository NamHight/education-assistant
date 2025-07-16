"use client"
import { LoaiTaiKhoaEnum } from '@/models/TaiKhoan';
import { Box, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ContentAdmin from './ContentAdmin';
import { PopoverLockProvider } from '@/hooks/context/PopoverLock';
import Content from './Content';
import { init } from 'next/dist/compiled/webpack/webpack';
import { useQuery } from '@tanstack/react-query';
import { AuthenticateService } from '@/services/AuthenticateService';


interface IContainerProps {
    role: number;
    queryKey: string;
    user?: any;
}

const Container = ({role, queryKey,user} : IContainerProps) => {
    const [isCheckAdmin, setisCheckAdmin] = useState<boolean>(role === LoaiTaiKhoaEnum.ADMIN)
    const {data} = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await AuthenticateService.getMe();
            return response;
        },
        initialData:user,
        refetchOnWindowFocus: false,
    });
    useEffect(() => {
      if(!user && data){
        setisCheckAdmin(data?.taiKhoan?.loaiTaiKhoan === LoaiTaiKhoaEnum.ADMIN);
      }
    }, [data])
    
  return (
    <Box className="flex flex-col gap-4">
        {
        role === LoaiTaiKhoaEnum.ADMIN && (
            <Box className="flex justify-end">
                <Button  className='!bg-blue-600 hover:!bg-blue-500 !px-3 !text-white' onClick={() => setisCheckAdmin(!isCheckAdmin)}>
                    {isCheckAdmin ? 'Đổi qua nhập điểm' : 'Đổi qua Admin giao diện'}
                </Button>
            </Box>
        )}
        {isCheckAdmin ? (
        <ContentAdmin />
      ) : (
    <PopoverLockProvider>
          <Content queryKey={queryKey} />
      </PopoverLockProvider>
      )}
    </Box>
  )
}

export default Container