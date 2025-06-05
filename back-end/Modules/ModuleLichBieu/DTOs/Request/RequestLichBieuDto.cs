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
        public int ThuMay { get; set; }

        [Required(ErrorMessage = "Tuần không được để trống")]
        public int TuanMay { get; set; }
        
        [Required(ErrorMessage = "Năm học không được để trống")]
        public int NamHoc { get; set; }

        public Guid MonHocId { get; set; }
        public Guid LopHocPhanId { get; set; }
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
        public int ThuMay { get; set; }

        [Required(ErrorMessage = "Tuần không được để trống")]
        public int TuanMay { get; set; }

        [Required(ErrorMessage = "Năm học không được để trống")]
        public int NamHoc { get; set; }

        public Guid MonHocId { get; set; }
        public Guid LopHocPhanId { get; set; }
        public Guid PhongHocId { get; set; }
    }

}
