import React, { ReactNode } from 'react';
import { motion } from 'motion/react';
import { clsx as cn } from 'clsx';
import { Typography } from '@mui/material';
interface ButtonProps {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  [key: string]: any;
}

const Button = ({ title, className, disabled, icon, onClick, ...rest }: ButtonProps) => {
  return (
    <motion.button
      whileHover={{
        scale: 1.05
      }}
      whileTap={{
        scale: 0.95
      }}
      className={cn('px-4 py-2 bg-blue-600 cursor-pointer rounded-[4px] hover:bg-blue-500', className)}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {icon && icon}
      <Typography className='text-white text-[16px] font-semibold'>{title}</Typography>
    </motion.button>
  );
};

export default Button;
