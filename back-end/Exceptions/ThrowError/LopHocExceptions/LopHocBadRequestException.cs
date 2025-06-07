using System;

namespace Education_assistant.Exceptions.ThrowError.LopHocExceptions;

public sealed class LopHocBadRequestException : BadRequestException
{
    public LopHocBadRequestException(string message) : base(message)
    {
    }
}
