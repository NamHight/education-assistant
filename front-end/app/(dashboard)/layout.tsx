import React from 'react';
import { DashboardLayout, PageContainer } from '@toolpad/core';

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
      <PageContainer>{children}</PageContainer>
    </DashboardLayout>
  );
};

export default Layout;
