
using System;

namespace Education_assistant.Exceptions.ThrowError.LichBieuExceptions;

public class LichBieuExistdException : ExistedException
{
    public LichBieuExistdException(string message) : base(message)
    {
    }
}
