using BlogApp.DataLayer.Persistence;
using BlogApp.EntityLayer.Entities;
using BlogApp.ApplicationLayer.DTOs.Blogs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BlogApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class BlogsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BlogsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Blogs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogDto>>> GetBlogs()
        {
            var blogs = await _context.Blogs
                .Include(b => b.Category)
                .Select(b => new BlogDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    // Content (içerik) eklendi
                    Content = b.Content,
                    ImgUrl = b.ImgUrl,
                    CategoryId = b.CategoryId,
                    CategoryName = b.Category != null ? b.Category.Name : null
                })
                .ToListAsync();

            return Ok(blogs);
        }

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
                    // Content (içerik) eklendi
                    Content = b.Content,
                    ImgUrl = b.ImgUrl,
                    CategoryId = b.CategoryId,
                    CategoryName = b.Category != null ? b.Category.Name : null
                })
                .FirstOrDefaultAsync(b => b.Id == id);

            if (blog == null)
            {
                return NotFound("Blog bulunamadı.");
            }

            return Ok(blog);
        }

        // PUT: api/Blogs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBlog(int id, [FromBody] UpdateBlogDto updateDto)
        {
            if (id != updateDto.Id)
            {
                return BadRequest("ID uyuşmazlığı.");
            }

            var blogEntity = await _context.Blogs.FindAsync(id);
            if (blogEntity == null)
            {
                return NotFound("Güncellenecek blog bulunamadı.");
            }

            // DTO'dan gelen verilerle (Content dahil) entity'yi güncelle
            blogEntity.Title = updateDto.Title;
            blogEntity.Content = updateDto.Content; 
            blogEntity.ImgUrl = updateDto.ImgUrl;
            blogEntity.CategoryId = updateDto.CategoryId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BlogExists(id)) { return NotFound(); } else { throw; }
            }

            return NoContent();
        }

        // POST: api/Blogs
        [HttpPost]
        public async Task<ActionResult<BlogDto>> PostBlog([FromBody] CreateBlogDto createDto)
        {
            var blogEntity = new Blog
            {
                Title = createDto.Title,
                Content = createDto.Content, 
                ImgUrl = createDto.ImgUrl,
                CategoryId = createDto.CategoryId
            };

            _context.Blogs.Add(blogEntity);
            await _context.SaveChangesAsync();

            var newBlogDto = new BlogDto
            {
                Id = blogEntity.Id,
                Title = blogEntity.Title,
                Content = blogEntity.Content,
                ImgUrl = blogEntity.ImgUrl,
                CategoryId = blogEntity.CategoryId,
                CategoryName = (await _context.Categories.FindAsync(blogEntity.CategoryId))?.Name
            };

            return CreatedAtAction(nameof(GetBlog), new { id = newBlogDto.Id }, newBlogDto);
        }

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