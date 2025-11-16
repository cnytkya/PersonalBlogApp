using BlogApp.DataLayer.Persistence;
using BlogApp.EntityLayer.Entities;
using BlogApp.ApplicationLayer.DTOs.Blogs; // DTO'ları import et
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BlogApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // Bu controller'ın TÜM endpoint'leri SADECE Admin tarafından erişilebilir.
    [Authorize(Roles = "Admin")]
    public class BlogsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BlogsController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// (GET) Admin panelinde tüm blogları listeler.
        /// Kategori adlarını da içerecek şekilde DTO döner.
        /// </summary>
        // GET: api/Blogs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogDto>>> GetBlogs()
        {
            // Blogları alırken, Kategori (Category) verisini de 'Include' ediyoruz
            // ve DTO'ya (BlogDto) map'liyoruz (Select).
            var blogs = await _context.Blogs
                .Include(b => b.Category)
                .Select(b => new BlogDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    ImgUrl = b.ImgUrl,
                    CategoryId = b.CategoryId,
                    CategoryName = b.Category != null ? b.Category.Name : null
                })
                .ToListAsync();

            return Ok(blogs);
        }

        /// <summary>
        /// (GET) Admin panelinde ID'ye göre tek bir blogu getirir.
        /// Düzenleme (Edit) formu için bu endpoint kullanılacak.
        /// </summary>
        // GET: api/Blogs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BlogDto>> GetBlog(int id)
        {
            var blog = await _context.Blogs
                .Include(b => b.Category)
                .Select(b => new BlogDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    ImgUrl = b.ImgUrl,
                    CategoryId = b.CategoryId,
                    CategoryName = b.Category != null ? b.Category.Name : null
                })
                .FirstOrDefaultAsync(b => b.Id == id); // ID'ye göre bul

            if (blog == null)
            {
                return NotFound("Blog bulunamadı.");
            }

            return Ok(blog);
        }

        /// <summary>
        /// (PUT) Bir blogu günceller.
        /// </summary>
        // PUT: api/Blogs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBlog(int id, [FromBody] UpdateBlogDto updateDto)
        {
            if (id != updateDto.Id)
            {
                return BadRequest("ID uyuşmazlığı.");
            }

            // DTO'dan gelen veriyi entity'ye çeviriyoruz
            var blogEntity = await _context.Blogs.FindAsync(id);
            if (blogEntity == null)
            {
                return NotFound("Güncellenecek blog bulunamadı.");
            }

            // DTO'dan gelen verilerle (ImgUrl dahil) entity'yi güncelle
            blogEntity.Title = updateDto.Title;
            blogEntity.ImgUrl = updateDto.ImgUrl;
            blogEntity.CategoryId = updateDto.CategoryId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BlogExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); // Başarılı (204)
        }

        /// <summary>
        /// (POST) Yeni bir blog oluşturur.
        /// </summary>
        // POST: api/Blogs
        [HttpPost]
        public async Task<ActionResult<BlogDto>> PostBlog([FromBody] CreateBlogDto createDto)
        {
            // DTO'yu (CreateBlogDto) ana Entity'ye (Blog) map'liyoruz
            var blogEntity = new Blog
            {
                Title = createDto.Title,
                ImgUrl = createDto.ImgUrl,
                CategoryId = createDto.CategoryId
            };

            _context.Blogs.Add(blogEntity);
            await _context.SaveChangesAsync();

            // Oluşturulan kaynağı (BlogDto olarak) ve 201 Created döndür
            var newBlogDto = new BlogDto
            {
                Id = blogEntity.Id,
                Title = blogEntity.Title,
                ImgUrl = blogEntity.ImgUrl,
                CategoryId = blogEntity.CategoryId,
                CategoryName = (await _context.Categories.FindAsync(blogEntity.CategoryId))?.Name
            };

            return CreatedAtAction(nameof(GetBlog), new { id = newBlogDto.Id }, newBlogDto);
        }

        /// <summary>
        /// (DELETE) Bir blogu siler.
        /// </summary>
        // DELETE: api/Blogs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null)
            {
                return NotFound();
            }

            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BlogExists(int id)
        {
            return _context.Blogs.Any(e => e.Id == id);
        }
    }
}