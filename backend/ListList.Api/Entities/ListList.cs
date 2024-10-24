namespace ListList.Api.Entities;

public class ListList
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public List<ListListItem> Items { get; set; } = new List<ListListItem>();


}
