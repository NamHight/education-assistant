using System;

namespace Education_assistant.Exceptions.ThrowError.TaiKhoanExceptions;

public class TaiKhoanBadRequestException : BadRequestException
{
    public TaiKhoanBadRequestException(string message) : base(message)
    {
    }
}
