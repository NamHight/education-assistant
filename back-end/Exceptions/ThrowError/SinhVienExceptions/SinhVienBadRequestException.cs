using System;

namespace Education_assistant.Exceptions.ThrowError.SinhVienExceptions;

public class SinhVienBadRequestException : BadRequestException
{
    public SinhVienBadRequestException(string message) : base(message)
    {
    }
}
