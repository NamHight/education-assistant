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
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import AddchartIcon from '@mui/icons-material/Addchart';
import HouseIcon from '@mui/icons-material/House';
import ScoreIcon from '@mui/icons-material/Score';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import useCheckPermission from '@/helper/useCheckPermission';
import cookieStorage from '@/lib/cookie';
import { ROLE } from '@/types/general';
import { LoaiTaiKhoaEnum } from '@/models/TaiKhoan';



export const NAVIGATION  = (role?: string) : Navigation => {
  console.log('role', role);
  const isAdmin = (Number(role) === LoaiTaiKhoaEnum.ADMIN) || (Number(role) === LoaiTaiKhoaEnum.QUAN_LY_KHOA_BO_MON);
  const allNavigate = [
  {
    segment: '/',
    title: 'Trang chủ',
    icon: <DashboardIcon />,
    pattern: `/:rest*`
  },
  {
    segment: 'nhap-diem',
    title: 'Nhập điểm',
    icon: <ScoreIcon />,
    pattern: `nhap-diem/:rest*`
  },
  {
    segment: 'phan-cong',
    title: 'Phân công',
    icon: <GroupWorkIcon />,
    pattern: `phan-cong/:rest*`
  },
  {
    segment: 'lich-lop-hoc',
    title: 'Lịch lớp học',
    icon: <CalendarMonthIcon />,
    pattern: `lich-lop-hoc/:rest*`
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
    segment: 'chuong-trinh-dao-tao',
    title: 'Chương trình đào tạo',
    icon: <SquareFootIcon />,
    pattern: `chuong-trinh-dao-tao/:rest*`
  },
  {
    segment: 'chi-tiet-chuong-trinh-dao-tao',
    title: 'Chi tiết chương trình đào tạo',
    icon: <AddchartIcon />,
    pattern: `chi-tiet-chuong-trinh-dao-tao/:rest*`
  },
  {
    segment: 'phong-hoc',
    title: 'Phòng học',
    icon: <HotelClassIcon />,
    pattern: `phong-hoc/:rest*`
  },
  {
    segment: 'lop-hoc',
    title: 'Lớp học',
    icon: <HouseIcon />,
    pattern: `lop-hoc/:rest*`
  }
]


  return allNavigate.filter(item => {
    const adminOnlyRoutes = ['giang-vien', 'sinh-vien', 'khoa', 'mon-hoc', 'nganh', 'bo-mon'];

    if (!isAdmin && adminOnlyRoutes.includes(item.segment)) {
      return false;
    }

    return true;
  });

} 