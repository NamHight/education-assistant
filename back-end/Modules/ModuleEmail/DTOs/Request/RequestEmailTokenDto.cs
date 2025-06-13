using System;
using Education_assistant.Models;

namespace Education_assistant.Modules.ModuleEmail.DTOs.Request;

public record RequestEmailTokenDto(GiangVien GiangVien, string token);
