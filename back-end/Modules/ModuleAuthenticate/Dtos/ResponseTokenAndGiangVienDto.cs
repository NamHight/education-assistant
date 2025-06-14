using Education_assistant.Modules.ModuleGiangVien.DTOs.Response;

namespace Education_assistant.Modules.ModuleAuthenticate.Dtos;

public class ResponseTokenAndGiangVienDto
{
    private ResponseGiangVienDto GiangVien { get; set; }
    private string Token { get; set; }
}