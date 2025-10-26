using BlogApp.DataLayer.Persistence;
using BlogApp.EntityLayer.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BlogApp.DataLayer.DI
{
    // Sınıfın static olması önemli
    public static class PersistenceServiceRegistration
    {
        // 'this IServiceCollection services' ifadesi, bu metodun bir extension metot olduğunu belirtir.
        public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
        {
            // 1. AppDbContext'i SQL Server'a bağlayın
            // Connection string'i "sqlconnection" adıyla appsettings.json'dan okuyacak
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("sqlconnection"));
            });

            // 2. ASP.NET Identity Servislerini Ekleyin
            // AppUser ve varsayılan rol (IdentityRole) sınıfımızı kullanarak Identity'yi yapılandırıyoruz.
            services.AddIdentity<AppUser, IdentityRole>(options =>
            {
                // Geliştirme ortamı için parola kurallarını basit tutabiliriz.
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 6;
            })
            // Identity'nin EF Core ve AppDbContext'i kullanacağını belirtiyoruz
            .AddEntityFrameworkStores<AppDbContext>()
            // Parola sıfırlama, e-posta onayı vb. için token provider'ları ekliyoruz
            .AddDefaultTokenProviders();
            // İleride Repository'leriniz olursa onları da burada ekleyebilirsiniz:
            // services.AddScoped<IBlogRepository, BlogRepository>();
            // services.AddScoped<ICategoryRepository, CategoryRepository>();

            return services; // Metot zincirlemesi (chaining) için IServiceCollection döndürülür
        }
    }
}
