using BlogApp.ApplicationLayer.DTOs.Users;
using BlogApp.ApplicationLayer.Services.Interface; // Kendi interface'inizi kullanın
using BlogApp.EntityLayer.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BlogApp.ApplicationLayer.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<AppUser> _userManager;
        // YENİ: Rolleri kontrol etmek için RoleManager'a ihtiyacımız var
        private readonly RoleManager<IdentityRole> _roleManager;

        // YENİ: Constructor'a RoleManager eklendi
        public UserService(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _userManager.Users.ToListAsync();
            var userDtos = new List<UserDto>();
            foreach (var user in users)
            {
                userDtos.Add(await MapUserToDto(user));
            }
            return userDtos;
        }

        public async Task<UserDto?> GetUserByIdAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return null;
            return await MapUserToDto(user);
        }

        public async Task<UserDto?> GetUserByUsernameAsync(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return null;
            return await MapUserToDto(user);
        }

        // CreateUserAsync
        public async Task<IdentityResult> CreateUserAsync(CreateUserDto createUserDto)
        {
            var newUser = new AppUser
            {
                FirstName = createUserDto.FirstName,
                LastName = createUserDto.LastName,
                Email = createUserDto.Email,
                UserName = createUserDto.UserName,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(newUser, createUserDto.Password);

            if (result.Succeeded)
            {
                // --- YENİ ROL ATAMA MANTIĞI ---
                string roleToAssign;

                // 1. DTO'dan bir rol geldi mi?
                if (string.IsNullOrWhiteSpace(createUserDto.RoleName))
                {
                    // Gelmediyse: Varsayılan "User" rolünü ata
                    roleToAssign = "User";
                }
                else
                {
                    // Geldiyse: Belirtilen rol veritabanında var mı?
                    if (await _roleManager.RoleExistsAsync(createUserDto.RoleName))
                    {
                        // Varsa: O rolü ata
                        roleToAssign = createUserDto.RoleName;
                    }
                    else
                    {
                        // Yoksa (örn: "Moderator" gibi geçersiz bir rol gönderildiyse):
                        // Güvenli varsayılan olan "User" rolünü ata
                        roleToAssign = "User";
                    }
                }

                // Belirlenen rolü kullanıcıya ata
                await _userManager.AddToRoleAsync(newUser, roleToAssign);
                // --- BİTTİ ---
            }

            return result;
        }

        // GÜNCELLENMEDİ (Aynı kaldı)
        public async Task<IdentityResult> UpdateUserAsync(string userId, UpdateUserDto updateUserDto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return IdentityResult.Failed(new IdentityError { Code = "UserNotFound", Description = "User not found." });
            }

            user.FirstName = updateUserDto.FirstName;
            user.LastName = updateUserDto.LastName;
            user.Email = updateUserDto.Email;

            return await _userManager.UpdateAsync(user);
        }

        // GÜNCELLENMEDİ (Aynı kaldı)
        public async Task<IdentityResult> DeleteUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return IdentityResult.Failed(new IdentityError { Code = "UserNotFound", Description = "User not found." });
            }
            return await _userManager.DeleteAsync(user);
        }

        // --- HELPER METOT (Değişiklik yok) ---
        private async Task<UserDto> MapUserToDto(AppUser user)
        {
            return new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName ?? "",
                Email = user.Email ?? "",
                Roles = await _userManager.GetRolesAsync(user)
            };
        }
    }
}