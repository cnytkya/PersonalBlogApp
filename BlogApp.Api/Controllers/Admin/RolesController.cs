using BlogApp.ApplicationLayer.DTOs.Roles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // ToListAsync() için

namespace BlogApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // ÖNEMLİ: Bu controller'a sadece "Admin" rolündeki kullanıcılar erişebilir.
    [Authorize(Roles = "Admin")]
    public class RolesController : ControllerBase
    {
        private readonly RoleManager<IdentityRole> _roleManager;

        // Identity'nin Rol Yöneticisini enjekte ediyoruz
        public RolesController(RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
        }

        /// <summary>
        /// (GET) Tüm rolleri listeler.
        /// GET: api/Roles
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            // Tüm rolleri veritabanından listele
            var roles = await _roleManager.Roles.ToListAsync();
            return Ok(roles);
        }

        /// <summary>
        /// (GET) ID'ye göre tek bir rolü getirir.
        /// GET: api/Roles/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoleById(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
            {
                return NotFound("Rol bulunamadı.");
            }
            return Ok(role);
        }

        /// <summary>
        /// (POST) Yeni bir rol oluşturur.
        /// POST: api/Roles
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateRole([FromBody] CreateRoleDto createRoleDto)
        {
            // Bu isimde bir rol zaten var mı?
            if (await _roleManager.RoleExistsAsync(createRoleDto.Name))
            {
                return BadRequest("Bu rol adı zaten kullanımda.");
            }

            var newRole = new IdentityRole(createRoleDto.Name);
            var result = await _roleManager.CreateAsync(newRole);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Angular servisinin (Observable<Role>) beklediği gibi,
            // yeni oluşturulan tam rol nesnesini döndürüyoruz.
            return CreatedAtAction(nameof(GetRoleById), new { id = newRole.Id }, newRole);
        }

        /// <summary>
        /// (PUT) Mevcut bir rolü günceller.
        /// PUT: api/Roles/{id}
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(string id, [FromBody] RoleDto roleDto)
        {
            if (id != roleDto.Id)
            {
                return BadRequest("ID uyuşmazlığı.");
            }

            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
            {
                return NotFound("Rol bulunamadı.");
            }

            // GÜVENLİK ÖNLEMİ: Temel rolleri (Admin, User) koruma altına al
            if (role.Name == "Admin" || role.Name == "User")
            {
                return BadRequest($"'{role.Name}' rolü güncellenemez.");
            }

            // Güncellemeyi yap
            role.Name = roleDto.Name;
            // Normalleştirilmiş adı (BÜYÜK HARF) da güncellemek önemlidir
            role.NormalizedName = _roleManager.NormalizeKey(roleDto.Name);

            var result = await _roleManager.UpdateAsync(role);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return NoContent(); // Başarılı (Angular <void> bekliyor)
        }

        /// <summary>
        /// (DELETE) Bir rolü siler.
        /// DELETE: api/Roles/{id}
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
            {
                return NotFound("Rol bulunamadı.");
            }

            // GÜVENLİK ÖNLEMİ: Temel rolleri (Admin, User) silmeyi engelle
            if (role.Name == "Admin" || role.Name == "User")
            {
                return BadRequest($"'{role.Name}' rolü silinemez.");
            }

            var result = await _roleManager.DeleteAsync(role);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return NoContent(); // Başarılı (Angular <void> bekliyor)
        }
    }
}