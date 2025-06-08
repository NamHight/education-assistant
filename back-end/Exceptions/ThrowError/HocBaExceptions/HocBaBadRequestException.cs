using System;

namespace Education_assistant.Exceptions.ThrowError.HocBaExceptions;

public class HocBaBadRequestException : BadRequestException
{
    public HocBaBadRequestException(string message) : base(message)
    {
    }
}
