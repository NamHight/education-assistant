using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.helpers.implements;
using Education_assistant.Modules.ModuleBoMon.Services;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.Services;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.Services;
using Education_assistant.Modules.ModuleChuongTrinhDaoTao.Services;
using Education_assistant.Modules.ModuleGiangVien.Services;
using Education_assistant.Modules.ModuleKhoa.Services;
using Education_assistant.Modules.ModuleLopHocPhan.Services;
using Education_assistant.Modules.ModuleMonHoc.Services;
using Education_assistant.Modules.ModuleNganh.Services;
using Education_assistant.Modules.ModuleSinhVien.Services;
using Education_assistant.Modules.ModuleTruong.Services;
using Education_assistant.Repositories.RepositoryMaster;

namespace Education_assistant.Services.ServiceMaster;

public class ServiceMaster : IServiceMaster
{
    private readonly Lazy<IServiceGiangVien> _giangVien;
    private readonly Lazy<IServiceTruong> _truong;
    private readonly Lazy<IServiceKhoa> _khoa;
    private readonly Lazy<IServiceMonHoc> _monHoc;
    private readonly Lazy<IServiceChuongTrinhDaoTao> _chuongTrinhDaoTao;
    private readonly Lazy<IServiceChiTietChuongTrinhDaoTao> _chiTietChuongTrinhDaoTao;
    private readonly Lazy<IServiceBoMon> _boMon;
    private readonly Lazy<IServiceLopHocPhan> _lopHocPhan;
    private readonly Lazy<IServiceChiTietLopHocPhan> _chiTietLopHocPhan;
    private readonly Lazy<IServiceSinhVien> _sinhVien;
    private readonly Lazy<IServiceNganh> _nganh;

    public ServiceMaster(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper, IPasswordHash password)
    {
        _giangVien = new Lazy<IServiceGiangVien>(() => new ServiceGiangVien(repositoryMaster, loggerService, mapper, password));
        _truong = new Lazy<IServiceTruong>(() => new ServiceTruong(repositoryMaster, loggerService, mapper));
        _khoa = new Lazy<IServiceKhoa>(() => new ServiceKhoa(repositoryMaster, loggerService, mapper));
        _monHoc = new Lazy<IServiceMonHoc>(() => new ServiceMonHoc(repositoryMaster, loggerService, mapper));
        _chuongTrinhDaoTao = new Lazy<IServiceChuongTrinhDaoTao>(() => new ServiceChuongTrinhDaoTao(repositoryMaster, loggerService, mapper));
        _chiTietChuongTrinhDaoTao = new Lazy<IServiceChiTietChuongTrinhDaoTao>(() => new ServiceChiTietChuongTrinhDaoTao(repositoryMaster, loggerService, mapper));
        _boMon = new Lazy<IServiceBoMon>(() => new ServiceBoMon(repositoryMaster, loggerService, mapper));
        _lopHocPhan = new Lazy<IServiceLopHocPhan>(() => new ServiceLopHocPhan(repositoryMaster, loggerService, mapper));
        _chiTietLopHocPhan = new Lazy<IServiceChiTietLopHocPhan>(() => new ServiceChiTietLopHocPhan(repositoryMaster, loggerService, mapper));
        _sinhVien = new Lazy<IServiceSinhVien>(() => new ServiceSinhVien(repositoryMaster, loggerService, mapper));
        _nganh = new Lazy<IServiceNganh>(() => new ServiceNganh(repositoryMaster, loggerService, mapper));
    }

    public IServiceGiangVien GiangVien => _giangVien.Value;
    public IServiceTruong Truong => _truong.Value;
    public IServiceKhoa Khoa => _khoa.Value;
    public IServiceMonHoc MonHoc => _monHoc.Value;
    public IServiceChuongTrinhDaoTao ChuongTrinhDaoTao => _chuongTrinhDaoTao.Value;
    public IServiceChiTietChuongTrinhDaoTao ChiTietChuongTrinhDaoTao => _chiTietChuongTrinhDaoTao.Value;
    public IServiceBoMon BoMon => _boMon.Value;
    public IServiceLopHocPhan LopHocPhan => _lopHocPhan.Value;
    public IServiceChiTietLopHocPhan ChiTietLopHocPhan => _chiTietLopHocPhan.Value;
    public IServiceSinhVien SinhVien => _sinhVien.Value;
    public IServiceNganh Nganh => _nganh.Value;
}