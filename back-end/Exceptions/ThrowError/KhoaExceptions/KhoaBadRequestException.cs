using System;

namespace Education_assistant.Exceptions.ThrowError.KhoaExceptions;

public class KhoaBadRequestException : BadRequestException
{
    public KhoaBadRequestException(string message) : base(message)
    {
    }
}
