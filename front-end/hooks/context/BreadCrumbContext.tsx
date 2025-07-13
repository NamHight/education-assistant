'use client';
import { createContext, ReactNode, useContext, useState } from 'react';

import { Dispatch, SetStateAction } from 'react';

interface BreadcrumbContextType {
  breadcrumbs: ReactNode[];
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  setBreadcrumbs: Dispatch<SetStateAction<ReactNode[]>>;
}

export const BreadcrumbContext = createContext<BreadcrumbContextType | null>(null);

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<ReactNode[]>([]);
  const [title, setTitle] = useState<string>('');
  const value = {
    breadcrumbs,
    setBreadcrumbs,
    title,
    setTitle
  };
  return <BreadcrumbContext.Provider value={value}>{children}</BreadcrumbContext.Provider>;
};

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
};
