using System;

namespace Education_assistant.Exceptions.ThrowError.TuanExceptions;

public class TuanNotFoundException : NotFoundException
{
    public TuanNotFoundException(Guid id) : base($"Tuần với id: {id} không tìm thấy!.")
    {
    }
}
