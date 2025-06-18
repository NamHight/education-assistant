using System;

namespace Education_assistant.Services.BaseDtos;

public class ParamBaseDto
{
    public int page { get; set; } = 1;
    public int limit { get; set; } = 10;
    public string search { get; set; } = string.Empty;
    public string sortBy { get; set; } = string.Empty;
    public string sortByOrder { get; set; } = string.Empty;
}
