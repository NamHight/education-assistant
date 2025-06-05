using System;

namespace Education_assistant.Exceptions.ThrowError.LopHocExceptions;

public sealed class LopHocNotFoundException : NotFoundException
{
    public LopHocNotFoundException(Guid id) : base($"Lớp học với {id} không tìm thấy!")
    {
    }
}
