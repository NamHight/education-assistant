import { alpha, Box, TextField, Typography } from '@mui/material';
import React, { Fragment } from 'react';
import MessageError from '../texts/MessageError';
import clsx from 'clsx';

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
        type={type}
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
      />
      {error && <MessageError message={error} />}
    </Fragment>
  );
};

export default Input2;
