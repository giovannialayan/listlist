using System.ComponentModel.DataAnnotations;
using ListList.Api.Entities;

namespace ListList.Api.Dtos;

public record class UpdateListGroupDto(
    [Required] Guid Id,
    string Name,
    int Position,
    ListGroupSettings Settings
);