using System;
using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleLopHocPhan.DTOs.Request;

public class RequestAddLopHocPhanDto
{
    [Required(ErrorMessage = "Mã học phần không được để trống")]
    [MaxLength(255, ErrorMessage = "Mã học phần không được quá 255 ký tự")]
    public string MaHocPhan { get; set; } = string.Empty;

    [Required(ErrorMessage = "Sỉ số không được để trống")]
    public int SiSo { get; set; }
    [Required(ErrorMessage = "Trạng thái không được để trống")]
    public int TrangThai { get; set; }

    [Required(ErrorMessage = "Id Môn học không được để trống")]
    public Guid MonHocId { get; set; }
    public Guid? GiangVienId { get; set; }
    [Required(ErrorMessage = "Id lớp học không được để trống")]
    public Guid LopHocId { get; set; }
    [Required(ErrorMessage = "Id Chương trình đào tạo không được để trống")]
    public Guid ChuongTrinhDaoTaoId { get; set; }
    [Required(ErrorMessage = "Học kỳ không được để trống")]
    public int HocKy { get; set; }
    
}
public class RequestUpdateLopHocPhanDto
{
    [Required(ErrorMessage = "Mã học phần không được để trống")]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "Mã học phần không được để trống")]
    [MaxLength(255, ErrorMessage = "Mã học phần không được quá 255 ký tự")]
    public string MaHocPhan { get; set; } = string.Empty;

    [Required(ErrorMessage = "Sỉ số không được để trống")]
    public int SiSo { get; set; }
    [Required(ErrorMessage = "Trạng thái không được để trống")]
    public int TrangThai { get; set; }

    [Required(ErrorMessage = "Id Môn học không được để trống")]
    public Guid MonHocId { get; set; }
    [Required(ErrorMessage = "Id giảng viên không được để trống")]
    public Guid GiangVienId { get; set; }
    public DateTime? CreatedAt { get; set; }
}
