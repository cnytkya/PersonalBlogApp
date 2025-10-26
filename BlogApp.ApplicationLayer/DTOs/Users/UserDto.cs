using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlogApp.ApplicationLayer.DTOs.Users
{
    // Bu DTO, API'den dışarıya hangi kullanıcı bilgilerini
    // güvenle vereceğimizi tanımlar. Parola Hash'i vb. göndermeyiz.
    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        // Kullanıcının rollerini de DTO'da göstermek iyi bir fikirdir.
        public IList<string> Roles { get; set; } = new List<string>();
    }
}
