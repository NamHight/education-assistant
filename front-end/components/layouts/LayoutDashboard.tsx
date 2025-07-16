import { DashboardLayout } from '@toolpad/core';
import React, { ReactNode } from 'react';
import ToolBarAccount from '../customs/ToolBarAccount';

const LayoutDashboard = ({ children }: { children: ReactNode }) => {
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
      {children}
    </DashboardLayout>
  );
};

export default LayoutDashboard;
