using System;

namespace Education_assistant.Exceptions.ThrowError.ThrowErrorChuongTrinhDaoTaos;

public class ChuongTrinhDaoTaoBadRequestException : BadRequestException
{
    public ChuongTrinhDaoTaoBadRequestException(string message) : base(message)
    {
    }
}
