'use client';
import React, { memo } from 'react';
import { PageHeaderToolbar } from '@toolpad/core';

import { AnimatePresence, motion } from 'motion/react';
import ButtonBack from '../buttons/ButtonBack';

interface CustomPageToolBarProps {}

const CustomPageToolBar = memo(function CustomPageToolBar({}: CustomPageToolBarProps) {
  return (
    <PageHeaderToolbar>
      <AnimatePresence mode={'wait'}>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={'flex items-center justify-center'}
        >
          <ButtonBack />
        </motion.div>
      </AnimatePresence>
    </PageHeaderToolbar>
  );
});

export default CustomPageToolBar;
