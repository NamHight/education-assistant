using System;

namespace Education_assistant.Exceptions.ThrowError.ChuongTrinhDaoTaoExceptions;

public class ChuongTrinhDaoTaoNotFoundException : NotFoundException
{
    public ChuongTrinhDaoTaoNotFoundException(Guid id) : base($"Chương trình đào tạo với id: {id} không tìm thấy!.")
    {
    }
}
