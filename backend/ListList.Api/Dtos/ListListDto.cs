using ListList.Api.Entities;
using MongoDB.Bson;

namespace ListList.Api.Dtos;

public record class ListListDto(
    ObjectId Id,
    string Title,
    List<ListItem> Items,
    List<ListGroup> Groups,
    List<string> Properties
);