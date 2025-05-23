﻿using System.Text.Json;

namespace Education_assistant.Models.Error;

public class Error
{
    public int StatusCode { get; set; }
    public string? Message { get; set; }

    public override string ToString()
    {
        return JsonSerializer.Serialize(this);
    }
}