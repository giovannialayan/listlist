namespace ListList.Api.Entities;

public class ListGroupSettings
{
    public bool Numbered { get; set; } = false;

    public bool AutoSort { get; set; } = false;

    public string SortByProperty { get; set; } = "";

    public bool SortAscending { get; set; } = true;

    public bool Collapse { get; set; } = false;
}