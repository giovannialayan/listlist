using ListList.Api.Dtos;
using ListList.Api.Entities;

namespace ListList.Api.Mapping;

public static class ListItemMapping
{
    public static ListItem ToEntity(this UpdateListItemDto listItem)
    {
        return new ListItem()
        {
            Name = listItem.Name,
            Groups = listItem.Groups,
            GroupPositions = listItem.GroupPositions,
            Properties = listItem.Properties.ToPropertyHashSet()
        };
    }

    public static ListItem ToEntity(this CreateListItemDto listItem)
    {
        return new ListItem()
        {
            Name = listItem.Name,
            Groups = listItem.Groups,
            GroupPositions = listItem.GroupPositions,
            Properties = listItem.Properties.ToPropertyHashSet()
        };
    }

    public static HashSet<ListItemProperty> ToPropertyHashSet(this Dictionary<string, string> propDict)
    {
        return new HashSet<ListItemProperty>(propDict.Select(
            prop =>
            {
                return new ListItemProperty() { Name = prop.Key, Value = prop.Value };
            }
        ));
    }

    public static Dictionary<string, string> ToPropertyDictionary(this HashSet<ListItemProperty> propHash)
    {
        return propHash.ToDictionary(prop => prop.Name, prop => prop.Value);
    }
}
