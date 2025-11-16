using System.ComponentModel.DataAnnotations;

namespace BlogApp.ApplicationLayer.DTOs.Roles
{
    // Angular'daki CreateRoleDto'ya karşılık gelir
    public class CreateRoleDto
    {
        [Required]
        [MinLength(2)]
        public string Name { get; set; } = string.Empty;
    }

    // Angular'daki Role modeline karşılık gelir
    // (Güncelleme için kullanacağız)
    public class RoleDto
    {
        [Required]
        public string Id { get; set; } = string.Empty;

        [Required]
        [MinLength(2)]
        public string Name { get; set; } = string.Empty;
    }
}