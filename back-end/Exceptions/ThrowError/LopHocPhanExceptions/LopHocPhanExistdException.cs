using System;

namespace Education_assistant.Exceptions.ThrowError.LopHocPhanExceptions;

public class LopHocPhanExistdException : ExistedException
{
    public LopHocPhanExistdException(string message) : base(message)
    {
    }
}
