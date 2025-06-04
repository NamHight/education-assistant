using System;

namespace Education_assistant.Exceptions.ThrowError.MonHocExceptions;

public sealed class MonHocBadRequestException : BadRequestException
{
    public MonHocBadRequestException(string message) : base(message)
    {
    }
}
