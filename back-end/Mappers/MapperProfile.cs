using AutoMapper;
using Education_assistant.Models;
using Education_assistant.Models.Enums;
using Education_assistant.Modules.ModuleKhoa.DTOs.Request;
using Education_assistant.Modules.ModuleKhoa.DTOs.Response;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Request;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Response;
using Education_assistant.Modules.ModuleTaiKhoan.DTOs.Request;
using Education_assistant.Modules.ModuleTaiKhoan.DTOs.Response;
using Education_assistant.Modules.ModuleTruong.DTOs.Request;
using Education_assistant.Modules.ModuleTruong.DTOs.Response;

namespace Education_assistant.Mappers;

public class MapperProfile : Profile
{
    public MapperProfile()
    {
        CreateMap<RequestAddTaiKhoanDto, TaiKhoan>()
            .ForMember(dest => dest.LoaiTaiKhoaEnum,
            opt => opt.MapFrom(src => ParseEnum<LoaiTaiKhoaEnum>(src.LoaiTKhoan, "Loại tài khoản add")));
        CreateMap<RequestUpdateTaiKhoanDto, TaiKhoan>()
            .ForMember(dest => dest.LoaiTaiKhoaEnum,
            opt => opt.MapFrom(src => ParseEnum<LoaiTaiKhoaEnum>(src.LoaiTKhoan, "Loại tài khoản update")));
        CreateMap<TaiKhoan, ResponseTaiKhoanDto>()
            .ForMember(dest => dest.LoaiTKhoan, opt => opt.MapFrom(src => src.LoaiTaiKhoaEnum.ToString()));

        //map truong
        CreateMap<Truong, RequestAddTruongDto>()
            .ReverseMap();
        CreateMap<Truong, RequestUpdateTruongDto>()
            .ReverseMap();
        CreateMap<Truong, ResponseTruongDto>()
            .ReverseMap();
        //map khoa
        CreateMap<Khoa, RequestAddKhoaDto>()
            .ReverseMap();
        CreateMap<Khoa, RequestUpdateKhoaDto>()
            .ReverseMap();
        CreateMap<Khoa, ResponseKhoaDto>()
            .ReverseMap();
        //map monhoc
        CreateMap<RequestAddMonHocDto, MonHoc>()
            .ForMember(dest => dest.LoaiMonHocEnum,
                    opt => opt.MapFrom(src => ParseEnum<LoaiMonHocEnum>(src.LoaiMon, "Loại môn học add")));
        CreateMap<RequestUpdateMonHocDto, MonHoc>()
            .ForMember(dest => dest.LoaiMonHocEnum,
                    opt => opt.MapFrom(src => ParseEnum<LoaiMonHocEnum>(src.LoaiMon, "Loại môn học update")));
        CreateMap<MonHoc, ResponseMonHocDto>()
            .ForMember(dest => dest.LoaiMon, opt => opt.MapFrom(src => src.LoaiMonHocEnum.ToString()));
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