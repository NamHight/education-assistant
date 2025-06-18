using System;

namespace Education_assistant.Exceptions.ThrowError;

public class GenericNotFoundException : NotFoundException
{
    public GenericNotFoundException(string message) : base(message)
    {
    }
}
