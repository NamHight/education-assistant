using System;

namespace Education_assistant.Exceptions.ThrowError.TuanExceptions;

public class TuanBadRequestException : BadRequestException
{
    public TuanBadRequestException(string message) : base(message)
    {
    }
}
