using AutoMapper;
using Education_assistant.Models;
using Education_assistant.Modules.ModuleBoMon.DTOs.Request;
using Education_assistant.Modules.ModuleBoMon.DTOs.Response;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Request;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Response;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Request;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Response;
using Education_assistant.Modules.ModuleChuongTrinhDaoTao.DTOs.Request;
using Education_assistant.Modules.ModuleChuongTrinhDaoTao.DTOs.Response;
using Education_assistant.Modules.ModuleGiangVien.DTOs.Request;
using Education_assistant.Modules.ModuleGiangVien.DTOs.Response;
using Education_assistant.Modules.ModuleHocBa.DTOs.Request;
using Education_assistant.Modules.ModuleHocBa.DTOs.Response;
using Education_assistant.Modules.ModuleKhoa.DTOs.Request;
using Education_assistant.Modules.ModuleKhoa.DTOs.Response;
using Education_assistant.Modules.ModuleLichBieu.DTOs.Request;
using Education_assistant.Modules.ModuleLichBieu.DTOs.Response;
using Education_assistant.Modules.ModuleLopHoc.DTOs.Request;
using Education_assistant.Modules.ModuleLopHoc.DTOs.Response;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Request;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Response;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Request;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Response;
using Education_assistant.Modules.ModuleNganh.DTOs.Request;
using Education_assistant.Modules.ModuleNganh.DTOs.Response;
using Education_assistant.Modules.ModulePhongHoc.DTOs.Request;
using Education_assistant.Modules.ModulePhongHoc.DTOs.Response;
using Education_assistant.Modules.ModuleSinhVien.DTOs.Request;
using Education_assistant.Modules.ModuleSinhVien.DTOs.Response;
using Education_assistant.Modules.ModuleThongKe.DTOs.Response;
using Education_assistant.Modules.ModuleThongKe.Record;
using Education_assistant.Modules.ModuleTruong.DTOs.Request;
using Education_assistant.Modules.ModuleTruong.DTOs.Response;
using Education_assistant.Modules.ModuleTuan.DTOs.Request;
using Education_assistant.Modules.ModuleTuan.DTOs.Response;

namespace Education_assistant.Mappers;

public class MapperProfile : Profile
{
    public MapperProfile()
    {
        //map truong
        CreateMap<RequestAddTruongDto, Truong>();
        CreateMap<RequestUpdateTruongDto, Truong>();
        CreateMap<Truong, ResponseTruongDto>();
        //map khoa
        CreateMap<RequestAddKhoaDto, Khoa>();
        CreateMap<RequestUpdateKhoaDto, Khoa>();
        CreateMap<Khoa, ResponseKhoaDto>();
        //map monhoc
        CreateMap<RequestAddMonHocDto, MonHoc>();
        CreateMap<RequestUpdateMonHocDto, MonHoc>();
        CreateMap<MonHoc, ResponseMonHocDto>();

        //map chuong trinh dao tao
        CreateMap<RequestAddChuongTrinhDaoTaoDto, ChuongTrinhDaoTao>();
        CreateMap<RequestUpdateChuongTrinhDaoTaoDto, ChuongTrinhDaoTao>();
        CreateMap<ChuongTrinhDaoTao, ResponseChuongTrinhDaoTaoDto>();
        //map chi tiết chương trình đào tạo 
        CreateMap<RequestAddChiTietChuongTrinhDaoTaoDto, ChiTietChuongTrinhDaoTao>();
        CreateMap<RequestUpdateChiTietChuongTrinhDaoTaoDto, ChiTietChuongTrinhDaoTao>();
        CreateMap<ChiTietChuongTrinhDaoTao, ResponseChiTietChuongTrinhDaoTaoDto>();

        //map bộ môn
        CreateMap<RequestAddBoMonDto, BoMon>();
        CreateMap<RequestUpdateBoMonDto, BoMon>();
        CreateMap<BoMon, ResponseBoMonDto>();

        //map lớp học phần
        CreateMap<RequestAddLopHocPhanDto, LopHocPhan>();
        CreateMap<RequestUpdateSimpleLopHocPhanDto, LopHocPhan>();
        CreateMap<RequestUpdateLopHocPhanDto, LopHocPhan>();
        CreateMap<LopHocPhan, ResponseLopHocPhanDto>();



        //map giangvien
        CreateMap<RequestAddGiangVienDto, GiangVien>();
        CreateMap<RequestUpdateGiangVienDto, GiangVien>();
        CreateMap<GiangVien, ResponseGiangVienDto>();


        //chi tiết lớp học phần
        CreateMap<RequestAddChiTietLopHocPhanDto, ChiTietLopHocPhan>();
        CreateMap<RequestUpdateChiTietLopHocPhanDto, ChiTietLopHocPhan>();
        CreateMap<ChiTietLopHocPhan, ResponseChiTietLopHocPhanDto>();
        CreateMap<ChiTietLopHocPhan, ResponseChiTietLopHocPhanByLopHocPhanDto>();

        //map sinh vien
        CreateMap<RequestAddSinhVienDto, SinhVien>();
        CreateMap<RequestUpdateSinhVienDto, SinhVien>();
        CreateMap<SinhVien, ResponseSinhVienDto>();
        CreateMap<SinhVien, ResponseSinhVienTinhTrangHocTapDto>();

        //map ngành
        CreateMap<RequestAddNganhDto, Nganh>();
        CreateMap<RequestUpdateNganhDto, Nganh>();
        CreateMap<Nganh, ResponseNganhDto>();

        //map lớp học
        CreateMap<RequestAddLopHocDto, LopHoc>();
        CreateMap<RequestUpdateLopHocDto, LopHoc>();
        CreateMap<LopHoc, ResponseLopHocDto>();

        //map lịch biểu
        CreateMap<RequestAddLichBieuDto, LichBieu>();
        CreateMap<RequestAddLichBieuListTuanDto, LichBieu>();
        CreateMap<RequestUpdateLichBieuDto, LichBieu>();
        CreateMap<LichBieu, ResponseLichBieuDto>();

        //map phòng học
        CreateMap<RequestAddPhongHocDto, PhongHoc>();
        CreateMap<RequestUpdatePhongHocDto, PhongHoc>();
        CreateMap<PhongHoc, ResponsePhongHocDto>();

        //map học bạ
        CreateMap<RequestAddHocbaDto, HocBa>();
        CreateMap<RequestUpdateHocbaDto, HocBa>();
        CreateMap<HocBa, ResponseHocBaDto>();

        //map tuan
        CreateMap<RequestAddTuanDto, Tuan>();
        CreateMap<RequestUpdateTuanDto, Tuan>();
        CreateMap<Tuan, ResponseTuanDto>();
        //map simple model
        CreateMap<BoMon, BoMonSimpleDto>();
        CreateMap<ChuongTrinhDaoTao, ChuongTrinhDaoTaoSimpleDto>();
        CreateMap<ChiTietChuongTrinhDaoTao, ChiTietChuongTrinhDaoTaoSimpleDto>();
        CreateMap<GiangVien, GiangVienSimpleDto>();
        CreateMap<TaiKhoan, TaiKhoanSimpleDto>();
        CreateMap<HocBa, HocBaSimpleDto>();
        CreateMap<Khoa, KhoaSimpleDto>();
        CreateMap<LopHoc, LopHocSimpleDto>();
        CreateMap<LopHocPhan, LopHocPhanSimpleDto>();
        CreateMap<MonHoc, MonHocSimpleDto>()
            .ForMember(dest => dest.ChiTietChuongTrinhDaoTao, opt => opt.MapFrom(src => src.DanhSachChiTietChuongTrinhDaoTao!.FirstOrDefault()));
        CreateMap<Nganh, NganhSimpleDto>();
        CreateMap<PhongHoc, PhongHocSimpleDto>();
        CreateMap<SinhVien, SinhVienSimpleDto>();

        //map record
        CreateMap<TopStudentRaw, ResponseTopStudentRawDto>();
        CreateMap<PassFailPointRaw, ResponsePassFailPointClassDto>();
    }
}