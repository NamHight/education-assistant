using System;

namespace Education_assistant.Exceptions.ThrowError.LopHocPhanExceptions;

public class LopHocPhanNotFoundException : NotFoundException
{
    public LopHocPhanNotFoundException(Guid id) : base($"Lớp học phần với id: {id} không tìm thấy.")
    {
    }
}
