import React from 'react';
import { PageContainer } from '@toolpad/core';
import LayoutContainer from '@/components/layouts/LayoutContainer';
import ToolBarAccount from '@/components/customs/ToolBarAccount';
import StoreHydrater from '@/components/stores/StoreHydrater';
import { storeHydration } from '@/lib/storeHydration';
import LayoutHydrater from '@/components/layouts/LayoutHydrater';
import LayoutDashboard from '@/components/layouts/LayoutDashboard';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const storeHydrater = await storeHydration();
  return (
    <LayoutDashboard>
      <LayoutContainer>
        <LayoutHydrater storeHydrater={storeHydrater}>{children}</LayoutHydrater>
      </LayoutContainer>
    </LayoutDashboard>
  );
};

export default Layout;
