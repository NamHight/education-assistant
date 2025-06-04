using System;

namespace Education_assistant.Exceptions.ThrowError.LopHocPhanExceptions;

public class LopHocPhanBadRequestException : BadRequestException
{
    public LopHocPhanBadRequestException(string message) : base(message)
    {
    }
}
