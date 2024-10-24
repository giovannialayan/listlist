using System.ComponentModel.DataAnnotations;

namespace ListList.Api.Dtos;

public record class CreateListItemDto(
    [Required] string Name,
    List<int> Groups,
    List<int> GroupPositions,
    Dictionary<string, string> Properties
);