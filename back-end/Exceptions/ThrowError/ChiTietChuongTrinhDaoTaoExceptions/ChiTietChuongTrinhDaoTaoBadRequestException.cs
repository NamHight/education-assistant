using System;

namespace Education_assistant.Exceptions.ThrowError.ChiTietChuongTrinhDaoTaoExceptions;

public class ChiTietChuongTrinhDaoTaoBadRequestException : BadRequestException
{
    public ChiTietChuongTrinhDaoTaoBadRequestException(string message) : base(message)
    {
    }
}
