'use server';
import React from 'react';
import { Box } from '@mui/material';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  return <Box>{children}</Box>;
};

export default Layout;
