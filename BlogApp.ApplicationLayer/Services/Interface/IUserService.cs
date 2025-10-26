using BlogApp.ApplicationLayer.DTOs.Users;
using Microsoft.AspNetCore.Identity; // IdentityResult için bu using'i ekleyin

namespace BlogApp.ApplicationLayer.Services.Interface
{
    public interface IUserService
    {
        // Mevcut metotlar (Read)
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto?> GetUserByIdAsync(string id);
        Task<UserDto?> GetUserByUsernameAsync(string username);

        // YENİ EKLENEN METOTLAR (Create, Update, Delete)
        Task<IdentityResult> CreateUserAsync(CreateUserDto createUserDto);
        Task<IdentityResult> UpdateUserAsync(string userId, UpdateUserDto updateUserDto);
        Task<IdentityResult> DeleteUserAsync(string userId);
    }
}