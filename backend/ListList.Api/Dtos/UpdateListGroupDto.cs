using ListList.Api.Entities;

namespace ListList.Api.Dtos;

public record class UpdateListGroupDto(
    string Name,
    int Position,
    ListGroupSettings Settings
);