using System;

namespace Education_assistant.Exceptions.ThrowError.DangKyMonHocExceptions;

public class DangKyMonHocBadRequestException : BadRequestException
{
    public DangKyMonHocBadRequestException(string message) : base(message)
    {
    }
}
