using System.ComponentModel.DataAnnotations;
using ListList.Api.Entities;

namespace ListList.Api.Dtos;

public record class CreateListGroupDto(
    [Required] string Name,
    string Parent,
    int Position,
    ListGroupSettings Settings
);