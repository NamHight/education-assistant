using Education_assistant.Modules.ModuleGiangVien.DTOs.Response;
using Education_assistant.Modules.ModuleLopHoc.DTOs.Response;
using Education_assistant.Modules.ModuleLopHocPhan.DTOs.Response;
using Education_assistant.Modules.ModuleMonHoc.DTOs.Response;
using Education_assistant.Modules.ModuleNganh.DTOs.Response;

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
        public Guid MonHocId { get; set; }
        public Guid LopHocPhanId { get; set; }
        public Guid PhongHocId { get; set; }
        public ResponseMonHocDto MonHoc { get; set; } = null!;
        public ResponseLopHocPhanDto LopHocPhan { get; set; } = null!;
        //public ResponseLopHocDto PhongHoc { get; set; } = null!; //TODO: Module PhongHoc
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
