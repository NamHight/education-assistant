// components/inputs/CustomEmailInput.tsx
import React, { useState, useEffect, Fragment } from 'react';
import { alpha, Box, TextField, Typography } from '@mui/material';
import clsx from 'clsx';
import MessageError from '../texts/MessageError';

interface CustomEmailInputProps {
  value: string;
  onChange: (fullEmail: string) => void;
  onBlur?: () => void;
  error?: string | any;
  title: string;
  placeholder?: string;
  isDisabled?: boolean;
}

const CustomEmailInput: React.FC<CustomEmailInputProps> = ({
  value,
  onChange,
  onBlur,
  error,
  title,
  placeholder = 'Nhập tên người dùng',
  isDisabled = false
}) => {
  const [username, setUsername] = useState('');
  useEffect(() => {
    if (value && value.includes('@caothang.edu.vn')) {
      const user = value.split('@')[0];
      setUsername(user);
    } else if (!value) {
      setUsername('');
    }
  }, [value]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    const cleanUsername = newUsername.replace(/[^a-zA-Z0-9._-]/g, '');
    setUsername(cleanUsername);
    const fullEmail = cleanUsername ? `${cleanUsername}@caothang.edu.vn` : '';
    onChange(fullEmail);
  };

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
      <Box sx={{ display: 'flex', alignItems: 'stretch', width: '100%', mb: 1 }}>
        {/* Input cho username */}
        <TextField
          value={username}
          onChange={handleUsernameChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={isDisabled}
          error={!!error}
          sx={(theme) => ({
            m: 0,
            flex: 1,
            '& .MuiOutlinedInput-root': {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderRight: 'none',
              borderColor: error ? alpha(theme.palette.error.main, 0.5) : alpha(theme.palette.grey[600], 0.5)
            },
            '& fieldset': {
              borderColor: alpha(theme.palette.divider, 0.5)
            },
            '&:hover fieldset': {
              borderColor: alpha(theme.palette.primary.main, 0.5)
            },
            '&.Mui-focused fieldset': {
              borderColor: alpha(theme.palette.primary.main, 0.5)
            }
          })}
          inputProps={{
            style: { padding: '16.5px 0px' }
          }}
        />

        {/* Phần domain cố định */}
        <Box
          sx={{
            marginTop: '6px',
            px: 2,
            bgcolor: 'grey.50',
            border: '1px solid',
            borderColor: error ? 'error.main' : 'rgba(0, 0, 0, 0.23)',
            borderLeft: 'none',
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
            display: 'flex',
            alignItems: 'center',
            minWidth: '140px'
          }}
        >
          <Typography
            variant='body1'
            color='textSecondary'
            sx={{ fontWeight: 600, lineHeight: '24px', fontFamily: 'monospace' }}
          >
            @caothang.edu.vn
          </Typography>
        </Box>
      </Box>
      {error && <MessageError message={error} />}
    </Fragment>
  );
};

export default CustomEmailInput;
