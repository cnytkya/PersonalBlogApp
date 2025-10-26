using BlogApp.DataLayer.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
            return services;
        }
    }
}
