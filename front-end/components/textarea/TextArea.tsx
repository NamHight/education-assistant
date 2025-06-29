import React from 'react';
import { Box, FormControl, TextareaAutosize, Typography } from '@mui/material';
import { clsx } from 'clsx';
import MessageError from '../texts/MessageError';

interface InputsProps {
  title?: string;
  isTitleRequired?: boolean;
  errorMessage?: string | null;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string;
  autoComplete?: string;
  className?: string;
  name?: string;
  inputMode?: 'search' | 'text' | 'none' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | undefined;
  disabled?: boolean;
  subTitle?: string;
  editAble?: boolean;
  onClickEdit?: () => void;
  onChange?: (e: any) => void;
  isEditAble?: boolean;
}

const TextArea = ({
  title,
  isTitleRequired,
  errorMessage,
  placeholder,
  defaultValue,
  value,
  autoComplete,
  name,
  className,
  inputMode,
  disabled,
  subTitle,
  onChange,
  editAble,
  onClickEdit,
  isEditAble,
  ...rest
}: InputsProps) => {
  const { ...inputProps } = { ref: null };
  return (
    <FormControl
      fullWidth
      sx={{
        '& .Mui-focused': {
          outline: 'none'
        }
      }}
    >
      {title && (
        <Box className={clsx('mb-2 flex justify-between items-center gap-1')}>
          <Typography
            sx={(theme) => ({
              color: errorMessage ? '!text-red-600' : ``
            })}
            className={clsx(
              '!text-[16px] !font-[500] !leading-6 !text-gray-500 tracking-[0.015em] flex text-center justify-center'
            )}
          >
            {title}
            {subTitle && (
              <Typography component={'span'} className={'text-[12px] text-green-400 ml-1'}>
                {subTitle}
              </Typography>
            )}
          </Typography>
          {isTitleRequired && (
            <Typography component={'span'} className={'text-red-500'}>
              *
            </Typography>
          )}
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
      <TextareaAutosize
        inputMode={inputMode}
        placeholder={placeholder}
        name={name}
        defaultValue={defaultValue}
        disabled={disabled}
        value={value}
        minRows={6}
        maxRows={6}
        onInput={(e: any) => onChange && onChange(e)}
        className={clsx(
          'border-solid border-[1.2px] leading-[20px] not-italic letter-spacing-[0.015em] font-sans overflow-y-auto bg-0 rounded-md resize-none border-gray-500 active:border-blue-500 focus-within:border-blue-500 focus-visible:border-blue-500 !text-[16px] !font-[400] focus:ring-blue-500 focus:outline-none focus-within:ring-blue-500 block w-full pl-[13px] pr-[5px] py-[10px] focus:border-blue-500 text-area-custom',
          className,
          {
            'bg-gray-100': disabled,
            'bg-white': !disabled
          }
        )}
        autoComplete={autoComplete}
        onWheel={(e) => e.target instanceof HTMLElement && (e.target as any).type === 'number' && e.target.blur()}
        {...inputProps}
        {...rest}
      />
      {errorMessage && <MessageError message={errorMessage} />}
    </FormControl>
  );
};

export default TextArea;
