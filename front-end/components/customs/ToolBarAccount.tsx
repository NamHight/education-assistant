'use client';
import React, { useEffect } from 'react';
import { Avatar, Box, CircularProgress, MenuItem, Popover, Stack, Tooltip, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { APP_ROUTE } from '@/types/general';
import { useUser, useUserActions } from '@/stores/selectors';
import { ThemeSwitcher } from '@toolpad/core/DashboardLayout';
const ToolBarAccount = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const router = useRouter();
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<HTMLElement | null>(null);
  const user = useUser();
  const userActions = useUserActions();
  const toggleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(isMenuOpen ? null : event.currentTarget);
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    userActions?.logout();
    router.push(APP_ROUTE.DANG_NHAP);
  };

  return (
    <React.Fragment>
      <ThemeSwitcher />
      <Tooltip title={user?.hoTen} enterDelay={600}>
        <div className='relative'>
          <AnimatePresence mode='wait'>
            <motion.div key='avatar' initial='hidden' animate='visible' whileHover='hover' whileTap='tap'>
              <button
                className='border-0 p-0 min-w-0 cursor-pointer flex justify-center items-center bg-transparent'
                type='button'
                aria-label='avatar'
                onClick={toggleMenu}
              >
                {user?.anhDaiDien ? (
                  <Avatar
                    variant='rounded'
                    sx={{ width: 40, height: 40 }}
                    src={user.anhDaiDien}
                    alt='ảnh đại diện'
                    className='object-cover bg-gray-200 border border-gray-300'
                    component={motion.div}
                    whileHover={{ scale: 1 }}
                    whileTap={{ scale: 0.95 }}
                  />
                ) : (
                  <PersonIcon
                    className='text-emerald-500'
                    component={motion.svg}
                    whileHover={{ scale: 1 }}
                    whileTap={{ scale: 0.95 }}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '6px',
                      backgroundColor: '#f0f0f0',
                      border: '1px solid #ccc'
                    }}
                  />
                )}
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </Tooltip>
      <Popover
        open={isMenuOpen}
        anchorEl={menuAnchorEl}
        onClose={toggleMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        disableAutoFocus
        component={motion.div}
      >
        <Box className='px-2 py-1'>
          <Stack className='flex flex-col my-2 mx-0 gap-1 '>
            {[
              {
                icon: <PersonIcon className='text-emerald-500' />,
                text: 'Account',
                action: () => {
                  router.push('/thong-tin-ca-nhan');
                  setIsMenuOpen(false);
                },
                hoverClass: 'group-hover:text-emerald-500'
              },
              {
                icon: <LogoutIcon className='text-red-500' />,
                text: 'Sign out',
                action: handleLogout,
                hoverClass: 'group-hover:text-red-500'
              }
            ].map((item, index) => (
              <MenuItem
                key={item.text}
                className={`flex gap-3 px-3 py-2 hover:bg-blue-300 group rounded-md  hover:scale-105`}
                onClick={item.action}
                component={motion.div}
                custom={index}
                whileTap={{ scale: 0.96 }}
              >
                {item.icon}
                <Typography variant={'body1'} className={`${item.hoverClass}  text-[15px]`}>
                  {item.text}
                </Typography>
              </MenuItem>
            ))}
          </Stack>
        </Box>
      </Popover>
    </React.Fragment>
  );
};

export default ToolBarAccount;
