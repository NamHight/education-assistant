using System;

namespace Education_assistant.Exceptions.ThrowError.ChiTietLopHocPhanExceptions;

public class ChiTietLopHocPhanBadRequestException : BadRequestException
{
    public ChiTietLopHocPhanBadRequestException(string message) : base(message)
    {
    }
}
