using System;

namespace Education_assistant.Modules.ModuleEmail.DTOs.Response;

public class ResponseEmailDto
{
    public string Recipient { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public List<KeyValuePair<string, string>>? Attachments { get; set; }
}
