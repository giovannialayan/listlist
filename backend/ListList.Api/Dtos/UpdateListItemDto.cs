using System.ComponentModel.DataAnnotations;
using ListList.Api.Entities;

namespace ListList.Api.Dtos;

public record class UpdateListItemDto(
    [Required] string Name,
    List<string> Groups,
    Dictionary<string, int> GroupPositions,
    List<ListItemProperty> Properties
);