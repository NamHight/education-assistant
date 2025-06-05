using System;

namespace Education_assistant.Services;

public class Service
{
    public static async Task<string> UpLoadFile(IFormFile file, string value)
    {
        var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(uploadFolder))
        {
            Directory.CreateDirectory(uploadFolder);
        }
        var guidPart = Guid.NewGuid().ToString().Split('-')[0];
        var fileName = $"{value}_{guidPart}_{DateTime.Now:HHmmss_ddMMyyyy}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(uploadFolder, fileName);
        await using var stream = new FileStream(filePath, FileMode.Create);

        await file.CopyToAsync(stream);
        return fileName;
    }
    
}
