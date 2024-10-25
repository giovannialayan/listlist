using ListList.Api.Entities;

namespace ListList.Api.Dtos;

public record class CreateListGroupDto(
    string Name,
    int Parent,
    int Position,
    ListGroupSettings Settings
);