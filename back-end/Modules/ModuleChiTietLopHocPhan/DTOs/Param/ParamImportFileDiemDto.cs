using System;
using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Param;

public class ParamImportFileDiemDto
{
    [Required(ErrorMessage = "Id giảng viên không được để trống")]
    public Guid GiangVienId { get; set; }
    [Required(ErrorMessage = "Id môn học không được để trống")]
    public Guid MonHocId { get; set; }
    [Required(ErrorMessage = "Id lớp học phần không được để trống")]
    public Guid LopHocPhanId { get; set; }
    [Required(ErrorMessage = "File import không được để trống")]
    [FileExtensions(Extensions = "xls,xlsx", ErrorMessage = "Chỉ cho phép file Excel (.xls, .xlsx)")]
    public IFormFile? file { get; set; } 
}
