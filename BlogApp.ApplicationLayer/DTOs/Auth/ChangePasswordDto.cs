using System.ComponentModel.DataAnnotations;

namespace BlogApp.ApplicationLayer.DTOs.Auth
{
    public class ChangePasswordDto
    {
        [Required]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; } = string.Empty;

        [Required]
        [Compare("NewPassword", ErrorMessage = "Yeni şifre ve onay şifresi eşleşmiyor.")]
        public string ConfirmNewPassword { get; set; } = string.Empty;
    }
}