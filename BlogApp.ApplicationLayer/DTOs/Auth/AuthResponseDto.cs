using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlogApp.ApplicationLayer.DTOs.Auth
{
    // Başarılı giriş veya kayıt sonrası Angular'a bu objeyi döneceğiz
    public class AuthResponseDto
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public DateTime? TokenExpires { get; set; }

        // Kullanıcının Angular tarafında kim olduğunu bilmesi için
        // temel bilgileri de gönderebiliriz.
        public string? UserId { get; set; }
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public List<string>? Roles { get; set; }
    }
}
