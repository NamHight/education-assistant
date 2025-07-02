

import { useUser } from '@/stores/selectors'
import React from 'react'

const enum ROLE {
    ADMIN = 1,
    QUAN_LY_KHOA_BO_MON = 2,
    GIANGVIEN = 3,
}



const useCheckPermission = () => {
    const user = useUser();
    const isAdmin = user?.taiKhoan?.loaiTaiKhoan === ROLE.ADMIN;
    const isQuanLyKhoaBoMon = user?.taiKhoan?.loaiTaiKhoan === ROLE.QUAN_LY_KHOA_BO_MON;
    const isGiangVien = user?.taiKhoan?.loaiTaiKhoan === ROLE.GIANGVIEN;


    return {
        isAdmin,
        isQuanLyKhoaBoMon,
        isGiangVien
    }
}

export default useCheckPermission