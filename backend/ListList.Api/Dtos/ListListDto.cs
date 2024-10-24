using ListList.Api.Entities;

namespace ListList.Api.Dtos;

public record class ListListDto(
    int Id,
    string Title,
    List<ListItem> Items,
    List<ListGroup> Groups,
    List<string> Properties
);