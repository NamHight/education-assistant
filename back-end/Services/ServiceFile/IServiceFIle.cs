namespace Education_assistant.Services.ServiceFile;

public interface IServiceFIle
{
    Task<string> UpLoadFile(IFormFile file, string value);
}