using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleGiangVien.DTOs.Request
{
    public class RequestChangePasswordDto
    {

        [Required(ErrorMessage = "ID không được để trống")]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Mật khẩu cũ không được để trống")]
        public string OldPassword { get; set; } = string.Empty;


        [Required(ErrorMessage = "Mật khẩu mới không được để trống")]
        public string NewPassword { get; set; } = string.Empty;

    }
}
