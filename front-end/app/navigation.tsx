import { Person, Work } from '@mui/icons-material';
import { type Navigation } from '@toolpad/core/AppProvider';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Groups3Icon from '@mui/icons-material/Groups3';
export const NAVIGATION: Navigation = [
  {
    segment: '/',
    title: 'Trang chủ',
    icon: <DashboardIcon />,
    pattern: `/:rest*`
  },
  {
    segment: 'giang-vien',
    title: 'Giảng viên',
    icon: <PeopleIcon />,
    pattern: `giang-vien/:rest*`
  },
  {
    segment: 'lop-hoc-phan',
    title: 'Lớp học phần',
    icon: <ClassIcon />,
    pattern: `lop-hoc-phan/:rest*`
  },
  {
    segment: 'sinh-vien',
    title: 'Sinh viên',
    icon: <Groups3Icon />,
    pattern: `sinh-vien/:rest*`
  }
];
