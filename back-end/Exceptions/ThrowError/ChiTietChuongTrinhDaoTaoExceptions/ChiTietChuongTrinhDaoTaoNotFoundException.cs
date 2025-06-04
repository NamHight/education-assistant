using System;

namespace Education_assistant.Exceptions.ThrowError.ChiTietChuongTrinhDaoTaoExceptions;

public class ChiTietChuongTrinhDaoTaoNotFoundException : NotFoundException
{
    public ChiTietChuongTrinhDaoTaoNotFoundException(Guid id) : base($"Chi tiết chương trình đào tạo với id: {id} không tìm thấy.")
    {
    }
}
