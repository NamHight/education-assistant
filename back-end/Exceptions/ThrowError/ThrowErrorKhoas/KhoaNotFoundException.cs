using System;

namespace Education_assistant.Exceptions.ThrowError.ThrowErrorKhoas;

public class KhoaNotFoundException : NotFoundException
{
    public KhoaNotFoundException(Guid id) : base($"Khoa với id: {id} không tim thấy!")
    {
    }
}
