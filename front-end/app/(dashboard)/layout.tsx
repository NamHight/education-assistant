import React from 'react';
import {DashboardLayout, PageContainer} from "@toolpad/core";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = ({children}:LayoutProps) => {
  return (
    <DashboardLayout>
      <PageContainer>
        {children}
      </PageContainer>
    </DashboardLayout>
  );
};

export default Layout;