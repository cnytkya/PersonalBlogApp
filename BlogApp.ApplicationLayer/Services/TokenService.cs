using BlogApp.ApplicationLayer.Services.Interface;
using BlogApp.EntityLayer.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BlogApp.ApplicationLayer.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<AppUser> _userManager;

        // appsettings.json'dan (Key, Issuer, Audience) ve
        // kullanıcının rollerini almak için UserManager'dan yararlanacağız
        public TokenService(IConfiguration configuration, UserManager<AppUser> userManager)
        {
            _configuration = configuration;
            _userManager = userManager;
        }

        public async Task<(string token, DateTime expiration)> CreateTokenAsync(AppUser user)
        {
            // 1. Kullanıcının rollerini al
            var userRoles = await _userManager.GetRolesAsync(user);

            // 2. Token'ın içine gömeceğimiz Claim'leri (iddiaları) hazırla
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id), // Subject (Kullanıcı ID'si)
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Token ID
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
                new Claim(JwtRegisteredClaimNames.Name, user.UserName ?? ""),
                // Özel claim'ler
                new Claim("firstName", user.FirstName), // Angular'da "Hoşgeldin Admin" demek için
                new Claim("lastName", user.LastName)
            };

            // 3. ROLLERİ Ekle (En önemli kısım)
            // [Authorize(Roles = "Admin")] bu claim'leri okur
            foreach (var role in userRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            // 4. appsettings.json'dan gizli anahtarı (Key) al
            var secretKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
            );

            // 5. Anahtarı kullanarak imzalama kimlik bilgisi (signing credentials) oluştur
            var creds = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            // 6. Token'ın bitiş süresini ayarla (Örn: 7 gün)
            var expiration = DateTime.UtcNow.AddDays(7);

            // 7. Token'ı oluştur (Issuer, Audience, Claims, Expires, SigningCredentials)
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: expiration,
                signingCredentials: creds
            );

            // 8. Token'ı string formata dönüştür
            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return (tokenString, expiration);
        }
    }
}