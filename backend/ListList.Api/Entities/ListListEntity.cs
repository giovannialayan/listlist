using MongoDB.Bson;

namespace ListList.Api.Entities;

public class ListListEntity
{
    public ObjectId Id { get; set; }

    public string Title { get; set; } = "new list";

    public List<ListItem> Items { get; set; } = new List<ListItem>();

    public Dictionary<ObjectId, ListGroup> Groups { get; set; } = new Dictionary<ObjectId, ListGroup>();

    public List<string> Properties { get; set; } = new List<string>();
}
