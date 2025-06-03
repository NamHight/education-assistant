using System;

namespace Education_assistant.Exceptions.ThrowError.ThrowErrorTruongs;

public sealed class TruongBadRequestException : BadRequestException
{
    public TruongBadRequestException(string message) : base(message)
    {
    }
}
