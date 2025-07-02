using System;

namespace Education_assistant.Exceptions.ThrowError.TuanExceptions;

public class TuanExistdException : ExistedException
{
    public TuanExistdException(string message) : base(message)
    {
    }
}
