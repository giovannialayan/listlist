using ListList.Api.Entities;
using MongoDB.Bson;

namespace ListList.Api.Dtos;

public record class UpdateListGroupDto(
    Guid Id,
    string Name,
    int Position,
    ListGroupSettings Settings
);