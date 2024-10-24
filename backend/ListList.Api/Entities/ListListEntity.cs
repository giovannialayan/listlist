namespace ListList.Api.Entities;

public class ListListEntity
{
    public uint Id { get; set; }

    public string Title { get; set; } = "new list";

    public List<ListItem> Items { get; set; } = new List<ListItem>();

    public List<ListGroup> Groups { get; set; } = new List<ListGroup>();

    public List<string> Properties { get; set; } = new List<string>();
}
