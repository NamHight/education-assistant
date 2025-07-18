﻿using Education_assistant.Models;
using Education_assistant.Repositories.Paginations;

namespace Education_assistant.Modules.ModuleGiangVien.Repositories.GiangViens;

public interface IRepositoryGiangVien
{
    Task<PagedListAsync<GiangVien>?> GetAllGiangVienAsync(int page, int limit, string? search, string? sortBy,
        string? sortByOrder, Guid? khoaId, Guid? boMonId, bool? active, int? trangThai, int? vaiTro, Guid? khoaGV);

    Task<IEnumerable<GiangVien>?> GetAllGiangVienNoPageAsync();
    Task<IEnumerable<GiangVien>?> GetAllGiangVienByKhoa(Guid khoaId);
    Task<IEnumerable<GiangVien>?> GetAllGiangVienByBoMonAsync(Guid boMonId);
    Task<GiangVien?> GetGiangVienByIdAsync(Guid? id, bool trackChanges);
    Task<GiangVien?> GetGiangVienByEmailAsync(string email, bool trackChanges);
    Task<GiangVien?> GetGiangVienByTaiKhoanIdAsync(Guid taiKhoanId, bool trackChanges);
    Task<int> GetAllTongSoLuongGiangVienAsync(Guid? khoaId);
    Task<int> GetAllTrangThainDangCongTacAsync(Guid? khoaId);
    Task<int> GetAllTrangThaiNghiViecAsync(Guid? khoaId);
    Task<int> GetAllTrangThaiNghiHuuAsync(Guid? khoaId);
    Task<int> GetAllChucVuGiangVienAsync(Guid? khoaId);
    Task<int> GetAllChucVuGiangVienChinhAsync(Guid? khoaId);
    Task<int> GetAllChucVuTruongBoMonAsync(Guid? khoaId);
    Task<int> GetAllChucVuTruongKhoaAsync(Guid? khoaId);
    Task CreateAsync(GiangVien giangVien);
    void UpdateGiangVien(GiangVien giangVien);
    void DeleteGiangVien(GiangVien giangVien);
    Task<GiangVien?> GetGiangVienDeleteAsync(Guid id, bool trackChanges);
}