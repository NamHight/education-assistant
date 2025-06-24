import React, { ReactNode } from 'react';
import MessageError from '../texts/MessageError';
import { Box, TextField, Typography } from '@mui/material';
import { optional } from 'zod';

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
          type={type}
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
        />
        {error && <MessageError message={error} />}
      </div>
    </Box>
  );
};

export default Input;
