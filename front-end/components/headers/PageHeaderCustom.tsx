'use client';
import React, { FC } from 'react';
import { Breadcrumb, PageHeader } from '@toolpad/core/PageContainer';
import CustomPageToolBar from '../customs/CustomPageToolBar';
import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
interface PageHeaderProps {
  breadcrumbs?: Breadcrumb[];
  title?: string;
  isShowBack?: boolean;
}

const PageHeaderCustom: FC<PageHeaderProps> = ({ title, breadcrumbs }) => {
  const pathName = usePathname();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <PageHeader
        breadcrumbs={breadcrumbs}
        title={title}
        slots={{
          toolbar: () => (pathName === '/' ? null : <CustomPageToolBar />)
        }}
      />
    </motion.div>
  );
};

export default PageHeaderCustom;
