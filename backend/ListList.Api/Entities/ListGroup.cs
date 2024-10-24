namespace ListList.Api.Entities;

public class ListGroup
{
    public required string Name { get; set; }

    public List<int> SubGroups { get; set; } = [];

    public int Size { get; set; } = 0;

    public int Parent { get; set; } = -1;

    public int Position { get; set; }

    public ListGroupSettings Settings { get; set; } = new ListGroupSettings();
}