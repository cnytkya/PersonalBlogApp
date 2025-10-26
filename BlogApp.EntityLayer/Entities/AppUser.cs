using Microsoft.AspNetCore.Identity;

namespace BlogApp.EntityLayer.Entities
{
    // IdentityUser'dan miras alarak Identity özelliklerini kazanıyoruz.
    public class AppUser : IdentityUser
    {
        // Buraya standart Identity alanları dışında
        // eklemek istediğiniz özellikleri yazabilirsiniz.
        // Örneğin:
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;

        // Gelecekte buraya profil fotoğrafı URL'si, doğum tarihi vb. eklenebilir.
    }
}
