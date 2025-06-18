using Education_assistant.Modules.ModuleGiangVien.DTOs.Response;
using Education_assistant.Modules.ModuleLopHoc.DTOs.Response;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Response;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Response;
using Education_assistant.Modules.ModuleNganh.DTOs.Response;
using Education_assistant.Modules.ModulePhongHoc.DTOs.Response;
using Education_assistant.Modules.ModuleTuan.DTOs.Response;

namespace Education_assistant.Modules.ModuleLichBieu.DTOs.Response
{
    public class ResponseLichBieuDto
    {
        public Guid Id { get; set; }
        public int TietBatDau { get; set; }
        public int TietKetThuc { get; set; }
        public int ThuMay { get; set; }
        public int TuanMay { get; set; }
        public int NamHoc { get; set; }
        public Guid TuanId { get; set; }
        public ResponseTuanDto? Tuan { get; set; }
        public Guid LopHocPhanId { get; set; }
        public LopHocPhanSimpleDto? LopHocPhan { get; set; }
        public Guid PhongHocId { get; set; }
        public PhongHocSimpleDto? PhongHoc { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
