using BlogApp.DataLayer.Persistence;
using BlogApp.EntityLayer.Entities;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace BlogApp.DataLayer.SeedData
{
    public static class DataSeeder
    {
        // IApplicationBuilder için bir extension metot yazıyoruz
        public static async Task SeedDataAsync(this IApplicationBuilder app)
        {
            // Servislere (DbContext, UserManager, RoleManager) erişmek için bir scope oluşturuyoruz
            using (var scope = app.ApplicationServices.CreateScope())
            {
                var services = scope.ServiceProvider;
                var context = services.GetRequiredService<AppDbContext>();
                var userManager = services.GetRequiredService<UserManager<AppUser>>();
                var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

                // 1. (ÖNEMLİ) Bekleyen migration'ları uygula. DB'nin oluştuğundan emin ol.
                await context.Database.MigrateAsync();

                // 2. ROLLERİ OLUŞTUR (Admin, User)
                if (!await roleManager.Roles.AnyAsync())
                {
                    await roleManager.CreateAsync(new IdentityRole("Admin"));
                    await roleManager.CreateAsync(new IdentityRole("User"));
                }

                // 3. KULLANICILARI OLUŞTUR (1 Admin, 1 User)
                if (!await userManager.Users.AnyAsync())
                {
                    // Admin Kullanıcı
                    var adminUser = new AppUser
                    {
                        UserName = "admin@blog.com",
                        Email = "admin@blog.com",
                        FirstName = "Admin",
                        LastName = "User",
                        EmailConfirmed = true // E-posta onayını atla
                    };
                    await userManager.CreateAsync(adminUser, "Password123!"); // Parola: Password123!
                    await userManager.AddToRoleAsync(adminUser, "Admin");

                    // Standart Kullanıcı
                    var standardUser = new AppUser
                    {
                        UserName = "user@blog.com",
                        Email = "user@blog.com",
                        FirstName = "Standard",
                        LastName = "User",
                        EmailConfirmed = true
                    };
                    await userManager.CreateAsync(standardUser, "Password123!"); // Parola: Password123!
                    await userManager.AddToRoleAsync(standardUser, "User");
                }

                // 4. KATEGORİLERİ OLUŞTUR (2 tane)
                if (!await context.Categories.AnyAsync())
                {
                    await context.Categories.AddRangeAsync(
                        new Category { Name = ".NET" },
                        new Category { Name = "Angular" }
                    );
                    await context.SaveChangesAsync();
                }

                // 5. BLOGLARI OLUŞTUR (2 tane)
                if (!await context.Blogs.AnyAsync())
                {
                    // Az önce eklediğimiz kategorilerin Id'lerini almamız gerek
                    var dotNetCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == ".NET");
                    var angularCategory = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Angular");

                    if (dotNetCategory != null && angularCategory != null)
                    {
                        await context.Blogs.AddRangeAsync(
                            new Blog
                            {
                                Title = "ASP.NET 9 Yenilikleri",
                                CategoryId = dotNetCategory.Id
                            },
                            new Blog
                            {
                                Title = "Angular 19 Standalone Components",
                                CategoryId = angularCategory.Id
                            }
                        );
                        await context.SaveChangesAsync();
                    }
                }
            }
        }
    }
}
