import { Person, Work } from '@mui/icons-material';
import { type Navigation } from '@toolpad/core/AppProvider';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Groups3Icon from '@mui/icons-material/Groups3';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import SubjectIcon from '@mui/icons-material/Subject';
import AnchorIcon from '@mui/icons-material/Anchor';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import SchoolIcon from '@mui/icons-material/School';
import HotelClassIcon from '@mui/icons-material/HotelClass';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
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
  },
  {
    segment: 'khoa',
    title: 'Khoa',
    icon: <WorkOutlineIcon />,
    pattern: `khoa/:rest*`
  },
  {
    segment: 'mon-hoc',
    title: 'Môn học',
    icon: <SubjectIcon />,
    pattern: `mon-hoc/:rest*`
  },
  {
    segment: 'nganh',
    title: 'Ngành',
    icon: <AnchorIcon />,
    pattern: `nganh/:rest*`
  },
  {
    segment: 'bo-mon',
    title: 'Bộ môn',
    icon: <HistoryEduIcon />,
    pattern: `bo-mon/:rest*`
  },
  {
    segment: 'hoc-ba',
    title: 'Học bạ',
    icon: <LibraryBooksIcon />,
    pattern: `hoc-ba/:rest*`
  },
  {
    segment: 'phong-hoc',
    title: 'Phòng học',
    icon: <HotelClassIcon />,
    pattern: `phong-hoc/:rest*`
  },
  {
    segment: 'truong',
    title: 'Trường',
    icon: <SchoolIcon />,
    pattern: `truong/:rest*`
  }
];
