import React from 'react';
import { DashboardLayout, PageContainer } from '@toolpad/core';
import LayoutContainer from '@/components/layouts/LayoutContainer';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <DashboardLayout
      sx={{
        '& .MuiContainer-root': {
          maxWidth: '100%',
          paddingX: '3rem'
        }
      }}
    >
      <LayoutContainer>{children}</LayoutContainer>
    </DashboardLayout>
  );
};

export default Layout;
