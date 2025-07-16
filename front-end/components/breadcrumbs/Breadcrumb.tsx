'use client';
import { Box, Breadcrumbs, Typography } from '@mui/material';
import React, { ReactNode, useMemo } from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Link from 'next/link';
import { useBreadcrumb } from '@/hooks/context/BreadCrumbContext';
import { usePathname } from 'next/navigation';
import { breadcrumbTranslations } from '@/types/general';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { AnimatePresence, motion } from 'motion/react';
import ButtonBack from '../buttons/ButtonBack';
const Breadcrumb = () => {
  const path = usePathname();
  const { breadcrumbs, title } = useBreadcrumb();
  const handleRenderFirstBreadcrumb = useMemo((): ReactNode => {
    const splitPath = path.split('/').filter(Boolean)[0];
    if (path === '/') {
      return (
        <Link
          href={`/${splitPath}`}
          className='relative text-[14px] flex gap-1 items-center text-black dark:text-white
    before:absolute before:left-0 before:bottom-0 before:h-[2px] before:bg-blue-500
    before:w-0 hover:before:w-full before:transition-all before:duration-400'
        >
          <HomeOutlinedIcon
            sx={(theme) => ({
              color: theme.palette.mode === 'dark' ? 'white !important' : 'black !important'
            })}
            className='!h-5 !w-5'
          />
          <Typography
            sx={(theme) => ({
              color: theme.palette.mode === 'dark' ? 'white !important' : 'black !important',
              fontWeight: 500
            })}
          >
            Trang chủ
          </Typography>
        </Link>
      );
    }
    return (
      <Link
        href={`/${splitPath}`}
        className='relative text-[14px] flex gap-1 items-center
    before:absolute before:left-0 before:bottom-0 before:h-[2px] before:bg-blue-500
    before:w-0 hover:before:w-full before:transition-all before:duration-400'
      >
        <HomeOutlinedIcon
          sx={(theme) => ({
            color: theme.palette.mode === 'dark' ? 'white !important' : 'black !important'
          })}
          className='!h-5 !w-5'
        />
        <Typography
          sx={(theme) => ({
            color: theme.palette.mode === 'dark' ? 'white !important' : 'black !important',
            fontWeight: 500
          })}
        >
          {breadcrumbTranslations[splitPath]}
        </Typography>
      </Link>
    );
  }, [path]);
  const handleRenderSecondBreadcrumb = useMemo((): ReactNode => {
    const splitPath = path.split('/').filter(Boolean)[1];
    return !splitPath || !breadcrumbTranslations[splitPath] ? null : (
      <Link
        href={`/${splitPath}`}
        className='relative text-[14px] flex gap-1 items-center text-black dark:text-white
    before:absolute before:left-0 before:bottom-0 before:h-[2px] before:bg-blue-500
    before:w-0 hover:before:w-full before:transition-all before:duration-400'
      >
        <AddCircleOutlineOutlinedIcon
          sx={(theme) => ({
            color: theme.palette.mode === 'dark' ? 'white !important' : 'black !important'
          })}
          className='!h-4 !w-4'
        />
        <Typography
          sx={(theme) => ({
            color: theme.palette.mode === 'dark' ? 'white !important' : 'black !important',
            fontWeight: 500
          })}
        >
          {breadcrumbTranslations[splitPath]}
        </Typography>
      </Link>
    );
  }, [path]);
  const splitPathNext = path.split('/').filter(Boolean)[1];
  return (
    <Box className='relative'>
      <Breadcrumbs
        separator={
          <NavigateNextIcon
            fontSize='small'
            sx={(theme) => ({
              color: theme.palette.mode === 'dark' ? 'white !important' : 'black !important',
              fontSize: '1rem'
            })}
          />
        }
        aria-label='breadcrumb'
        sx={{
          mb: 1,
          fontWeight: 500,
          '& .MuiBreadcrumbs-separator': { color: '#1976d2' },
          '& a': { color: '#1976d2', textDecoration: 'none', fontWeight: 500 },
          '& .MuiTypography-root': { color: '#333' }
        }}
      >
        {handleRenderFirstBreadcrumb}
        {handleRenderSecondBreadcrumb}
        {breadcrumbs}
      </Breadcrumbs>
      {!splitPathNext ? null : (
        <AnimatePresence mode={'wait'}>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={'absolute right-0 top-1/6 items-center justify-center'}
          >
            <ButtonBack />
          </motion.div>
        </AnimatePresence>
      )}
      <Box className='flex items-center gap-2 mb-3'>
        <Typography
          sx={(theme) => ({
            color: theme.palette.mode === 'dark' ? 'white !important' : 'black !important',
            fontWeight: 600,
            fontSize: '1.5rem'
          })}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  );
};

export default Breadcrumb;
