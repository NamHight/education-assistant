using System;

namespace Education_assistant.Exceptions.ThrowError.LichBieuExceptions;

public sealed class LichBieuNotFoundException : NotFoundException
{
    public LichBieuNotFoundException(Guid id) : base($"Lịch biểu với {id} không tìm thấy!")
    {
    }
}
