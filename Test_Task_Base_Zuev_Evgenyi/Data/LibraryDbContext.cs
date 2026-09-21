using Microsoft.EntityFrameworkCore;
using Test_Task_Base_Zuev_Evgenyi.Models;

namespace Test_Task_Base_Zuev_Evgenyi.Data;

public class LibraryDbContext : DbContext
{
    public LibraryDbContext(DbContextOptions<LibraryDbContext> options) : base(options)
    {
    }

    public DbSet<Book> Books => Set<Book>();
}