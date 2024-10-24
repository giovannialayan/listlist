namespace ListList.Api.Entities;

public class ListItem
{
    public required string Name { get; set; }

    public List<int> Groups { get; set; } = [];

    public List<int> GroupPositions { get; set; } = [];

    public Dictionary<string, string> Properties { get; set; } = new Dictionary<string, string>();
}