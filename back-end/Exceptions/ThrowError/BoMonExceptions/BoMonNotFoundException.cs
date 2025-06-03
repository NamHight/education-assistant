using System;

namespace Education_assistant.Exceptions.ThrowError.BoMonExceptions;

public class BoMonNotFoundException : NotFoundException
{
    public BoMonNotFoundException(Guid id) : base($"Bộ môn với id: {id} không tìm thấy!")
    {
    }
}
