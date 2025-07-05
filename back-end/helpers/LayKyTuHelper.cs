using System;
using Education_assistant.helpers.implements;

namespace Education_assistant.helpers;

public class LayKyTuHelper : ILayKyTuHelper
{
    public string LayKyTuDau(string chuoi)
    {
        if (string.IsNullOrWhiteSpace(chuoi)) return "";

        var tu = chuoi.Split(" ", StringSplitOptions.RemoveEmptyEntries);
        return string.Concat(tu.Select(t => char.ToUpper(t[0])));
    }
}
