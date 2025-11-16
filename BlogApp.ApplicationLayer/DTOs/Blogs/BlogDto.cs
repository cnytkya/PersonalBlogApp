using System.ComponentModel.DataAnnotations;

namespace BlogApp.ApplicationLayer.DTOs.Blogs
{
    /**
     * Ziyaretçilere (GET) döndürülecek DTO.
     * Güvenli alanları ve Kategori Adı gibi ekstra bilgileri içerir.
     */
    public class BlogDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? ImgUrl { get; set; }
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; } // Kategori adını göndermek için
    }

    /**
     * Yeni bir blog oluşturmak (POST) için kullanılacak DTO.
     */
    public class CreateBlogDto
    {
        [Required]
        [MinLength(5)]
        public string Title { get; set; } = string.Empty;

        public string? ImgUrl { get; set; } // Resim URL'si opsiyonel

        [Required]
        public int CategoryId { get; set; }
    }

    /**
     * Mevcut bir blogu güncellemek (PUT) için kullanılacak DTO.
     */
    public class UpdateBlogDto
    {
        [Required]
        public int Id { get; set; } // Hangi blogun güncelleneceğini bilmek için

        [Required]
        [MinLength(5)]
        public string Title { get; set; } = string.Empty;

        public string? ImgUrl { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }
}