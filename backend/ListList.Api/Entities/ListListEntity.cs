using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ListList.Api.Entities;

public class ListListEntity
{
    public ObjectId _id { get; set; }

    public string Title { get; set; } = "new list";

    public List<ListItem> Items { get; set; } = new List<ListItem>();

    public Dictionary<string, ListGroup> Groups { get; set; } = new Dictionary<string, ListGroup>();

    public List<string> Properties { get; set; } = new List<string>();
}
