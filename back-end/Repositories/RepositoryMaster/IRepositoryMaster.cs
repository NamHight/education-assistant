using Education_assistant.Context;
using Education_assistant.Modules.ModuleAuthenticate.Repositories;
using Education_assistant.Modules.ModuleBoMon.Repositories;
using Education_assistant.Modules.ModuleChiTietChuongTrinhDaoTao.Repositories;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.Repositories;
using Education_assistant.Modules.ModuleChuongTrinhDaoTao.Repositories;
using Education_assistant.Modules.ModuleGiangVien.Repositories.GiangViens;
using Education_assistant.Modules.ModuleGiangVien.Repositories.TaiKhoans;
using Education_assistant.Modules.ModuleHocBa.Repositories;
using Education_assistant.Modules.ModuleKhoa.Repositories;
using Education_assistant.Modules.ModuleLichBieu.Repositories;
using Education_assistant.Modules.ModuleLopHoc.Repositories;
using Education_assistant.Modules.ModuleLopHocPhan.Repositories;
using Education_assistant.Modules.ModuleMonHoc.Repositories;
using Education_assistant.Modules.ModuleNganh.Repositories;
using Education_assistant.Modules.ModulePhongHoc.Repositories;
using Education_assistant.Modules.ModuleSinhVien.Repositories;
using Education_assistant.Modules.ModuleTruong.Repositories;

namespace Education_assistant.Repositories.RepositoryMaster;

public interface IRepositoryMaster : IDisposable
{
    IRepositoryChiTietChuongTrinhDaoTao ChiTietChuongTrinhDaoTao { get; }
    IRepositoryChiTietLopHocPhan ChiTietLopHocPhan { get; }
    IRepositoryChuongTrinhDaoTao ChuongTrinhDaoTao { get; }
    IRepositoryGiangVien GiangVien { get; }
    IRepositoryHocBa HocBa { get; }
    IRepositoryKhoa Khoa { get; }
    IRepositoryLichBieu LichBieu { get; }
    IRepositoryLopHoc LopHoc { get; }
    IRepositoryLopHocPhan LopHocPhan { get; }
    IRepositoryMonHoc MonHoc { get; }
    IRepositorySinhVien SinhVien { get; }
    IRepositoryTaiKhoan TaiKhoan { get; }
    IRepositoryTruong Truong { get; }
    IRepositoryBoMon BoMon { get; }
    IRepositoryNganh Nganh { get; }
    IRepositoryPhongHoc PhongHoc { get; }
    IRepositoryAuthenticate Authenticate { get; }
    public Task ExecuteInTransactionAsync(Func<Task> operation);

    Task BulkUpdateEntityAsync<T>(IList<T> entities) where T : class;
    Task BulkAddEntityAsync<T>(IList<T> entities) where T : class;
    Task ExecuteInTransactionBulkEntityAsync(Func<Task> operation);

    RepositoryContext CreateNewContext();
    Task<RepositoryContext> CreateNewContextAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
    Task SaveChangesAsync();
}