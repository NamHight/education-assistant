namespace Education_assistant.Contracts.LoggerServices;

// Hiển thị phần giao diện cho các lớp khác
public interface ILoggerService
{
    void LogInfo(string message);
    void LogWarn(string message);
    void LogDebug(string message);
    void LogError(string message);
}