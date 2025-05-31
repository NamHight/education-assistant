using System;

namespace Education_assistant.Exceptions;

public abstract class ForbiddenException : Exception
{
    protected ForbiddenException(string message) : base(message)
    {
    }
}
