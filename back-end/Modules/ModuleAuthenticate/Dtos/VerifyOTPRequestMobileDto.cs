namespace Education_assistant.Modules.ModuleAuthenticate.Dtos
{
    public class VerifyOTPRequestMobileDto
    {
        public string Email { get; set; } = string.Empty;
        public string OtpCode { get; set; } = string.Empty;
    }
}
