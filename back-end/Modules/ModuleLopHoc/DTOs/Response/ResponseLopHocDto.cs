using Education_assistant.Modules.ModuleGiangVien.DTOs.Response;
using Education_assistant.Modules.ModuleKhoa.DTOs.Response;
using Education_assistant.Modules.ModuleNganh.DTOs.Response;

namespace Education_assistant.Modules.ModuleLopHoc.DTOs.Response
{
    public class ResponseLopHocDto
    {
        public Guid Id { get; set; }
        public string MaLopHoc { get; set; } = string.Empty;
        public int SiSo { get; set; }
        public string NamHoc { get; set; } = string.Empty;
        public Guid GiangVienId { get; set; }
        public Guid NganhId { get; set; }
        public ResponseGiangVienDto GiangVien { get; set; } = null!;
        public ResponseNganhDto Nganh { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
