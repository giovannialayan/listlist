using System.ComponentModel.DataAnnotations;
using ListList.Api.Entities;

namespace ListList.Api.Dtos;

public record class CreateListItemDto(
    [Required] string Name,
    List<int> Groups,
    Dictionary<string, int> GroupPositions,
    List<ListItemProperty> Properties
);