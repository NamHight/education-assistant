import { Box, Typography } from '@mui/material';
import clsx from 'clsx';
import React, { Fragment } from 'react';
import MessageError from '../texts/MessageError';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller } from 'react-hook-form';
interface IDatePickeProps {
  title?: string;
  error?: string | any;
  name: string;
  isDisabled?: boolean;
  placeholder?: string;
  control?: any;
  fullWidth?: boolean;
  format?: string;
  minDate?: any;
  editAble?: boolean;
  isEditAble?: boolean;
  onClickEdit?: () => void;
  [key: string]: any;
}

const DatePicke = ({
  title,
  error,
  name,
  isDisabled,
  placeholder,
  control,
  fullWidth,
  format,
  minDate,
  editAble,
  isEditAble,
  onClickEdit,
  ...rest
}: IDatePickeProps) => {
  return (
    <Fragment>
      {title && (
        <Box className='flex items-center justify-between'>
          <Typography
            className={clsx('!text-[16px] !font-[500] !leading-6', {
              '!text-gray-500': !error,
              '!text-red-600': !!error
            })}
          >
            {title}
          </Typography>
          {isEditAble &&
            (editAble ? (
              <Typography
                component={'span'}
                className={'text-blue-500 cursor-pointer hover:underline'}
                onClick={onClickEdit}
              >
                Chỉnh sửa
              </Typography>
            ) : (
              <Typography
                type='submit'
                onClick={onClickEdit}
                component={'button'}
                className={'text-blue-500 cursor-pointer hover:underline'}
              >
                Cập nhật
              </Typography>
            ))}
        </Box>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DatePicker
            {...rest}
            minDate={minDate}
            disabled={isDisabled}
            {...field}
            timezone='Asia/Ho_Chi_Minh'
            format={format || 'DD/MM/YYYY'}
            className={clsx('!mb-[5px]', { 'w-full': fullWidth })}
            sx={(theme) => ({
              '& .MuiPickersInputBase-root': {
                borderColor: error ? theme.palette.error.main : theme.palette.grey[600],
                '& fieldset': {
                  borderColor: theme.palette.divider
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main
                }
              }
            })}
            slotProps={{
              openPickerButton: {
                className: '!border-none !hover:bg-transparent !w-[32px] !h-[32px]'
              },
              textField: {
                placeholder: placeholder,
                error: !!error,
                className: '!mb-1',
                fullWidth: fullWidth,
                sx: (theme) => ({
                  '& .MuiPickersOutlinedInput-root': {
                    backgroundColor: isDisabled ? theme.palette.grey[100] : theme.palette.common.white,
                    borderColor: error ? 'red' : theme.palette.grey[600],
                    '& fieldset': {
                      borderColor: theme.palette.divider
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main
                    }
                  }
                })
              }
            }}
          />
        )}
      />
      {error && <MessageError message={error} />}
    </Fragment>
  );
};

export default DatePicke;
