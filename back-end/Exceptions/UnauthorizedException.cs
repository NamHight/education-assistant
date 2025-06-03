using System;

namespace Education_assistant.Exceptions;

public abstract class UnauthorizedException : Exception
{
    protected UnauthorizedException(string message) : base(message) {}
}
