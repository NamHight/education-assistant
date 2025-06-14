using System;
using Education_assistant.Models;

namespace Education_assistant.Services.ServiceEmails.DTOs.Request;

public record RequestEmailTokenDto(GiangVien GiangVien, string token);