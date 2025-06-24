'use client';
import { useDynamicBreadcrumbs } from '@/hooks/useDynamicBreadcrumbs';
import { PageContainer } from '@toolpad/core';
import React from 'react';
import PageHeaderCustom from '../headers/PageHeaderCustom';

const LayoutContainer = ({ children }: { children: React.ReactNode }) => {
  const { title, breadcrumbs } = useDynamicBreadcrumbs();
  return (
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
