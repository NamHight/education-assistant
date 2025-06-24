import React, { FC } from 'react';
import { Chip, SxProps } from '@mui/material';
import { Theme } from '@mui/material/styles';

interface IChipProps {
  title?: string;
  color?: 'primary' | 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  className?: string;
  sx?: SxProps<Theme>;
}

const ChipOption: FC<IChipProps> = ({ title, color, className, sx }) => {
  return <Chip label={title} color={color} className={className} sx={sx} />;
};

export default ChipOption;
