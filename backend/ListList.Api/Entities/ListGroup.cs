using MongoDB.Bson;

namespace ListList.Api.Entities;

public class ListGroup
{
    public ObjectId Id { get; set; }

    public required string Name { get; set; }

    public List<string> SubGroups { get; set; } = [];

    public int Size { get; set; } = 0;

    public string Parent { get; set; } = "";

    public int Position { get; set; }

    public ListGroupSettings Settings { get; set; } = new ListGroupSettings();
}