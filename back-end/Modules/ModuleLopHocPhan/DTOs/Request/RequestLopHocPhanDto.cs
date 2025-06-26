using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleLopHocPhan.DTOs.Request;

public class RequestAddLopHocPhanDto
{
    public string MaHocPhan { get; set; } = string.Empty;

    [Required(ErrorMessage = "Sỉ số không được để trống")]
    public int SiSo { get; set; }

    [Required(ErrorMessage = "Trạng thái không được để trống")]
    public int TrangThai { get; set; }

    [Required(ErrorMessage = "Id Môn học không được để trống")]
    public Guid MonHocId { get; set; }

    public Guid? GiangVienId { get; set; }
}

public class RequestUpdateLopHocPhanDto
{
    [Required(ErrorMessage = "Mã học phần không được để trống")]
    public Guid Id { get; set; }

    public string MaHocPhan { get; set; } = string.Empty;

    [Required(ErrorMessage = "Sỉ số không được để trống")]
    public int SiSo { get; set; }

    [Required(ErrorMessage = "Trạng thái không được để trống")]
    public int TrangThai { get; set; }

    [Required(ErrorMessage = "Id Môn học không được để trống")]
    public Guid MonHocId { get; set; }

    public Guid GiangVienId { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class RequestGenerateLopHocPhanDto
{
    [Required(ErrorMessage = "Id ngành không được để trống")]
    public Guid NganhId { get; set; }

    [Required(ErrorMessage = "Học kỳ không được để trống")]
    public int HocKy { get; set; }

    [Required(ErrorMessage = "Khóa không được để trống")]
    public int Khoa { get; set; }
}