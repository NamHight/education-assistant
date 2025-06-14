import { Person, Work } from '@mui/icons-material';
import { type Navigation } from '@toolpad/core/AppProvider';

export const NAVIGATION: Navigation = [
  {
    segment: '/',
    title: 'Trang chủ',
    icon: <Work />,
    pattern: `/:rest*`
  },
  {
    segment: 'giang-vien',
    title: 'Giảng viên',
    icon: <Work />,
    pattern: `giang-vien/:rest*`
  }
];
