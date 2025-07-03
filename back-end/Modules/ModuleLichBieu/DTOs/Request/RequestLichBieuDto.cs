using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleLichBieu.DTOs.Request
{

    public class RequestAddLichBieuDto
    {
        [Required(ErrorMessage = "Tiết bắt đầu không được để trống")]
        public int TietBatDau { get; set; }

        [Required(ErrorMessage = "Tiết kết thúc không được để trống")]
        public int TietKetThuc { get; set; }

        [Required(ErrorMessage = "Thứ không được để trống")]
        public int Thu { get; set; }
        public Guid? TuanId { get; set; }
        public Guid LopHocPhanId { get; set; }
        public Guid PhongHocId { get; set; }
    }
    public class RequestUpdateLichBieuSimpleDto
    {
        [Required(ErrorMessage = "Id không được để trống")]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Tiết bắt đầu không được để trống")]
        public int TietBatDau { get; set; }

        [Required(ErrorMessage = "Tiết kết thúc không được để trống")]
        public int TietKetThuc { get; set; }

        [Required(ErrorMessage = "Thứ không được để trống")]
        public int Thu { get; set; }
        [Required(ErrorMessage = "Id lớp học phần không được để trống")]
        public Guid LopHocPhanId { get; set; }
        [Required(ErrorMessage = "Id phòng học không được để trống")]
        public Guid PhongHocId { get; set; }
    }
    public class RequestUpdateLichBieuDto
    {
        [Required(ErrorMessage = "Id không được để trống")]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Tiết bắt đầu không được để trống")]
        public int TietBatDau { get; set; }

        [Required(ErrorMessage = "Tiết kết thúc không được để trống")]
        public int TietKetThuc { get; set; }

        [Required(ErrorMessage = "Thứ không được để trống")]
        public int Thu { get; set; }
        public Guid? TuanId { get; set; }
        public Guid LopHocPhanId { get; set; }
        public Guid PhongHocId { get; set; }
    }
    public class RequestAddLichBieuListTuanDto
    {
        [Required(ErrorMessage = "Danh sách lịch biểu không được để trống")]
        public List<RequestUpdateLichBieuDto>? LichBieus { get; set; }
        [Required(ErrorMessage = "Năm học không được để trống")]
        public int NamHoc { get; set; }
        [Required(ErrorMessage = "Id vào tuần không được để trống")]
        public Guid VaoTuanId { get; set; }
        [Required(ErrorMessage = "Id đến tuần không được để trống")]
        public Guid DenTuanId { get; set; }
        [Required(ErrorMessage = "Id giảng viên không được để trống")]
        public Guid GiangVienId { get; set; }
    }
}
