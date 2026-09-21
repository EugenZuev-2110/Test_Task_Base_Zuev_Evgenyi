using Microsoft.AspNetCore.Mvc;
using Test_Task_Base_Zuev_Evgenyi.Models;
using Test_Task_Base_Zuev_Evgenyi.Services;

namespace Test_Task_Base_Zuev_Evgenyi.Controllers;

[ApiController]
[Route("api/books")]
public class BooksController : ControllerBase
{
    private readonly IBookService _bookService;
    public BooksController(IBookService bookService)
    {
        _bookService = bookService;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string? query)
    {
        var result = await _bookService.GetAllOrSearchAsync(query);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Book book)
    {
        await _bookService.CreateAsync(book);
        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Book book)
    {
        book.Id = id;
        await _bookService.UpdateAsync(book);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _bookService.DeleteAsync(id);
        return Ok();
    }
}