using System;

namespace Education_assistant.Exceptions.ThrowError.MonHocExceptions;

public class MonHocNotFoundException : NotFoundException
{
    public MonHocNotFoundException(Guid id) : base($"Môn học với id: {id} không tìm thấy")
    {
    }
}
