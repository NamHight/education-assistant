'use client';
import { PageContainer } from '@toolpad/core';
import React from 'react';
import Breadcrumb from '../breadcrumbs/Breadcrumb';
import { BreadcrumbProvider } from '@/hooks/context/BreadCrumbContext';

const LayoutContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    // // <CopilotKit publicApiKey={process.env.NEXT_PUBLIC_COPILOT_API_KEY || ''}
    <PageContainer
      suppressHydrationWarning
      suppressContentEditableWarning
      slots={{
        header: () => null
      }}
      title=''
      breadcrumbs={[]}
    >
      <BreadcrumbProvider>
        <Breadcrumb />
        {children}
      </BreadcrumbProvider>
    </PageContainer>
  );
};

export default LayoutContainer;
