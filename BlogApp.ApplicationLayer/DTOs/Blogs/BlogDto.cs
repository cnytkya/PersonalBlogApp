using System.ComponentModel.DataAnnotations;

namespace BlogApp.ApplicationLayer.DTOs.Blogs
{
    /**
     * Ziyaretçilere (GET) döndürülecek DTO.
     */
    public class BlogDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;

        // Content (İçerik) alanı eklendi
        public string Content { get; set; } = string.Empty;

        public string? ImgUrl { get; set; }
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; }
    }

    /**
     * Yeni bir blog oluşturmak (POST) için kullanılacak DTO.
     */
    public class CreateBlogDto
    {
        [Required]
        [MinLength(5)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MinLength(50)] // İçerik için bir minimum uzunluk belirleyelim
        public string Content { get; set; } = string.Empty;

        public string? ImgUrl { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }

    /**
     * Mevcut bir blogu güncellemek (PUT) için kullanılacak DTO.
     */
    public class UpdateBlogDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [MinLength(5)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MinLength(50)]
        public string Content { get; set; } = string.Empty;

        public string? ImgUrl { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }
}