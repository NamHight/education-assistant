using System;

namespace Education_assistant.Exceptions.ThrowError.ThrowErrorChiTietChuongTrinhDaoTao;

public class ChiTietChuongTrinhDaoTaoNotFoundException : NotFoundException
{
    public ChiTietChuongTrinhDaoTaoNotFoundException(Guid id) : base($"Chi tiết chương trình đào tạo với id: {id} không tìm thấy.")
    {
    }
}
