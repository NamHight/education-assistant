using System;
using System.Data;
using DocumentFormat.OpenXml.Office.CustomUI;
using Education_assistant.Context;
using Education_assistant.Models.Enums;
using Education_assistant.Modules.ModuleThongKe.Record;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using Sprache;

namespace Education_assistant.Modules.ModuleThongKe.Repositories;

public class RepositoryThongKe : IRepositoryThongKe
{
    private readonly RepositoryContext _context;

    public RepositoryThongKe(RepositoryContext context)
    {
        _context = context;
    }

    public async Task<PassFailPointRaw?> GetPassFailDiemSoAsync(Guid lopHocPhanId)
    {
        using var conn = _context.Database.GetDbConnection();

        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();

        cmd.CommandText = "CALL sp_GetPassFailDiemSo(@p_lopHocPhanId)";
        cmd.CommandType = CommandType.Text;

        var param = cmd.CreateParameter();
        param.ParameterName = "@p_lopHocPhanId";
        param.Value = lopHocPhanId.ToString();

        cmd.Parameters.Add(param);

        using var reader = await cmd.ExecuteReaderAsync();

        PassFailPointRaw? result = null;
        if (await reader.ReadAsync())
        {
            result = new PassFailPointRaw
            {
                MaHocPhan = reader.GetString(0),
                PassCount = reader.GetInt32(1),
                FailCount = reader.GetInt32(2)
            };
        }
        return result;
    }

    public async Task<List<TopStudentRaw>> GetTopSinhVienLopHocPhanAsync(int khoa, int hocKy)
    {
        var result = new List<TopStudentRaw>();
        using var conn = _context.Database.GetDbConnection();

        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();

        cmd.CommandText = "CALL sp_GetTop1SinhVienTheoLopHocPhan(@p_khoa, @p_hocKy)";
        cmd.CommandType = CommandType.Text;

        var paramKhoa = cmd.CreateParameter();
        paramKhoa.ParameterName = "@p_khoa";
        paramKhoa.Value = khoa;
        paramKhoa.DbType = DbType.Int32;
        cmd.Parameters.Add(paramKhoa);

        var paramHocKy = cmd.CreateParameter();
        paramHocKy.ParameterName = "@p_hocKy";
        paramHocKy.Value = hocKy;
        paramHocKy.DbType = DbType.Int32;
        cmd.Parameters.Add(paramHocKy);


        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var student = new TopStudentRaw
            {
                MaHocPhan = reader.GetString(0),
                MSSV = reader.GetInt32(1),
                HoTen = reader.GetString(2),
                DiemTongKet = reader.GetDecimal(3)
            };
            result.Add(student);
        }

        return result;
    }

    public async Task<Dictionary<string, double>> ThongKetTinhTrangHocTap()
    {
        var result = new Dictionary<string, double>();
        var labelMap = new Dictionary<int, string>
        {
            { 1, "Yếu"},
            { 2, "Trung bình"},
            { 3, "Khá"},
            { 4, "Giỏi"},
            { 5, "Xuất sắc"},
            { 6, "Đình chỉ"},
        };

        var temp = new Dictionary<string, int>();
        int tong = 0;


        using var conn = _context.Database.GetDbConnection();

        await conn.OpenAsync();
        using var cmd = conn.CreateCommand();

        cmd.CommandText = "CALL ThongKe_TinhTrangHocTap";
        cmd.CommandType = CommandType.Text;

        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            int maTinhTrang = reader.GetInt32(0);
            int soLuong = reader.GetInt32(1);

            tong += soLuong;

            string label = labelMap[maTinhTrang];
            temp[label] = soLuong;
        }

        foreach (var item in temp)
        {
            double phanTram = Math.Round((item.Value * 100.0) / tong, 1);
            result[item.Key] = phanTram;
        }

        return result;
    }
}
