using System;

namespace Education_assistant.Exceptions.ThrowError.TruongExceptions;

public sealed class TruongNotFoundException : NotFoundException
{
    public TruongNotFoundException(Guid id) : base($"Trường với {id} không tìm thấy!")
    {
    }
}
