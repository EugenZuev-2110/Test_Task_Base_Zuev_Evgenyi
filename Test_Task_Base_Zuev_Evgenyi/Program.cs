using Test_Task_Base_Zuev_Evgenyi.Data;
using Test_Task_Base_Zuev_Evgenyi.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<LibraryDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IBookService, BookService>();

builder.Services.AddControllers();
var app = builder.Build();

app.UseStaticFiles();
app.UseAuthorization();
app.MapControllers();

app.Run();