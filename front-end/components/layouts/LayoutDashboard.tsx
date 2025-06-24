'use client';
import { DashboardLayout, PageContainer } from '@toolpad/core';
import React, { ReactNode } from 'react';

const LayoutDashboard = ({ children }: { children: ReactNode }) => {
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

export default LayoutDashboard;
