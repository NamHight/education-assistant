'use client';
import clsx from 'clsx';
import { useDropzone } from 'react-dropzone';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { AddAPhoto as AddAPhotoIcon } from '@mui/icons-material';
import { fData } from '@/utils/format';
import MessageError from '../texts/MessageError';

const PHOTO_SIZE = 5242880; // bytes
const FILE_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];
const FILE_FORMATS_SVG = 'image/svg+xml';

interface UploadImageProps {
  disabled?: boolean;
  caption?: string;
  errorMessage?: string;
  file?: string | File;
  onChange?: (file: string | File) => void;
  className?: string;
  photoSize?: number;
  fileFormats?: string[];
  square?: boolean;
  align?: 'center' | 'left';
  titleAllowed?: string;
  isSvg?: boolean;
  w60?: boolean;
  w50?: boolean;
  w100?: boolean;
}

const UploadImage: FC<Readonly<UploadImageProps>> = ({
  disabled,
  caption,
  errorMessage,
  file,
  onChange,
  photoSize = PHOTO_SIZE,
  fileFormats = FILE_FORMATS,
  align = 'center',
  titleAllowed = 'Allowed *.jpeg, *.jpg, *.png',
  isSvg,
  w50,
  w60,
  w100,
  square,
  className,
  ...other
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string>('');
  const [fileReview, setFileReview] = useState<string>('');
  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (isSvg) {
        if (file.type === FILE_FORMATS_SVG) {
          setIsLoading(true);
          if (onChange) onChange(file);
          setIsLoading(false);
          return;
        }
      }
      const checkSize = file.size < photoSize;
      const checkType = fileFormats.includes(file.type);
      if (!checkSize) {
        setIsError('size-invalid');
        return;
      }
      if (!checkType) {
        setIsError('type-invalid');
        return;
      }
      setIsError('');
      setIsLoading(true);
      if (onChange) onChange(file);
      setIsLoading(false);
    },
    [onChange]
  );

  useEffect(() => {
    if (!!file && typeof file === 'object') {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setFileReview(reader.result as string);
    } else {
      setFileReview(file as string);
    }
  }, [file]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
    disabled: disabled
  });

  return (
    <Box className={clsx('h-full flex flex-col w-full justify-center self-center items-center group')}>
      <Box
        sx={(theme) => ({ border: `2px dashed ${theme.palette.grey[600]}`, borderRadius: '6px' })}
        className={clsx(`rounded-md flex justify-center items-center h-60 relative w-full`, {
          'border-red-600': isDragReject || !!errorMessage,
          'lg:w-3/5': w60,
          'lg:w-1/2': w50,
          'lg:w-full': w100
        })}
        {...other}
      >
        <Box
          className={clsx('h-full w-full overflow-hidden flex justify-center items-center cursor-pointer', {
            'opacity-[0.72]': isDragActive,
            'hover:opacity-90': fileReview
          })}
          {...getRootProps()}
        >
          <input {...getInputProps()} id='upload' className={'w-full'} />
          {isLoading && (
            <Box className={'z-[99] flex items-center align-center absolute justify-center'}>
              <CircularProgress size={32} thickness={2.4} />
            </Box>
          )}
          {fileReview && (
            <img
              alt='upload'
              src={fileReview}
              className={clsx(`${isSvg ? 'object-contain' : 'object-fill'} w-full h-full`, {})}
              referrerPolicy='no-referrer'
            />
          )}
          <Box
            sx={(theme) => ({ color: `${theme.palette.grey[200]}` })}
            className={clsx('flex absolute items-center flex-col justify-center', {
              'opacity-0 group-hover:opacity-[0.8]': fileReview
            })}
          >
            <AddAPhotoIcon />
            <Typography variant='caption' component={'p'}>
              {fileReview ? 'Update photo' : 'Upload photo'}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        className={'flex justify-center items-center mt-2'}
        sx={(theme) => ({ color: `${theme.palette.text.secondary}` })}
      >
        <Typography variant='caption' align={align} className={''}>
          {caption ? (
            caption
          ) : (
            <>
              {isSvg ? titleAllowed + ' *.svg' : titleAllowed}
              <br /> Max size of {fData(photoSize)}
            </>
          )}
        </Typography>
      </Box>
      <Box className={'flex justify-center items-center gap-2'}>
        {isError === 'size-invalid' && <MessageError message={`image over size ${fData(photoSize)}`} />}
        {isError === 'type-invalid' && (
          <MessageError message={fileFormats.map((format) => format.replace('image/', '*.')).join(', ')} />
        )}
        {errorMessage && <MessageError message={errorMessage} />}
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: align === 'left' ? 'flex-start' : 'center'
        }}
      ></Box>
    </Box>
  );
};

export default memo(UploadImage);
