using BlogApp.ApplicationLayer.Services;
using BlogApp.ApplicationLayer.Services.Interface;
using Microsoft.Extensions.DependencyInjection;

namespace BlogApp.ApplicationLayer
{
    public static class ApplicationServiceRegistration
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // Servislerimizi Scoped olarak kaydediyoruz
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ITokenService, TokenService>();

            // İleride AutoMapper eklersek buraya ekleyeceğiz
            // services.AddAutoMapper(Assembly.GetExecutingAssembly());

            return services;
        }
    }
}