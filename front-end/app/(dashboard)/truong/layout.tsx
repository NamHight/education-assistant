'use server'
import { Box } from '@mui/material';
import React from 'react';

interface LayoutProps{
  children?: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps ) => {
  return <Box>{children}</Box>;
};

export default Layout;
