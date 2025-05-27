using NLog;
using ILogger = NLog.ILogger;

namespace Education_assistant.Contracts.LoggerServices;

public class LoggerService : ILoggerService
{
    private static readonly ILogger _logger = LogManager.GetCurrentClassLogger();

    public void LogInfo(string message)
    {
        _logger.Info(message);
    }

    public void LogWarn(string message)
    {
        _logger.Warn(message);
    }

    public void LogDebug(string message)
    {
        _logger.Debug(message);
    }

    public void LogError(string message)
    {
        _logger.Error(message);
    }
}