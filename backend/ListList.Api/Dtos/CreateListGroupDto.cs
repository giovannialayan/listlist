using ListList.Api.Entities;

namespace ListList.Api.Dtos;

public record class CreateListGroupDto(
    string Name,
    string Parent,
    int Position,
    ListGroupSettings Settings
);