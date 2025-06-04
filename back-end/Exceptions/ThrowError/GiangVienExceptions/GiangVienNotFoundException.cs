using System;

namespace Education_assistant.Exceptions.ThrowError.GiangVienExceptions;

public class GiangVienNotFoundException : NotFoundException
{
    public GiangVienNotFoundException(Guid id) : base($"Giảng viên với id: {id} không tìm thấy!.")
    {
    }
}
