using Microsoft.EntityFrameworkCore;
using Test_Task_Base_Zuev_Evgenyi.Data;
using Test_Task_Base_Zuev_Evgenyi.Models;

namespace Test_Task_Base_Zuev_Evgenyi.Services
{
    public class BookService : IBookService
    {
        private readonly LibraryDbContext _context;

        public BookService(LibraryDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Book>> GetAllOrSearchAsync(string? searchQuery)
        {
            if (string.IsNullOrWhiteSpace(searchQuery))
            {
                return await _context.Books.ToListAsync();
            }

            searchQuery = searchQuery.Trim();

            // Формируем шаблон для SQL-оператора LIKE: %искомая_строка%
            string likePattern = $"%{searchQuery}%";

            // Поиск по названию, автору или внутри XML-контента оглавления
            return await _context.Books
                .Where(b => b.Title.Contains(searchQuery)
                         || b.Author.Contains(searchQuery)
                         || ((string)(object)b.TableOfContents!).Contains(searchQuery))
                .ToListAsync();
        }

        public async Task<Book?> GetByIdAsync(int id)
        {
            return await _context.Books.FindAsync(id);
        }

        public async Task CreateAsync(Book book)
        {
            book.CreatedAt = DateTime.UtcNow;
            _context.Books.Add(book);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Book updatedBook)
        {
            var existingBook = await _context.Books.FindAsync(updatedBook.Id);
            if (existingBook == null) throw new KeyNotFoundException("Книга не найдена");

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.PublishYear = updatedBook.PublishYear;
            existingBook.TableOfContents = updatedBook.TableOfContents;
            existingBook.ISBN = updatedBook.ISBN;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book != null)
            {
                _context.Books.Remove(book);
                await _context.SaveChangesAsync();
            }
        }
    }
}
