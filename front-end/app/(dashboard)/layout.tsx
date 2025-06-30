import React from 'react';
import { DashboardLayout, PageContainer } from '@toolpad/core';
import LayoutContainer from '@/components/layouts/LayoutContainer';
import ToolBarAccount from '@/components/customs/ToolBarAccount';
import StoreHydrater from '@/components/stores/StoreHydrater';
import { storeHydration } from '@/lib/storeHydration';
import LayoutHydrater from '@/components/layouts/LayoutHydrater';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  return (
    <DashboardLayout
      slots={{
        toolbarActions: ToolBarAccount
      }}
      sx={{
        '& .MuiContainer-root': {
          maxWidth: '100%',
          paddingX: '3rem'
        }
      }}
    >
      <LayoutContainer>
        <LayoutHydrater>{children}</LayoutHydrater>
      </LayoutContainer>
    </DashboardLayout>
  );
};

export default Layout;
