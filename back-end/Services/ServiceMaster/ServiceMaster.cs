using AutoMapper;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.helpers.implements;
using Education_assistant.Modules.ModuleAuthenticate.Services;
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
using Education_assistant.Repositories.RepositoryMaster;
using Education_assistant.Services.ServiceFile;  

namespace Education_assistant.Services.ServiceMaster;

public class ServiceMaster : IServiceMaster
{
    private readonly Lazy<IServiceAuthenticate> _authenticate;
    private readonly Lazy<IServiceBoMon> _boMon;
    private readonly Lazy<IServiceChiTietChuongTrinhDaoTao> _chiTietChuongTrinhDaoTao;
    private readonly Lazy<IServiceChiTietLopHocPhan> _chiTietLopHocPhan;
    private readonly Lazy<IServiceChuongTrinhDaoTao> _chuongTrinhDaoTao;
    private readonly Lazy<IServiceGiangVien> _giangVien;
    private readonly Lazy<IServiceHocBa> _hocBa;
    private readonly Lazy<IServiceKhoa> _khoa;
    private readonly Lazy<IServiceLichBieu> _lichBieu;
    private readonly Lazy<IServiceLopHoc> _lopHoc;
    private readonly Lazy<IServiceLopHocPhan> _lopHocPhan;
    private readonly Lazy<IServiceMonHoc> _monHoc;
    private readonly Lazy<IServiceNganh> _nganh;
    private readonly Lazy<IServicePhongHoc> _phongHoc;
    private readonly Lazy<IServiceSinhVien> _sinhVien;
    private readonly Lazy<IServiceTuan> _tuan;
    private readonly Lazy<IServiceTaiKhoan> _taiKhoan;
    private readonly Lazy<IServiceThongKe> _thongKe;

    public ServiceMaster(IRepositoryMaster repositoryMaster, ILoggerService loggerService, IMapper mapper,
        IPasswordHash password, IHttpContextAccessor httpContextAccessor, IServiceFIle serviceFIle,
        IConfiguration configuration, IDiemSoHelper diemSoHelper)
    {
        _giangVien = new Lazy<IServiceGiangVien>(() =>
            new ServiceGiangVien(repositoryMaster, loggerService, mapper, password, httpContextAccessor, serviceFIle));
        _khoa = new Lazy<IServiceKhoa>(() => new ServiceKhoa(repositoryMaster, loggerService, mapper));
        _monHoc = new Lazy<IServiceMonHoc>(() => new ServiceMonHoc(repositoryMaster, loggerService, mapper));
        _chuongTrinhDaoTao =
            new Lazy<IServiceChuongTrinhDaoTao>(() =>
                new ServiceChuongTrinhDaoTao(repositoryMaster, loggerService, mapper));
        _chiTietChuongTrinhDaoTao = new Lazy<IServiceChiTietChuongTrinhDaoTao>(() =>
            new ServiceChiTietChuongTrinhDaoTao(repositoryMaster, loggerService, mapper));
        _boMon = new Lazy<IServiceBoMon>(() => new ServiceBoMon(repositoryMaster, loggerService, mapper));
        _lopHocPhan =
            new Lazy<IServiceLopHocPhan>(() => new ServiceLopHocPhan(repositoryMaster, loggerService, mapper));
        _chiTietLopHocPhan =
            new Lazy<IServiceChiTietLopHocPhan>(() =>
                new ServiceChiTietLopHocPhan(repositoryMaster, loggerService, mapper));
        _sinhVien = new Lazy<IServiceSinhVien>(() =>
            new ServiceSinhVien(repositoryMaster, loggerService, mapper, httpContextAccessor, serviceFIle));
        _nganh = new Lazy<IServiceNganh>(() => new ServiceNganh(repositoryMaster, loggerService, mapper));
        _hocBa = new Lazy<IServiceHocBa>(() => new ServiceHocBa(repositoryMaster, loggerService, mapper, diemSoHelper));
        _lopHoc = new Lazy<IServiceLopHoc>(() => new ServiceLopHoc(repositoryMaster, loggerService, mapper));
        _lichBieu = new Lazy<IServiceLichBieu>(() => new ServiceLichBieu(repositoryMaster, loggerService, mapper));
        _phongHoc = new Lazy<IServicePhongHoc>(() => new ServicePhongHoc(repositoryMaster, loggerService, mapper));
        _tuan = new Lazy<IServiceTuan>(() => new ServiceTuan(repositoryMaster, loggerService, mapper));
        _authenticate = new Lazy<IServiceAuthenticate>(() =>
            new ServiceAuthenticate(loggerService, repositoryMaster, mapper, configuration, password, httpContextAccessor));
        _taiKhoan = new Lazy<IServiceTaiKhoan>(() => new ServiceTaiKhoan(repositoryMaster, loggerService, mapper, password));
        _thongKe = new Lazy<IServiceThongKe>(() => new ServiceThongKe(repositoryMaster, loggerService, mapper));
    }

    public IServiceAuthenticate Authenticate => _authenticate.Value;
    public IServiceGiangVien GiangVien => _giangVien.Value;
    public IServiceKhoa Khoa => _khoa.Value;
    public IServiceMonHoc MonHoc => _monHoc.Value;
    public IServiceChuongTrinhDaoTao ChuongTrinhDaoTao => _chuongTrinhDaoTao.Value;
    public IServiceChiTietChuongTrinhDaoTao ChiTietChuongTrinhDaoTao => _chiTietChuongTrinhDaoTao.Value;
    public IServiceBoMon BoMon => _boMon.Value;
    public IServiceLopHocPhan LopHocPhan => _lopHocPhan.Value;
    public IServiceChiTietLopHocPhan ChiTietLopHocPhan => _chiTietLopHocPhan.Value;
    public IServiceSinhVien SinhVien => _sinhVien.Value;
    public IServiceNganh Nganh => _nganh.Value;
    public IServiceHocBa HocBa => _hocBa.Value;
    public IServiceLopHoc LopHoc => _lopHoc.Value;
    public IServiceLichBieu LichBieu => _lichBieu.Value;
    public IServicePhongHoc PhongHoc => _phongHoc.Value;

    public IServiceTuan Tuan => _tuan.Value;
    public IServiceTaiKhoan TaiKhoan => _taiKhoan.Value;

    public IServiceThongKe ThongKe => _thongKe.Value;
}