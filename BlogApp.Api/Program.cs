using BlogApp.ApplicationLayer;
using BlogApp.DataLayer.DI;
using BlogApp.DataLayer.SeedData;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi


//builder.Services.AddDbContext<AppDbContext>(options =>
//{
//    options.UseSqlServer(builder.Configuration.GetConnectionString("sqlconnection"));
//});bunu extend metot ile geniþlettik. artýk bunu PersistenceServiceRegistration class'ýndan çaðýracaðýz.

builder.Services.AddPersistenceServices(builder.Configuration);
builder.Services.AddApplicationServices();


builder.Services.AddSwaggerGen();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
// Uygulama ayaða kalkarken veritabanýný seed data ile doldur
try
{
    await DataSeeder.SeedDataAsync(app);
}
catch (Exception e)
{
    // Hata olursa logla (Gerçek bir projede ILogger kullanýn)
    Console.WriteLine("An error occurred during data seeding.");
    Console.WriteLine(e.Message);
}
app.Run();
