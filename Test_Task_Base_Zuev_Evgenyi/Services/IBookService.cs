using Test_Task_Base_Zuev_Evgenyi.Models;

namespace Test_Task_Base_Zuev_Evgenyi.Services;

public interface IBookService
{
    Task<IEnumerable<Book>> GetAllOrSearchAsync(string? searchQuery);
    Task<Book?> GetByIdAsync(int id);
    Task CreateAsync(Book book);
    Task UpdateAsync(Book book);
    Task DeleteAsync(int id);
}