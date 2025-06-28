'use client';
import React, { ReactNode, useState } from 'react';
import MessageError from '../texts/MessageError';
import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { optional } from 'zod';
import clsx from 'clsx';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface InputProps {
  control?: any;
  title?: string;
  placeholder?: string;
  register?: any;
  name?: string;
  type?: string;
  error?: string;
  isDisabled?: boolean;
  options?: ReactNode;
}

const Input = ({ control, title, placeholder, register, name, type, error, isDisabled, options }: InputProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const isPassword = type === 'password';
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  return (
    <Box className='w-full flex flex-col gap-1'>
      {title && (
        <Box className='flex items-center justify-between'>
          <Typography
            sx={{
              color: error && 'oklch(57.7% 0.245 27.325) !important'
            }}
            component={'label'}
            htmlFor={name}
            className={'block !text-[15px] !font-medium text-gray-900'}
          >
            {title}
          </Typography>
          {options}
        </Box>
      )}
      <div className='w-full'>
        <TextField
          {...register(name)}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          disabled={isDisabled}
          fullWidth
          className='!text-gray-900 text-base sm:text-sm/6'
          sx={{
            '& .MuiOutlinedInput-root': {
              borderColor: error && 'oklch(57.7% 0.245 27.325)',
              '& fieldset': {
                borderColor: error && 'oklch(57.7% 0.245 27.325)'
              }
            },
            '& .MuiInputBase-input:-webkit-autofill': {
              WebkitBoxShadow: '0 0 0 100px white inset',
              WebkitTextFillColor: 'currentColor',
              caretColor: 'currentColor',
              borderRadius: 'inherit'
            }
          }}
          InputProps={{
            endAdornment: isPassword ? (
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
                  edge='end'
                  tabIndex={-1}
                  className={
                    '!border-none hover:!bg-transparent !p-0 !text-gray-500 hover:!text-gray-700' +
                    (error ? ' !text-red-600' : '')
                  }
                >
                  {showPassword ? (
                    <VisibilityOffIcon className='!w-4 !h-4' />
                  ) : (
                    <VisibilityIcon className='!w-4 !h-4' />
                  )}
                </IconButton>
              </InputAdornment>
            ) : undefined
          }}
        />
        {error && <MessageError message={error} />}
      </div>
    </Box>
  );
};

export default Input;
