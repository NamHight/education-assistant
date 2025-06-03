using System;

namespace Education_assistant.Services.BaseDtos;

public class ParamPageAndSearchBaseDto
{
    public int page { get; set; } = 1;
    public int limit { get; set; } = 10;
    public string search { get; set; } = string.Empty;
}
