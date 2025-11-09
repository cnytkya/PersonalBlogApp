using BlogApp.ApplicationLayer.DTOs.Auth;
using BlogApp.ApplicationLayer.Services.Interface;
using BlogApp.EntityLayer.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BlogApp.Api.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ITokenService _tokenService;

        public AuthController(
            UserManager<AppUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ITokenService tokenService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _tokenService = tokenService;
        }

        /// <summary>
        /// Yeni bir kullanıcı kaydı oluşturur.
        /// Varsayılan olarak "User" rolü atanır.
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            // 1. Yeni AppUser nesnesi oluştur
            var newUser = new AppUser
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                UserName = registerDto.UserName,
                EmailConfirmed = true // Geliştirme için e-postayı otomatik onaylıyoruz
            };

            // 2. Kullanıcıyı Identity veritabanına kaydet
            var result = await _userManager.CreateAsync(newUser, registerDto.Password);

            // 3. Kayıt Başarısızsa Hata Döndür
            if (!result.Succeeded)
            {
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "Kullanıcı kaydı başarısız.",
                    Errors = result.Errors
                });
            }

            // 4. Varsayılan "User" rolünü ata
            // (DataSeeder'da "User" rolünün oluşturulduğunu varsayıyoruz)
            if (await _roleManager.RoleExistsAsync("User"))
            {
                await _userManager.AddToRoleAsync(newUser, "User");
            }

            // 5. Başarılı kayıt sonrası otomatik Login yap (Token oluştur)
            // (Alternatif olarak sadece { IsSuccess = true } döndürüp
            // kullanıcıyı Login ekranına da yönlendirebilirsiniz)

            // Login işlemindeki adımların aynısını yapıyoruz:
            var roles = await _userManager.GetRolesAsync(newUser);
            var (tokenString, expiration) = await _tokenService.CreateTokenAsync(newUser);

            return Ok(new AuthResponseDto
            {
                IsSuccess = true,
                Message = "Kayıt başarılı.",
                Token = tokenString,
                TokenExpires = expiration,
                UserId = newUser.Id,
                Email = newUser.Email,
                FirstName = newUser.FirstName,
                Roles = roles.ToList()
            });
        }

        /// <summary>
        /// Kullanıcı girişi yapar ve başarılıysa bir JWT döndürür.
        /// Gelen 'UserName' alanını hem E-posta hem de Kullanıcı Adı olarak kontrol eder.
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            // 1. Kullanıcıyı bul
            AppUser? user = null;

            // Gelen veri bir e-posta formatında mı?
            if (loginDto.UserName.Contains("@"))
            {
                // E-posta ile ara
                user = await _userManager.FindByEmailAsync(loginDto.UserName);
            }
            else
            {
                // Kullanıcı adı ile ara
                user = await _userManager.FindByNameAsync(loginDto.UserName);
            }

            // 2. Kullanıcı yoksa veya şifre yanlışsa 401 Unauthorized döndür
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
            {
                return Unauthorized(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "Kullanıcı adı veya şifre geçersiz."
                });
            }

            // 3. Kullanıcı bulundu ve şifre doğru. Token oluştur.
            var roles = await _userManager.GetRolesAsync(user);
            var (tokenString, expiration) = await _tokenService.CreateTokenAsync(user);

            // 4. Başarılı AuthResponse (Token ve kullanıcı bilgileri) döndür
            return Ok(new AuthResponseDto
            {
                IsSuccess = true,
                Message = "Giriş başarılı.",
                Token = tokenString,
                TokenExpires = expiration,
                UserId = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                Roles = roles.ToList()
            });
        }
    }
}