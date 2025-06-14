namespace Education_assistant.Exceptions.ThrowError.TaiKhoanExceptions;

public class TaiKhoanEmailNotFoundException : NotFoundException
{
    public TaiKhoanEmailNotFoundException(string email) : base($"Tài khoản với email: {email} không tìm thấy")
    {
    }
}