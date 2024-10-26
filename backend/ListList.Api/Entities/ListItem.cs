using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ListList.Api.Entities;

[NotMapped]
[Keyless]
public class ListItem
{
    public required string Name { get; set; }

    public List<int> Groups { get; set; } = [];

    public List<int> GroupPositions { get; set; } = [];

    public ISet<ListItemProperty> Properties { get; set; } = new HashSet<ListItemProperty>();
}