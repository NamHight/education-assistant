using AutoMapper;
using Education_assistant.Models;
using Education_assistant.Models.Enums;
using Education_assistant.Modules.ModuleBoMon.DTOs.Request;
using Education_assistant.Modules.ModuleBoMon.DTOs.Response;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Request;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.DTOs.Response;
using Education_assistant.Modules.ModuleChuongTrinhDaoTao.DTOs.Request;
using Education_assistant.Modules.ModuleChuongTrinhDaoTao.DTOs.Response;
using Education_assistant.Modules.ModuleGiangVien.DTOs.Request;
using Education_assistant.Modules.ModuleGiangVien.DTOs.Response;
using Education_assistant.Modules.ModuleKhoa.DTOs.Request;
using Education_assistant.Modules.ModuleKhoa.DTOs.Response;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Request;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Response;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Request;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Response;
using Education_assistant.Modules.ModuleTaiKhoan.DTOs.Request;
using Education_assistant.Modules.ModuleTaiKhoan.DTOs.Response;
using Education_assistant.Modules.ModuleTruong.DTOs.Request;
using Education_assistant.Modules.ModuleTruong.DTOs.Response;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;

namespace Education_assistant.Mappers;

public class MapperProfile : Profile
{
    public MapperProfile()
    {
        //map tai khoan
        CreateMap<RequestAddTaiKhoanDto, TaiKhoan>()
            .ForMember(dest => dest.LoaiTaiKhoaEnum,
            opt => opt.MapFrom(src => ParseEnum<LoaiTaiKhoaEnum>(src.LoaiTKhoan, "Loại tài khoản add")));
        CreateMap<RequestUpdateTaiKhoanDto, TaiKhoan>()
            .ForMember(dest => dest.LoaiTaiKhoaEnum,
            opt => opt.MapFrom(src => ParseEnum<LoaiTaiKhoaEnum>(src.LoaiTKhoan, "Loại tài khoản update")));
        CreateMap<TaiKhoan, ResponseTaiKhoanDto>()
            .ForMember(dest => dest.LoaiTKhoan, opt => opt.MapFrom(src => src.LoaiTaiKhoaEnum.ToString()));
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
        CreateMap<RequestAddChuongTrinhDaoTaoDto, ChuongTrinhDaoTao>()
            .ForMember(dest => dest.LoaiChuongTrinhDaoTaoEnum,
                    opt => opt.MapFrom(src => ParseEnum<LoaiChuongTrinhDaoTaoEnum>(src.LoaiChuongTrinh, "Loai chương trình đào tạo add")));
        CreateMap<RequestUpdateChuongTrinhDaoTaoDto, ChuongTrinhDaoTao>()
            .ForMember(dest => dest.LoaiChuongTrinhDaoTaoEnum,
                    opt => opt.MapFrom(src => ParseEnum<LoaiChuongTrinhDaoTaoEnum>(src.LoaiChuongTrinh, "Loại chương trình đào tạo update")));
        CreateMap<ChuongTrinhDaoTao, ResponseChuongTrinhDaoTaoDto>()
            .ForMember(dest => dest.LoaiChuongTrinh, opt => opt.MapFrom(src => src.LoaiChuongTrinhDaoTaoEnum.ToString()));
        //map chi tiết chương trình đào tạo 
        CreateMap<RequestAddChiTietChuongTrinhDaoTaoDto, ChiTietChuongTrinhDaoTao>()
            .ForMember(dest => dest.LoaiMonHocEnum,
                opt => opt.MapFrom(src => ParseEnum<LoaiMonHocEnum>(src.LoaiMon, "add chi tiết chương trình đào tạo")));
        CreateMap<RequestUpdateChiTietChuongTrinhDaoTaoDto, ChiTietChuongTrinhDaoTao>()
            .ForMember(dest => dest.LoaiMonHocEnum,
                opt => opt.MapFrom(src => ParseEnum<LoaiMonHocEnum>(src.LoaiMon, "update chi tiết chương trình đào tạo")));
        CreateMap<ChiTietChuongTrinhDaoTao, ResponseChiTietChuongTrinhDaoTaoDto>()
            .ForMember(dest => dest.LoaiMon, opt => opt.MapFrom(src => src.LoaiMonHocEnum.ToString()));

        //map bộ môn
        CreateMap<RequestAddBoMonDto, BoMon>();
        CreateMap<RequestUpdateBoMonDto, BoMon>();
        CreateMap<BoMon, ResponseBoMonDto>();

        //map lớp học phần
        CreateMap<RequestAddLopHocPhanDto, LopHocPhan>()
            .ForMember(dest => dest.TrangThaiLopHocPhanEnum, opt => opt.MapFrom(src => ParseEnum<TrangThaiLopHocPhanEnum>(src.TrangThaiLop, "add lớp học phần")));
        CreateMap<RequestUpdateLopHocPhanDto, LopHocPhan>()
            .ForMember(dest => dest.TrangThaiLopHocPhanEnum, opt => opt.MapFrom(src => ParseEnum<TrangThaiLopHocPhanEnum>(src.TrangThaiLop, "update lớp học phần")));
        CreateMap<LopHocPhan, ResponseLopHocPhanDto>()
            .ForMember(dest => dest.TrangThaiLop, opt => opt.MapFrom(src => src.TrangThaiLopHocPhanEnum.ToString()));

        //map giangvien
        CreateMap<RequestAddGiangVienDto, GiangVien>()
            .ForMember(dest => dest.ChucVuGiangVienEnum, opt => opt.MapFrom(src => ParseEnum<ChucVuGiangVienEnum>(src.ChucVuGiangVien, "add chức vụ giảng viên")))
            .ForMember(dest => dest.GioiTinhEnum, opt => opt.MapFrom(src => ParseEnum<GioiTinhEnum>(src.GioiTinhGiangVien, "add giới tính giảng viên")))
            .ForMember(dest => dest.TrangThaiGiangVienEnum, opt => opt.MapFrom(src => ParseEnum<TrangThaiGiangVienEnum>(src.TrangThaiGiangVien, "add giới tính giảng viên")));

        CreateMap<RequestUpdateGiangVienDto, GiangVien>()
            .ForMember(dest => dest.ChucVuGiangVienEnum, opt => opt.MapFrom(src => ParseEnum<ChucVuGiangVienEnum>(src.ChucVuGiangVien, "update chức vụ giảng viên")))
            .ForMember(dest => dest.GioiTinhEnum, opt => opt.MapFrom(src => ParseEnum<GioiTinhEnum>(src.GioiTinhGiangVien, "update giới tính giảng viên")))
            .ForMember(dest => dest.TrangThaiGiangVienEnum, opt => opt.MapFrom(src => ParseEnum<TrangThaiGiangVienEnum>(src.TrangThaiGiangVien, "update giới tính giảng viên")));
            
        CreateMap<GiangVien, ResponseGiangVienDto>()
            .ForMember(dest => dest.ChucVuGiangVien, opt => opt.MapFrom(src => src.ChucVuGiangVienEnum.ToString()))
            .ForMember(dest => dest.GioiTinhGiangVien, opt => opt.MapFrom(src => src.GioiTinhEnum.ToString()))
            .ForMember(dest => dest.TrangThaiGiaoVien, opt => opt.MapFrom(src => src.TrangThaiGiangVienEnum.ToString()));

    }
    //method parseEnum generic
    private static TEnum ParseEnum<TEnum>(string? value, string fieldName = "giá trị")
     where TEnum : struct, Enum
    {
        if (Enum.TryParse<TEnum>(value, true, out var result))
        {
            return result;
        }
        throw new ArgumentException($"{fieldName} không hợp lệ. Giá trị hợp lệ: {string.Join(", ", Enum.GetNames(typeof(TEnum)))}");
    }
}