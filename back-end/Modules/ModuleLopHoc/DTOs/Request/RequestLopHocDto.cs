using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleLopHoc.DTOs.Request
{

    public class RequestAddLopHocDto
    {
        [Required(ErrorMessage = "Mã lớp học không được để trống")]
        [MaxLength(255, ErrorMessage = "Mã lớp học không được quá 255 ký tự")]
        public string MaLopHoc { get; set; } = string.Empty;

        [Required(ErrorMessage = "Sỉ số không được để trống")]
        public int SiSo { get; set; }

        [Required(ErrorMessage = "Năm học không được để trống")]
        [MaxLength(10, ErrorMessage = "Năm học không được quá 10 ký tự")]
        public string NamHoc { get; set; } = string.Empty;

        public Guid GiangVienId { get; set; }
        public Guid NganhId { get; set; }
    }
    public class RequestUpdateLopHocDto
    {
        [Required(ErrorMessage = "Id không được để trống")]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Mã lớp học không được để trống")]
        [MaxLength(255, ErrorMessage = "Mã lớp học không được quá 255 ký tự")]
        public string MaLopHoc { get; set; } = string.Empty;

        [Required(ErrorMessage = "Số tín chỉ không được để trống")]
        public int SiSo { get; set; }

        [Required(ErrorMessage = "Năm học không được để trống")]
        [MaxLength(255, ErrorMessage = "Năm học không được quá 10 ký tự")]
        public string NamHoc { get; set; } = string.Empty;

        public Guid GiangVienId { get; set; }
        public Guid NganhId { get; set; }
        public DateTime? CreatedAt { get; set; }
    }

}
