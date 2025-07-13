using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Education_assistant.Modules.ModulePhongHoc.DTOs.Request;

public class RequestAddPhongHocDto
{
    [Required(ErrorMessage = "Tên phòng học không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên phòng học không được quá 255 ký tự")]
    [JsonPropertyName("TenPhong")]
    public string TenPhong { get; set; } = string.Empty;

    [Required(ErrorMessage = "Tên toà nhà không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên toà nhà không được quá 255 ký tự")]
    [JsonPropertyName("ToaNha")]
    public string ToaNha { get; set; } = string.Empty;

    [Required(ErrorMessage = "Sức chứa không được để trống")]
    [Range(1, int.MaxValue, ErrorMessage = "Sức chứa phải lớn hơn 0")]
    [JsonPropertyName("SucChua")]
    public int SucChua { get; set; }

    [Required(ErrorMessage = "Loại phòng học không được để trống")]
    [Range(1, 3, ErrorMessage = "Loại phòng học không hợp lệ")]
    [JsonPropertyName("LoaiPhongHoc")]
    public int LoaiPhongHoc { get; set; }

    [Required(ErrorMessage = "Trạng thái phòng học không được để trống")]
    [Range(1, 3, ErrorMessage = "Trạng thái phòng học không hợp lệ")]
    [JsonPropertyName("TrangThaiPhongHoc")]
    public int TrangThaiPhongHoc { get; set; }
}

public class RequestAddPhongHocVirtualListDto
{
    [Required(ErrorMessage = "Toà nhà không được để trống")]
    [MaxLength(255, ErrorMessage = "Toà nhà không được quá 255 ký tự")]
    public string ToaNha { get; set; } = string.Empty;

    [Required(ErrorMessage = "Lầu không được để trống")]
    public int Lau { get; set; }

    [Required(ErrorMessage = "Số phòng không được để trống")]
    public int SoPhong { get; set; }

    [Required(ErrorMessage = "Sức chứa không được để trống")]
    [Range(1, 500, ErrorMessage = "Sức chứa phải lớn hơn 0")]
    public int SucChua { get; set; }

    [Required(ErrorMessage = "Loại phòng học không được để trống")]
    [Range(1, 3, ErrorMessage = "Loại phòng học không hợp lệ")]
    public int LoaiPhongHoc { get; set; }

    [Required(ErrorMessage = "Trạng thái phòng học không được để trống")]
    [Range(1, 3, ErrorMessage = "Trạng thái phòng học không hợp lệ")]
    public int TrangThaiPhongHoc { get; set; }
}

public class RequestAddPhongHocAutoDto
{
    [Required(ErrorMessage = "Tên phòng không được để trống")]
    public List<string>? TenPhongs { get; set; }

    [Required(ErrorMessage = "Toà nhà không được để trống")]
    [MaxLength(255, ErrorMessage = "Toà nhà không được quá 255 ký tự")]
    public string ToaNha { get; set; } = string.Empty;

    [Required(ErrorMessage = "Sức chứa không được để trống")]
    [Range(1, 500, ErrorMessage = "Sức chứa phải lớn hơn 0")]
    public int SucChua { get; set; }

    [Required(ErrorMessage = "Loại phòng học không được để trống")]
    [Range(1, 3, ErrorMessage = "Loại phòng học không hợp lệ")]
    public int LoaiPhongHoc { get; set; }
}

public class RequestUpdatePhongHocDto
{
    [Required(ErrorMessage = "Id không được để trống")]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "Tên phòng học không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên phòng học không được quá 255 ký tự")]
    public string TenPhong { get; set; } = string.Empty;

    [Required(ErrorMessage = "Tên toà nhà không được để trống")]
    [MaxLength(255, ErrorMessage = "Tên toà nhà không được quá 255 ký tự")]
    public string ToaNha { get; set; } = string.Empty;

    [Required(ErrorMessage = "Sức chứa không được để trống")]
    [Range(1, int.MaxValue, ErrorMessage = "Sức chứa phải lớn hơn 0")]
    public int SucChua { get; set; }

    [Required(ErrorMessage = "Loại phòng học không được để trống")]
    [Range(1, 3, ErrorMessage = "Loại phòng học không hợp lệ")]
    public int LoaiPhongHoc { get; set; }

    [Required(ErrorMessage = "Trạng thái phòng học không được để trống")]
    [Range(1, 3, ErrorMessage = "Trạng thái phòng học không hợp lệ")]
    public int TrangThaiPhongHoc { get; set; }
}

public class RequestUpdatePhongHocOptionDto
{
    [Required(ErrorMessage = "Sức chứa không được để trống")]
    [Range(1, int.MaxValue, ErrorMessage = "Sức chứa phải lớn hơn 0")]
    public int SucChua { get; set; }

    [Required(ErrorMessage = "Loại phòng học không được để trống")]
    [Range(1, 3, ErrorMessage = "Loại phòng học không hợp lệ")]
    public int LoaiPhongHoc { get; set; }

    [Required(ErrorMessage = "Trạng thái phòng học không được để trống")]
    [Range(1, 3, ErrorMessage = "Trạng thái phòng học không hợp lệ")]
    public int TrangThaiPhongHoc { get; set; }
}