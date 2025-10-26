using BlogApp.ApplicationLayer.DTOs.Users;
using BlogApp.ApplicationLayer.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlogApp.Api.Controllers
{
    /// <summary>
    /// Kullanıcı yönetimi (CRUD) işlemlerini gerçekleştiren API endpoint'lerini içerir.
    /// Bu controller'daki tüm işlemlere sadece "Admin" rolüne sahip kullanıcılar erişebilir.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] // <-- Bu satır, tüm endpoint'leri Admin rolüyle korur
    public class UsersController : ControllerBase
    {
        // Controller, somut UserService sınıfı yerine IUserService interface'ine bağımlıdır.
        private readonly IUserService _userService;

        /// <summary>
        /// UsersController için dependency injection ile IUserService'i enjekte eder.
        /// </summary>
        /// <param name="userService">Kullanıcı işlemlerini yürütecek servis.</param>
        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        #region --- READ (Okuma) Endpoint'leri ---

        /// <summary>
        /// Sistemdeki tüm kullanıcıları UserDto formatında listeler.
        /// </summary>
        /// <returns>UserDto listesi.</returns>
        // GET: api/Users
        [HttpGet]
        [AllowAnonymous]//kullanıcı admin olmasa yani yetkisi olmasa bile bütün kullanıcılara erişimi olsun.
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            // Ok (HTTP 200) ile birlikte kullanıcı listesini döndür
            return Ok(users);
        }

        /// <summary>
        /// Verilen ID'ye sahip tek bir kullanıcıyı getirir.
        /// </summary>
        /// <param name="id">Aranan kullanıcının ID'si (GUID/string).</param>
        /// <returns>UserDto veya bulunamazsa 404 Not Found.</returns>
        // GET: api/Users/id/{id}
        [HttpGet("id/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userService.GetUserByIdAsync(id);

            if (user == null)
            {
                // Kullanıcı bulunamazsa 404 Not Found döndür
                return NotFound($"User with ID '{id}' not found.");
            }

            return Ok(user);
        }

        /// <summary>
        /// Verilen kullanıcı adına (UserName) sahip tek bir kullanıcıyı getirir.
        /// </summary>
        /// <param name="username">Aranan kullanıcının kullanıcı adı.</param>
        /// <returns>UserDto veya bulunamazsa 404 Not Found.</returns>
        // GET: api/Users/by-username/{username}
        [HttpGet("by-username/{username}")]
        public async Task<IActionResult> GetUserByUsername(string username)
        {
            var user = await _userService.GetUserByUsernameAsync(username);

            if (user == null)
            {
                return NotFound($"User with username '{username}' not found.");
            }

            return Ok(user);
        }

        #endregion

        #region --- CREATE (Oluşturma) Endpoint'i ---

        /// <summary>
        /// CreateUserDto kullanarak yeni bir kullanıcı oluşturur.
        /// DTO içinde RoleName belirtilmezse, kullanıcı varsayılan olarak "User" rolüyle oluşturulur.
        /// </summary>
        /// <param name="createUserDto">Yeni kullanıcı için gerekli verileri (FirstName, LastName, Email, UserName, Password, opsiyonel RoleName) içeren DTO.</param>
        /// <returns>Başarılıysa 201 Created ve yeni kullanıcı DTO'su, başarısızsa 400 Bad Request.</returns>
        // POST: api/Users
        [HttpPost]
        public async Task<IActionResult> CreateUser(CreateUserDto createUserDto)
        {
            var result = await _userService.CreateUserAsync(createUserDto);

            if (!result.Succeeded)
            {
                // Identity'den dönen hataları (örn: "Parola çok kısa", "Bu e-posta zaten kullanımda")
                // 400 Bad Request olarak API istemcisine bildirir.
                return BadRequest(result.Errors);
            }

            // Kullanıcı başarıyla oluşturuldu.
            // REST standardı gereği, oluşturulan kaynağın (yeni kullanıcı) bilgilerini
            // ve kaynağa erişilebilecek URL'yi (Location header) döndürmeliyiz.

            // Yeni oluşturulan kullanıcıyı DTO olarak tekrar servisten alıyoruz.
            var newUser = await _userService.GetUserByUsernameAsync(createUserDto.UserName);

            // 201 Created cevabı döndürüyoruz.
            // GetUserById endpoint'ini çağırarak (CreatedAtAction) Location header'ını set ediyoruz.
            return CreatedAtAction(nameof(GetUserById), new { id = newUser?.Id }, newUser);
        }

        #endregion

        #region --- UPDATE (Güncelleme) Endpoint'i ---

        /// <summary>
        /// Mevcut bir kullanıcının bilgilerini günceller.
        /// </summary>
        /// <param name="id">Güncellenecek kullanıcının ID'si.</param>
        /// <param name="updateUserDto">Yeni FirstName, LastName, Email bilgilerini içeren DTO.</param>
        /// <returns>Başarılıysa 204 No Content, başarısızsa 400 Bad Request.</returns>
        // PUT: api/Users/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, UpdateUserDto updateUserDto)
        {
            var result = await _userService.UpdateUserAsync(id, updateUserDto);

            if (!result.Succeeded)
            {
                // Hata varsa (örn: "User not found") 400 Bad Request döndür
                return BadRequest(result.Errors);
            }

            // Başarılı PUT operasyonları için standart cevap 204 No Content'tir.
            // (İçerik döndürmeye gerek yok)
            return NoContent();
        }

        #endregion

        #region --- DELETE (Silme) Endpoint'i ---

        /// <summary>
        /// Verilen ID'ye sahip kullanıcıyı sistemden siler.
        /// </summary>
        /// <param name="id">Silinecek kullanıcının ID'si.</param>
        /// <returns>Başarılıysa 204 No Content, başarısızsa 400 Bad Request.</returns>
        // DELETE: api/Users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var result = await _userService.DeleteUserAsync(id);

            if (!result.Succeeded)
            {
                // Hata varsa (örn: "User not found") 400 Bad Request döndür
                return BadRequest(result.Errors);
            }

            // Başarılı DELETE operasyonları için standart cevap 204 No Content'tir.
            return NoContent();
        }

        #endregion
    }
}