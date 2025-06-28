'use client';
import { alpha, Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import React, { Fragment, useState } from 'react';
import MessageError from '../texts/MessageError';
import clsx from 'clsx';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
interface IInput2Props {
  title?: string;
  placeholder?: string;
  error?: string | any;
  isDisabled?: boolean;
  name: string;
  type?: string;
  [key: string]: any;
}

const Input2 = ({ placeholder, title, name, type, error, isDisabled, ...rest }: IInput2Props) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const isPassword = type === 'password';
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  return (
    <Fragment>
      {title && (
        <Box>
          <Typography
            className={clsx('!text-[16px] !font-[500] !leading-6', {
              '!text-gray-500': !error,
              '!text-red-600': !!error
            })}
          >
            {title}
          </Typography>
        </Box>
      )}
      <TextField
        {...rest}
        name={name}
        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
        variant='outlined'
        disabled={isDisabled}
        fullWidth
        className='!mb-1'
        error={!!error}
        placeholder={placeholder}
        sx={(theme) => ({
          '& .MuiOutlinedInput-root': {
            borderColor: error ? alpha(theme.palette.error.main, 0.5) : alpha(theme.palette.grey[600], 0.5),
            '& fieldset': {
              borderColor: alpha(theme.palette.divider, 0.5)
            },
            '&:hover fieldset': {
              borderColor: alpha(theme.palette.primary.main, 0.5)
            },
            '&.Mui-focused fieldset': {
              borderColor: alpha(theme.palette.primary.main, 0.5)
            }
          }
        })}
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
                {showPassword ? <VisibilityOffIcon className='!w-4 !h-4' /> : <VisibilityIcon className='!w-4 !h-4' />}
              </IconButton>
            </InputAdornment>
          ) : undefined
        }}
      />
      {error && <MessageError message={error} />}
    </Fragment>
  );
};

export default Input2;
