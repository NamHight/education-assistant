namespace Education_assistant.Exceptions.ThrowError;

public sealed class GiangVienNotFoundException : NotFoundException
{
    public GiangVienNotFoundException(Guid id) : base($"Giảng viên với {id} không tìm thấy!!")
    {
    }
}