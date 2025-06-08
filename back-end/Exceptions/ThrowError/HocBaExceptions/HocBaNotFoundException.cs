using System;

namespace Education_assistant.Exceptions.ThrowError.HocBaExceptions;

public class HocBaNotFoundException : NotFoundException
{
    public HocBaNotFoundException(Guid id) : base($"Học bạ với id: {id} không tìm thấy!")
    {
    }
}
