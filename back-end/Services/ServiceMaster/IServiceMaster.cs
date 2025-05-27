using Education_assistant.Modules.ModuleGiangVien.Services;

namespace Education_assistant.Services.ServiceMaster;

public interface IServiceMaster
{
    IServiceGiangVien GiangVien { get; }
}