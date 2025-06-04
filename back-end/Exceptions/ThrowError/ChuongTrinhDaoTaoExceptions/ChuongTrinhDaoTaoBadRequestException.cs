using System;

namespace Education_assistant.Exceptions.ThrowError.ChuongTrinhDaoTaoExceptions;

public class ChuongTrinhDaoTaoBadRequestException : BadRequestException
{
    public ChuongTrinhDaoTaoBadRequestException(string message) : base(message)
    {
    }
}
