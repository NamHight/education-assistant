using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleChuongTrinhDaoTao.DTOs.Request;

public class RequestAddChuongTrinhDaoTaoDto
{
    [Required(ErrorMessage = "Tên chương trình không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên chương trình không được quá 255 ký tự")]
    public string TenChuongTrinh { get; set; } = string.Empty;

    [Required(ErrorMessage = "Loai chương trình không được để trống")]
    public int LoaiChuonTrinhDaoTao { get; set; }

    [Required(ErrorMessage = "Thời gian đào tạo không được để trống")]
    public int ThoiGianDaoTao { get; set; }
    public string? MoTa { get; set; }

    [Required(ErrorMessage = "Tổng số tín chỉ không được để trống")]
    public int TongSoTinChi { get; set; }

    [Required(ErrorMessage = "Khóa không được để trống")]
    public int? Khoa { get; set; }

    [Required(ErrorMessage = "Id ngành không được để trống")]
    public Guid? NganhId { get; set; }
}

public class RequestUpdateChuongTrinhDaoTaoDto
{
    [Required(ErrorMessage = "Id không được để trống")]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "Tên chương trình không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên chương trình không được quá 255 ký tự")]
    public string TenChuongTrinh { get; set; } = string.Empty;

    [Required(ErrorMessage = "Loai chương trình không được để trống")]
    public int LoaiChuonTrinhDaoTao { get; set; }

    [Required(ErrorMessage = "Thời gian đào tạo không được để trống")]
    public int ThoiGianDaoTao { get; set; }
    public string? MoTa { get; set; }

    [Required(ErrorMessage = "Tổng số tín chỉ không được để trống")]
    public int TongSoTinChi { get; set; }

    [Required(ErrorMessage = "Khóa không được để trống")]
    public int? Khoa { get; set; }

    [Required(ErrorMessage = "Id ngành không được để trống")]
    public Guid? NganhId { get; set; }
}