using Education_assistant.Context;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Models;
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
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Education_assistant.Repositories.RepositoryMaster;

public class RepositoryMaster : IRepositoryMaster
{
    private readonly IDbContextFactory<RepositoryContext> _contextFactory;
    private readonly RepositoryContext _repositoryContext;
    private readonly Lazy<IRepositoryChiTietChuongTrinhDaoTao> _repositoryChiTietChuongTrinhDaoTao;
    private readonly Lazy<IRepositoryChiTietLopHocPhan> _repositoryChiTietLopHocPhan;
    private readonly Lazy<IRepositoryChuongTrinhDaoTao> _repositoryChuongTrinhDaoTao;
    private readonly Lazy<IRepositoryGiangVien> _repositoryGiangVien;
    private readonly Lazy<IRepositoryHocBa> _repositoryHocBa;
    private readonly Lazy<IRepositoryKhoa> _repositoryKhoa;
    private readonly Lazy<IRepositoryLichBieu> _repositoryLichBieu;
    private readonly Lazy<IRepositoryLopHoc> _repositoryLopHoc;
    private readonly Lazy<IRepositoryLopHocPhan> _repositoryLopHocPhan;
    private readonly Lazy<IRepositoryMonHoc> _repositoryMonHoc;
    private readonly Lazy<IRepositorySinhVien> _repositorySinhVien;
    private readonly Lazy<IRepositoryTaiKhoan> _repositoryTaiKhoan;
    private readonly Lazy<IRepositoryTruong> _repositoryTruong;
    private readonly Lazy<IRepositoryBoMon> _repositoryBoMon;
    private readonly Lazy<IRepositoryNganh> _repositoryNganh;
    private readonly Lazy<IRepositoryPhongHoc> _repositoryPhongHoc;
    private readonly ILoggerService _loggerService;
    private bool _disposed;
    private IDbContextTransaction? _transaction;


    public RepositoryMaster(RepositoryContext repositoryContext, IDbContextFactory<RepositoryContext> contextFactory, ILoggerService loggerService)
    {
        _repositoryContext = repositoryContext;
        _contextFactory = contextFactory;
        _repositoryChiTietChuongTrinhDaoTao = new Lazy<IRepositoryChiTietChuongTrinhDaoTao>(() => new RepositoryChiTietChuongTrinhDaoTao(repositoryContext));
        _repositoryChiTietLopHocPhan = new Lazy<IRepositoryChiTietLopHocPhan>(() => new RepositoryChiTietLopHocPhan(repositoryContext));
        _repositoryChuongTrinhDaoTao = new Lazy<IRepositoryChuongTrinhDaoTao>(() => new RepositoryChuongTrinhDaoTao(repositoryContext));
        _repositoryGiangVien = new Lazy<IRepositoryGiangVien>(() => new RepositoryGiangVien(repositoryContext));
        _repositoryHocBa = new Lazy<IRepositoryHocBa>(() => new RepositoryHocBa(repositoryContext));
        _repositoryKhoa = new Lazy<IRepositoryKhoa>(() => new RepositoryKhoa(repositoryContext));
        _repositoryLichBieu = new Lazy<IRepositoryLichBieu>(() => new RepositoryLichBieu(repositoryContext));
        _repositoryLopHoc = new Lazy<IRepositoryLopHoc>(() => new RepositoryLopHoc(repositoryContext));
        _repositoryLopHocPhan = new Lazy<IRepositoryLopHocPhan>(() => new RepositoryLopHocPhan(repositoryContext));
        _repositoryMonHoc = new Lazy<IRepositoryMonHoc>(() => new RepositoryMonHoc(repositoryContext));
        _repositorySinhVien = new Lazy<IRepositorySinhVien>(() => new RepositorySinhVien(repositoryContext));
        _repositoryTaiKhoan = new Lazy<IRepositoryTaiKhoan>(() => new RepositoryTaiKhoan(repositoryContext));
        _repositoryTruong = new Lazy<IRepositoryTruong>(() => new RepositoryTruong(repositoryContext));
        _repositoryBoMon = new Lazy<IRepositoryBoMon>(() => new RepositoryBoMon(repositoryContext));
        _repositoryNganh = new Lazy<IRepositoryNganh>(() => new RepositoryNganh(repositoryContext));
        _repositoryPhongHoc = new Lazy<IRepositoryPhongHoc>(() => new RepositoryPhongHoc(repositoryContext));
        _loggerService = loggerService;
    }

    public IRepositoryGiangVien GiangVien => _repositoryGiangVien.Value;
    public IRepositorySinhVien SinhVien => _repositorySinhVien.Value;

    public IRepositoryChiTietChuongTrinhDaoTao ChiTietChuongTrinhDaoTao => _repositoryChiTietChuongTrinhDaoTao.Value;

    public IRepositoryChiTietLopHocPhan ChiTietLopHocPhan => _repositoryChiTietLopHocPhan.Value;

    public IRepositoryChuongTrinhDaoTao ChuongTrinhDaoTao => _repositoryChuongTrinhDaoTao.Value;

    public IRepositoryHocBa HocBa => _repositoryHocBa.Value;

    public IRepositoryKhoa Khoa => _repositoryKhoa.Value;

    public IRepositoryLichBieu LichBieu => _repositoryLichBieu.Value;

    public IRepositoryLopHoc LopHoc => _repositoryLopHoc.Value;

    public IRepositoryLopHocPhan LopHocPhan => _repositoryLopHocPhan.Value;

    public IRepositoryMonHoc MonHoc => _repositoryMonHoc.Value;

    public IRepositoryTaiKhoan TaiKhoan => _repositoryTaiKhoan.Value;

    public IRepositoryTruong Truong => _repositoryTruong.Value;

    public IRepositoryBoMon BoMon => _repositoryBoMon.Value;

    public IRepositoryNganh Nganh => _repositoryNganh.Value;
    public IRepositoryPhongHoc PhongHoc => _repositoryPhongHoc.Value;

    public async Task BeginTransactionAsync()
    {
        _transaction = await _repositoryContext.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        try
        {
            await _transaction!.CommitAsync();
        }
        finally
        {
            _transaction?.Dispose();
            _transaction = null!;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null!;
        }
    }

    public async Task SaveChangesAsync()
    {
        await _repositoryContext.SaveChangesAsync();
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    // Chỉ sử dụng ở lớp service thêm xóa sửa 
    public RepositoryContext CreateNewContext()
    {
        return _contextFactory.CreateDbContext();
    }

    public async Task<RepositoryContext> CreateNewContextAsync()
    {
        return await _contextFactory.CreateDbContextAsync();
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                _transaction?.Dispose();
                _repositoryContext?.Dispose();
            }

            _disposed = true;
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (_transaction != null) await _transaction.DisposeAsync();

        if (_repositoryContext != null) await _repositoryContext.DisposeAsync();

        Dispose(false);
        GC.SuppressFinalize(this);
    }

    //method thực thi các db cùng trong một transaction với retry strategy
    //dùng khi cud bình thường
    public async Task ExecuteInTransactionAsync(Func<Task> operation)
    {
        var strategy = _repositoryContext.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = await _repositoryContext.Database.BeginTransactionAsync();
            try
            {
                await operation();
                await _repositoryContext.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _loggerService.LogError($"Error transaction: {ex.Message}");
                throw new Exception($"Lỗi hệ thống!: {ex.Message}");
            }
        });
    }
    //dùng cho update hàng loạt
    public async Task BulkUpdateEntityAsync<T>(IList<T> entities) where T : class
    {
        await _repositoryContext.BulkUpdateAsync(entities);
    }
    //dùng cho add hàng loạt
    public async Task BulkAddEntityAsync<T>(IList<T> entities) where T : class
    {
        await _repositoryContext.BulkInsertAsync(entities, options =>
        {
            options.BatchSize = 1000;
            options.IncludeGraph = false;
        });
    }
    public async Task ExecuteInTransactionBulkEntityAsync(Func<Task> operation)
    {
        var strategy = _repositoryContext.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = await _repositoryContext.Database.BeginTransactionAsync();
            try
            {
                await operation();
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _loggerService.LogError($"Error transaction: {ex.Message}");
                throw new Exception($"Lỗi hệ thống!: {ex.Message}");
            }
        });
    }
}