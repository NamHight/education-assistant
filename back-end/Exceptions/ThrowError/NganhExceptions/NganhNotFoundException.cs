using System;

namespace Education_assistant.Exceptions.ThrowError.NganhExceptions;

public class NganhNotFoundException : NotFoundException
{
    public NganhNotFoundException(Guid id) : base($"Ngành với id: {id} không tìm thấy")
    {
    }
}
