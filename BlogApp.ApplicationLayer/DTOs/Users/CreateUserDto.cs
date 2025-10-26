using System.ComponentModel.DataAnnotations;

namespace BlogApp.ApplicationLayer.DTOs.Users
{
    public class CreateUserDto
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string Password { get; set; } = string.Empty;

        // YENİ EKLENEN ALAN:
        // Bu alan nullable '?' olduğu için opsiyoneldir.
        // API'den bu alan gönderilmezse 'null' olacaktır.
        public string? RoleName { get; set; }
    }
}