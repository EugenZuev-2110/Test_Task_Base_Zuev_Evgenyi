using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Test_Task_Base_Zuev_Evgenyi.Models;

[Table("Books")]
public class Book
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(250)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(250)]
    public string Author { get; set; } = string.Empty;

    [Required]
    public int PublishYear { get; set; }

    [Column(TypeName = "xml")]
    public string? TableOfContents { get; set; }

    [MaxLength(20)]
    public string? ISBN { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}