using System;

namespace Education_assistant.Exceptions.ThrowError.LopHocExceptions;

public class LopHocExistdException : ExistedException
{
    public LopHocExistdException(string message) : base(message)
    {
    }
}
