using System;

namespace Education_assistant.Services.BaseDtos;

public class ParamPaginationBaseDto
{
    public int page { get; set; } = 1;
    public int limit { get; set; } = 10;
}
