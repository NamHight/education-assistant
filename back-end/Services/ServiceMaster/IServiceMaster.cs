﻿using Education_assistant.Modules.ModuleAuthenticate.Services;
using Education_assistant.Modules.ModuleBoMon.Services;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.Services;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.Services;
using Education_assistant.Modules.ModuleChuongTrinhDaoTao.Services;
using Education_assistant.Modules.ModuleGiangVien.Services;
using Education_assistant.Modules.ModuleHocBa.Services;
using Education_assistant.Modules.ModuleKhoa.Services;
using Education_assistant.Modules.ModuleLichBieu.Services;
using Education_assistant.Modules.ModuleLopHoc.Services;
using Education_assistant.Modules.ModuleLopHocPhan.Services;
using Education_assistant.Modules.ModuleMonHoc.Services;
using Education_assistant.Modules.ModuleNganh.Services;
using Education_assistant.Modules.ModulePhongHoc.Services;
using Education_assistant.Modules.ModuleSinhVien.Services;
using Education_assistant.Modules.ModuleThongKe.Services;
using Education_assistant.Modules.ModuleTuan.Services;

namespace Education_assistant.Services.ServiceMaster;

public interface IServiceMaster
{
    IServiceGiangVien GiangVien { get; }
    IServiceKhoa Khoa { get; }
    IServiceMonHoc MonHoc { get; }
    IServiceChuongTrinhDaoTao ChuongTrinhDaoTao { get; }
    IServiceChiTietChuongTrinhDaoTao ChiTietChuongTrinhDaoTao { get; }
    IServiceBoMon BoMon { get; }
    IServiceLopHocPhan LopHocPhan { get; }
    IServiceChiTietLopHocPhan ChiTietLopHocPhan { get; }
    IServiceSinhVien SinhVien { get; }
    IServiceNganh Nganh { get; }
    IServiceHocBa HocBa { get; }
    IServiceLopHoc LopHoc { get; }
    IServiceLichBieu LichBieu { get; }
    IServicePhongHoc PhongHoc { get; }
    IServiceAuthenticate Authenticate { get; }
    IServiceTuan Tuan { get; }
    IServiceTaiKhoan TaiKhoan { get; }
    IServiceThongKe ThongKe { get; }
}