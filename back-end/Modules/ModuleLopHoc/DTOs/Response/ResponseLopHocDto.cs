using Education_assistant.Modules.ModuleGiangVien.DTOs.Response;
using Education_assistant.Modules.ModuleKhoa.DTOs.Response;
using Education_assistant.Modules.ModuleNganh.DTOs.Response;

namespace Education_assistant.Modules.ModuleLopHoc.DTOs.Response
{
    public class ResponseLopHocDto
    {
        public int STT { get; set; }
        public Guid Id { get; set; }
        public string MaLopHoc { get; set; } = string.Empty;
        public int SiSo { get; set; }
        public int NamHoc { get; set; }
        public Guid GiangVienId { get; set; }
        public Guid NganhId { get; set; }
        public GiangVienSimpleDto? GiangVien { get; set; }
        public NganhSimpleDto? Nganh { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
    public class LopHocSimpleDto
    {
        public Guid Id { get; set; }
        public string MaLopHoc { get; set; } = string.Empty;
    }
}
