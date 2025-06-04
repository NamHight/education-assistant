using System;

namespace Education_assistant.Exceptions.ThrowError.SinhVienExceptions;

public class SinhVienNotFoundException : NotFoundException
{
    public SinhVienNotFoundException(Guid id) : base($"Sinh viên với id: {id} không tìm thấy.")
    {
    }
}
