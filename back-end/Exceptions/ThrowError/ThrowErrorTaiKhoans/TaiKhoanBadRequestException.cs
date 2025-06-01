using System;

namespace Education_assistant.Exceptions.ThrowError.ThrowErrorTaiKhoans;

public class TaiKhoanBadRequestException : BadRequestException
{
    public TaiKhoanBadRequestException(string message) : base(message)
    {
    }
}
