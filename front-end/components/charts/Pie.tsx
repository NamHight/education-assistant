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
          data: data,
          arcLabel: (item) => `${item.value}`,
          arcLabelMinAngle: 35,
          arcLabelRadius: '60%',
          highlightScope: { fade: 'global', highlight: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          ...rest
        }
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fontWeight: 'bold'
        }
      }}
      width={width}
      height={height}
    />
  );
};

export default Pie;
