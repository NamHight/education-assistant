'use client';
import React from 'react';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
interface IPieProps {
  width?: number;
  height?: number;
  data: {
    id: number;
    value: number;
    label: string;
  }[];
  [key: string]: any;
}

const Pie = ({ width, height, data, ...rest }: IPieProps) => {
  return (
    <PieChart
      data-testid='pie-chart'
      series={[
        {
          data: Array.isArray(data)
            ? data?.map((item) => ({
                ...item,
                label: item?.label // chỉ để label, không kèm value
              }))
            : [],
          arcLabel: (item) => `${item?.value}`, // chỉ hiện value trên vòng tròn
          arcLabelMinAngle: 10,
          arcLabelRadius: '70%',
          highlightScope: { fade: 'global', highlight: 'item' },
          faded: { innerRadius: 40, additionalRadius: -20, color: '#e0e0e0' },
          innerRadius: 50,
          outerRadius: 110,
          paddingAngle: 2,
          cornerRadius: 8,
          ...rest
        }
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fontWeight: 'bold',
          fontSize: 16,
          fill: '#333',
          textShadow: '1px 1px 2px #fff'
        },
        '.MuiPieArc-root': {
          stroke: '#fff',
          strokeWidth: 2,
          filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.08))'
        },
        '.MuiPieArc--highlighted': {
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.18))'
        }
      }}
      width={width}
      height={height}
    />
  );
};

export default Pie;
