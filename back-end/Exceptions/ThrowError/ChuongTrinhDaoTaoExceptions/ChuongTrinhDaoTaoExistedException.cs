using System;

namespace Education_assistant.Exceptions.ThrowError.ChuongTrinhDaoTaoExceptions;

public class ChuongTrinhDaoTaoExistedException : ExistedException
{
    public ChuongTrinhDaoTaoExistedException(string maChuongTrinh) : base($"Chương trình đào tạo với mã chương trình: {maChuongTrinh} đã tồn tại.")
    {
    }
}
