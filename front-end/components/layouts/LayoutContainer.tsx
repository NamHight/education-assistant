'use client';
import { useDynamicBreadcrumbs } from '@/hooks/useDynamicBreadcrumbs';
import { PageContainer } from '@toolpad/core';
import React from 'react';
import PageHeaderCustom from '../headers/PageHeaderCustom';
import { CopilotKit } from '@copilotkit/react-core';
import Copilot from '../copilot/Copilot';

const LayoutContainer = ({ children }: { children: React.ReactNode }) => {
  const { title, breadcrumbs } = useDynamicBreadcrumbs();
  return (
    // // <CopilotKit publicApiKey={process.env.NEXT_PUBLIC_COPILOT_API_KEY || ''}
    <PageContainer
      slots={{
        header: () =>
          PageHeaderCustom({
            title: title,
            breadcrumbs: breadcrumbs
          })
      }}
    >
      {children}
    </PageContainer>
  );
};

export default LayoutContainer;
