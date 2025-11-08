using BlogApp.EntityLayer.Entities;

namespace BlogApp.ApplicationLayer.Services.Interface
{
    public interface ITokenService
    {
        // Bu metot, bir kullanıcı nesnesi alıp
        // o kullanıcıya ait (rolleri de içeren) bir JWT ve token'ın bitiş süresini döndürür.
        Task<(string token, DateTime expiration)> CreateTokenAsync(AppUser user);
    }
}
