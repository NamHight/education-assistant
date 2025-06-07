using System;

namespace Education_assistant.Exceptions.ThrowError.LichBieuExceptions;

public sealed class LichBieuBadRequestException : BadRequestException
{
    public LichBieuBadRequestException(string message) : base(message)
    {
    }
}
