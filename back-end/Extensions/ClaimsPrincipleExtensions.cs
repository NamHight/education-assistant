using System;
using System.Security.Claims;

namespace Education_assistant.Extensions;

public static class ClaimsPrincipleExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        return Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("Cannot get userid."));
    }
    public static string GetUserEmail(this ClaimsPrincipal user)
    {
        return user.FindFirstValue(ClaimTypes.Email) ?? throw new Exception("Cannot get email.");
    }
}
