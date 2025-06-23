using System.ComponentModel.DataAnnotations;
using Education_assistant.Models.Enums;

namespace Education_assistant.Modules.ModulePhongHoc.DTOs.Request
{
    public class RequestAddPhongHocDto
    {
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
        public DateTime? CreatedAt { get; set; }
    }

}

