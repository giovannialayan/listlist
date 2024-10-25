using ListList.Api.Entities;

namespace ListList.Api.Dtos;

public record class ListListDto(
    uint Id,
    string Title,
    List<ListItem> Items,
    List<ListGroup> Groups,
    List<string> Properties
);