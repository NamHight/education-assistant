using System;

namespace Education_assistant.Exceptions.ThrowError.BoMonExceptions;

public class BoMonBadRequestException : BadRequestException
{
    public BoMonBadRequestException(string message) : base(message)
    {
    }
}
