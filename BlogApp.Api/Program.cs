using BlogApp.ApplicationLayer;
using BlogApp.DataLayer.DI;
using BlogApp.DataLayer.SeedData;
// 1. ADIM: CORS Politika adý için bir deðiþken tanýmlayalým
var angularAppPolicy = "AngularAppPolicy";
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

// Angular uygulamasýndan (örn: localhost:4200) gelen isteklere
// izin verecek CORS politikasýný burada tanýmlýyoruz.
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: angularAppPolicy,
                      policy =>
                      {
                          // Angular uygulamanýzýn çalýþtýðý adres(ler)
                          policy.WithOrigins("http://localhost:4200",
                                             "http://localhost:4201") // (Angular bazen portu deðiþtirirse diye)

                                // Tüm Header'lara (Content-Type, Authorization) izin ver
                                .AllowAnyHeader()

                                // Tüm Metotlara (GET, POST, PUT, DELETE, OPTIONS) izin ver
                                .AllowAnyMethod();
                      });
});

builder.Services.AddSwaggerGen();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 1. CORS: Önce Angular'ýn isteðine izin verilir.
app.UseCors(angularAppPolicy);

// 2. AUTHENTICATION: Sonra gelen isteðin token'ý (kimliði) doðrulanýr.
// BU SATIR DA EKSÝKTÝ VE JWT ÝÇÝN KRÝTÝKTÝR.
app.UseAuthentication();

// 3. AUTHORIZATION: Kimliði doðrulanan kullanýcýnýn rolü (yetkisi) kontrol edilir.
// (Bu satýr sizde vardý, yeri burasý olmalý)
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
