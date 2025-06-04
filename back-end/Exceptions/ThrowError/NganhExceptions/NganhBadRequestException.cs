using System;

namespace Education_assistant.Exceptions.ThrowError.NganhExceptions;

public class NganhBadRequestException : BadRequestException
{
    public NganhBadRequestException(string message) : base(message)
    {
    }
}
