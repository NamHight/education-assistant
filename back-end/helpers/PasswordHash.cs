using System.Security.Cryptography;
using Education_assistant.helpers.implements;

namespace Education_assistant.helpers;

public sealed class PasswordHash : IPasswordHash
{
    private const int SaltSize = 16; // 128 bit
    private const int HashSize = 32; // 256 bit
    private const int Iteration = 100000;

    private readonly HashAlgorithmName _algorithm = HashAlgorithmName.SHA512;

    public string Hash(string password)
    {
        byte[] salt = RandomNumberGenerator.GetBytes(SaltSize);
        byte[] hash = Rfc2898DeriveBytes.Pbkdf2(password,salt,Iteration,_algorithm,HashSize);
        return $"{Convert.ToHexString(hash)}-{Convert.ToHexString(salt)}";
    }

    public bool Verify(string password, string passwordHash)
    {
        string[] parts = passwordHash.Split('-');
        byte[] salt = Convert.FromHexString(parts[1]);
        byte[] hash = Convert.FromHexString(parts[0]);
        byte[] inputHash = Rfc2898DeriveBytes.Pbkdf2(password,salt,Iteration,_algorithm,HashSize);
        return CryptographicOperations.FixedTimeEquals(hash, inputHash );
    }
}