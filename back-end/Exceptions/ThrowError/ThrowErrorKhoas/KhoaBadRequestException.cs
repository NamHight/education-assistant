using System;

namespace Education_assistant.Exceptions.ThrowError.ThrowErrorKhoas;

public class KhoaBadRequestException : BadRequestException
{
    public KhoaBadRequestException(string message) : base(message)
    {
    }
}
