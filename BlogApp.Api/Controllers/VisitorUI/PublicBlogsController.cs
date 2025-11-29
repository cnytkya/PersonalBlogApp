using BlogApp.ApplicationLayer.DTOs.Blogs;
using BlogApp.DataLayer.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BlogApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class PublicBlogsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PublicBlogsController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// (GET) Ziyaretçiler için en son eklenen 5 blog yazısını getirir.
        /// </summary>
        // GET: api/PublicBlogs/recent
        [HttpGet("recent")]
        public async Task<ActionResult<IEnumerable<BlogDto>>> GetRecentBlogs()
        {
            var blogs = await _context.Blogs
                .Include(b => b.Category)
                .OrderByDescending(b => b.Id)
                .Take(5)
                .Select(b => new BlogDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content, // GÜNCELLENDİ
                    ImgUrl = b.ImgUrl,
                    CategoryId = b.CategoryId,
                    CategoryName = b.Category != null ? b.Category.Name : null
                })
                .ToListAsync();

            return Ok(blogs);
        }

        // --- YENİ EKLENEN METOT ---
        /// <summary>
        /// (GET) Ziyaretçiler için ID'ye göre tek bir blog yazısını getirir.
        /// (Blog Detay Sayfası için)
        /// </summary>
        // GET: api/PublicBlogs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BlogDto>> GetPublicBlogById(int id)
        {
            var blog = await _context.Blogs
                .Include(b => b.Category)
                .Select(b => new BlogDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content, // GÜNCELLENDİ
                    ImgUrl = b.ImgUrl,
                    CategoryId = b.CategoryId,
                    CategoryName = b.Category != null ? b.Category.Name : null
                })
                .FirstOrDefaultAsync(b => b.Id == id);

            if (blog == null)
            {
                return NotFound("Blog yazısı bulunamadı.");
            }

            return Ok(blog);
        }
    }
}