namespace Education_assistant.Exceptions.ThrowError.GiangVienExceptions;

public class GiangVienEmailNotFoundException : NotFoundException
{
    public GiangVienEmailNotFoundException(string email) : base($"Giảng viên với email: {email} không tìm thấy!.")
    {
    }
}