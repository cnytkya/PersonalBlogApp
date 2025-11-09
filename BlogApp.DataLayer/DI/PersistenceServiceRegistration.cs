using BlogApp.DataLayer.Persistence;
using BlogApp.EntityLayer.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
// YENİ using'ler
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace BlogApp.DataLayer.DI
{
    public static class PersistenceServiceRegistration
    {
        public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
        {
            // 1. AppDbContext (Değişiklik yok)
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(
                    configuration.GetConnectionString("sqlconnection")));


            // 2. Identity Servisleri (GÜNCELLENDİ)
            services.AddIdentity<AppUser, IdentityRole>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 6;
            })
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders()
            // YENİ: Identity'ye varsayılan şemaların (örn: cookie) yerine
            // bizim belirlediğimiz JWT şemasını kullanmasını söylüyoruz.
            .AddDefaultTokenProviders();

            // 3. JWT Authentication Servisi (YENİ EKLENDİ)
            services.AddAuthentication(options =>
            {
                // Kimlik doğrulama için varsayılan şema
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                // Yetki sorgulaması (Challenge) için varsayılan şema
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                // Diğer tüm durumlar için
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            // JWT Bearer şemasını yapılandır
            .AddJwtBearer(options =>
            {
                options.SaveToken = true; // Token'ı HttpContext'te sakla
                options.RequireHttpsMetadata = false; // (Development'ta false, Production'da true olmalı)

                // Token'ın nasıl doğrulanacağını belirtir
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true, // Yayıncıyı doğrula
                    ValidateAudience = true, // Hedef kitleyi doğrula

                    // appsettings'den değerleri al
                    ValidAudience = configuration["Jwt:Audience"],
                    ValidIssuer = configuration["Jwt:Issuer"],

                    // Token'ı imzalayan anahtarı doğrula
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!))
                };
            });

            return services;
        }
    }
}