using System.ComponentModel.DataAnnotations;
using Education_assistant.Modules.ModuleChiTietLopHocPhan.DTOs.Request;

namespace Education_assistant.Modules.ModuleHocBa.DTOs.Request;

public class RequestAddHocbaDto
{
    [Required(ErrorMessage = "Điểm tổng kết không được để trống")]
    public decimal DiemTongKet { get; set; } = 0;

    public string? MoTa { get; set; }

    [Required(ErrorMessage = "Kết quả học tập không được để trống")]
    public int? KetQua { get; set; } = 2;

    [Required(ErrorMessage = "Id sinh viên không được để trống")]
    public Guid? SinhVienId { get; set; }

    [Required(ErrorMessage = "Id lớp học phần không được để trống")]
    public Guid? LopHocPhanId { get; set; }

    [Required(ErrorMessage = "Id chi tiết chương trình đào tạo không được để trống")]
    public Guid? ChiTietChuongTrinhDaoTaoId { get; set; }
}

public class RequestUpdateHocbaDto
{
    [Required(ErrorMessage = "Điểm tổng kết không được để trống")]
    public decimal DiemTongKet { get; set; }
}

public class RequestListUpdateHocbaDto
{
    public List<RequestNopDiemChiTietLopHocPhanDto>? ListDiemSo { get; set; }

    [Required(ErrorMessage = "Id lớp học phần không được để trống")]
    public Guid LopHocPhanId { get; set; }

    [Required(ErrorMessage = "Id chi tiết chương trình đào tạo không được để trống")]
    public Guid MonHocId { get; set; }
}

public class RequestDeleteHocBaDto
{
    [Required(ErrorMessage = "Danh sách id không được bỏ trống")]
    public List<Guid>? Ids { get; set; }
}