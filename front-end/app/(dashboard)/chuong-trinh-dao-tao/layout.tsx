'use server';
import React from 'react';
import { DashboardLayout, PageContainer } from '@toolpad/core';
import { Box, Breadcrumbs, Typography } from '@mui/material';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <Box>
   
    {children}
  </Box>;
};

export default Layout;
