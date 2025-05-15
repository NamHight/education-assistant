namespace Education_assistant.helpers.implements;

public interface IPasswordHash
{
    public string Hash(string password);
    
    public bool Verify(string password, string passwordHash);
    
}