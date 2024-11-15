namespace ListList.Api.Entities;

public class ListItem
{
    public required string Name { get; set; }

    public List<string> Groups { get; set; } = [];

    public Dictionary<string, int> GroupPositions { get; set; } = new Dictionary<string, int>();

    public List<ListItemProperty> Properties { get; set; } = [];
}