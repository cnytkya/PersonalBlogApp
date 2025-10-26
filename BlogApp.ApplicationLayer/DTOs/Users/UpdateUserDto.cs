using System.ComponentModel.DataAnnotations;

namespace BlogApp.ApplicationLayer.DTOs.Users
{
    public class UpdateUserDto
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        // Not: Kullanıcı adı (UserName) veya Parola (Password) güncellemek
        // genellikle ayrı ve daha karmaşık (örn: token onayı) işlemlerdir.
        // Bu DTO'yu şimdilik temel bilgilerle sınırlı tutuyoruz.
    }
}