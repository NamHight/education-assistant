using System;

namespace Education_assistant.Exceptions.ThrowError.ThrowErrorTaiKhoans;

public class TaiKhoanExistedException : ExistedException
{
    public TaiKhoanExistedException(string email) : base($"Tài khoản với email: {email} đã tồn tại.")
    {
    }
}
