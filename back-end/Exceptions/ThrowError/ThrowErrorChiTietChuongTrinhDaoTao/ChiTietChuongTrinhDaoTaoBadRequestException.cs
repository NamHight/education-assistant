using System;

namespace Education_assistant.Exceptions.ThrowError.ThrowErrorChiTietChuongTrinhDaoTao;

public class ChiTietChuongTrinhDaoTaoBadRequestException : BadRequestException
{
    public ChiTietChuongTrinhDaoTaoBadRequestException(string message) : base(message)
    {
    }
}
