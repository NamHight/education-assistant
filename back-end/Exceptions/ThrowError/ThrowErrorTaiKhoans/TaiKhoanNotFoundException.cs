using System;

namespace Education_assistant.Exceptions.ThrowError.ThrowErrorTaiKhoans;

public class TaiKhoanNotFoundException : NotFoundException
{
    public TaiKhoanNotFoundException(Guid id) : base($"Tài khoản với id: {id} không tìm thấy")
    {
    }
}
