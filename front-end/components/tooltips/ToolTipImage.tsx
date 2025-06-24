import React from 'react';
import { Fade, Tooltip } from '@mui/material';

interface ToolTipImageProps {
  children: React.ReactElement;
  title: React.ReactNode;
}

const ToolTipImage = ({ children, title }: ToolTipImageProps) => {
  return (
    <Tooltip
      placement='right'
      title={title}
      slots={{
        transition: Fade
      }}
      slotProps={{
        transition: { timeout: 400 },
        tooltip: {
          sx: {
            display: 'flex',
            justifyContent: 'center',
            bgcolor: 'white',
            padding: '5px',
            fontSize: '0.875rem',
            boxShadow: '0px 2px 8px rgba(0,0,0,0.1)'
          }
        }
      }}
    >
      {children}
    </Tooltip>
  );
};

export default React.memo(ToolTipImage);
