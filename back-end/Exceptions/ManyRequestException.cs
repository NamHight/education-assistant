using System;

namespace Education_assistant.Exceptions;

public abstract class ManyRequestException : Exception
{
    protected ManyRequestException(string message) : base(message)
    {
    }
}
