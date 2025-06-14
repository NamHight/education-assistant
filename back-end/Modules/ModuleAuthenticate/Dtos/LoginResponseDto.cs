using Education_assistant.Modules.ModuleGiangVien.DTOs.Response;

namespace Education_assistant.Modules.ModuleAuthenticate.Dtos;

public record LoginResponseDto(ResponseGiangVienDto User, string AccessToken, string RefreshToken);