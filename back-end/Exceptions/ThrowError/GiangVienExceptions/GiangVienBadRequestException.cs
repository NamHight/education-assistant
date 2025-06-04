using System;

namespace Education_assistant.Exceptions.ThrowError.GiangVienExceptions;

public class GiangVienBadRequestException : BadRequestException
{
    public GiangVienBadRequestException(string message) : base(message)
    {
    }
}
