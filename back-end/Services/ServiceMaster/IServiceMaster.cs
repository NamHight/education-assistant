using Education_assistant.Modules.ModuleBoMon.Services;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.Services;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.Services;
using Education_assistant.Modules.ModuleChuongTrinhDaoTao.Services;
using Education_assistant.Modules.ModuleGiangVien.Services;
using Education_assistant.Modules.ModuleKhoa.Services;
using Education_assistant.Modules.ModuleLopHocPhan.Services;
using Education_assistant.Modules.ModuleMonHoc.Services;
using Education_assistant.Modules.ModuleSinhVien.Services;
using Education_assistant.Modules.ModuleTruong.Services;

namespace Education_assistant.Services.ServiceMaster;

public interface IServiceMaster
{
    IServiceGiangVien GiangVien { get; }
    IServiceTruong Truong { get; }
    IServiceKhoa Khoa { get; }
    IServiceMonHoc MonHoc { get; }
    IServiceChuongTrinhDaoTao ChuongTrinhDaoTao { get; }
    IServiceChiTietChuongTrinhDaoTao ChiTietChuongTrinhDaoTao { get; }
    IServiceBoMon BoMon { get; }
    IServiceLopHocPhan LopHocPhan { get; }
    IServiceChiTietLopHocPhan ChiTietLopHocPhan { get; }
    IServiceSinhVien SinhVien { get; }
}
