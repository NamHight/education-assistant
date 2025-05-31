using System;

namespace Education_assistant.Exceptions;

public abstract class ExistedException : Exception
{
    protected ExistedException(string message) : base(message)
    {
    }
}
