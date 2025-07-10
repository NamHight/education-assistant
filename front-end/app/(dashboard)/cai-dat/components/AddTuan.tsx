"use client"
import DatePicke from '@/components/datepickes/DatePicke'
import Input2 from '@/components/inputs/Input2'
import InputSelect2 from '@/components/selects/InputSelect2'
import { TuanService } from '@/services/TuanService'
import { IOption, yearOptions } from '@/types/options'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useNotifications } from '@toolpad/core'
import clsx from 'clsx'
import { CalendarCog } from 'lucide-react'

import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
export interface IFormData {
  NamHoc : IOption | null;
  NgayBatDau : Date;
}
const AddTuan = () => {
  const notification = useNotifications();
  const schema = useMemo(() => {
          return yup.object().shape({
            NamHoc: yup.object().required('Năm học không được để trống'),
            NgayBatDau: yup.date().required('Ngày bắt đầu không được để trống')
          });
        }, []);
       const {
          handleSubmit,
          formState: { errors },
          reset,
          control,
          setValue
        } = useForm<IFormData | any>({
          mode: 'onChange',
          resolver: yupResolver(schema),
          defaultValues: {
            NamHoc: null,
            NgayBatDau: null
          }
        });
        const mutationAddTuan = useMutation({
          mutationFn: async (data: FormData) =>{
            const result = await TuanService.createTuanAuto(data);
            return result;
          },
          onSuccess: () => {
            notification.show('Tạo tuần thành công', {
              severity: 'success',
              autoHideDuration: 3000,
            });
            reset();
setValue('NamHoc', null);
setValue('NgayBatDau', null);
        
          },
          onError: (error: any) => {
            notification.show(error?.Message || 'Tạo tuần thất bại', {
              severity: 'error',
              autoHideDuration: 3000,
            });
        
          }
        })
        const onSubmit = async (data: IFormData) => {
          const formData = new FormData();
          if(!data.NamHoc || !data.NgayBatDau) {
            notification.show('Vui lòng chọn đầy đủ thông tin', {
              severity: 'warning',
              autoHideDuration: 3000,
            });
            return;
          }
          formData.append('NamHoc', String(data.NamHoc.id));
          formData.append('NgayBatDau', data.NgayBatDau.toISOString());
          mutationAddTuan.mutate(formData);
        }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full justify-between gap-2 flex-col  border border-gray-200 rounded-lg py-3 px-4 shadow-sm">
        <Box className="flex items-center gap-3">
          <CalendarCog className="h-6 w-6"/>
          <Typography className="!text-[18px] !font-[600] !leading-7">Thêm Tuần vào năm học</Typography>
        </Box>
        <Box className="flex items-center gap-4 w-full">
          <Box  className="flex items-center gap-4 w-full">
        <Box className="flex items-center">
          <Typography className={clsx("!text-[16px] !font-[500] !leading-6 ", {
              '!text-gray-500': !errors?.NamHoc?.message,
              '!text-red-600': !!errors?.NamHoc?.message
            })} >Năm Học</Typography>
        </Box>
         <Box className="flex-1">
          <InputSelect2
                    control={control}
                    fullWidth
                    name={'NamHoc'}
                    placeholder={'Chọn năm học'}
                    data={yearOptions ?? []}
                    getOptionKey={(option) => option.id}
                    getOptionLabel={(option: any) => option.name}
                    error={(errors.NamHoc as any)?.message}
                  />
         </Box>
        </Box>
        <Box  className="flex items-center gap-4 w-full">
        <Box className="flex items-center">
          <Typography className={clsx("!text-[16px] !font-[500] !leading-6 ", {
              '!text-gray-500': !errors?.NgayBatDau?.message,
              '!text-red-600': !!errors?.NgayBatDau?.message
            })} >Ngày Bắt Đầu</Typography>
        </Box>
        <Box className="flex-1">
          
         <DatePicke
              control={control}
              name='NgayBatDau'
              placeholder='Chọn ngày bắt đầu'
              error={errors.NgayBatDau?.message}
              isDisabled={false}
              fullWidth
            />
            </Box>
        </Box>
        <Box className='flex items-center justify-end'>
          <button
            type='submit'
            className='flex items-center gap-3 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition-all duration-200 ease-in-out shadow-sm text-white font-semibold text-base leading-6 hover:transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <Typography className='text-lg text-white leading-6 font-semibold'>Lưu</Typography>
          </button>
        </Box>
        </Box>
    </form>
  )
}

export default AddTuan