namespace Education_assistant.Modules.ModuleAuthenticate.Dtos
{
    public class ResetPasswordOTPRequestMobileDto
    {
        public string Email { get; set; } = string.Empty;
        public string OtpCode { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
