using ListList.Api.Dtos;
using ListList.Api.Entities;

namespace ListList.Api.Mapping;

public static class ListItemMapping
{
    public static ListItem ToEntity(this UpdateListItemDto listItem, int id)
    {
        return new ListItem()
        {
            Name = listItem.Name,
            Groups = listItem.Groups,
            GroupPositions = listItem.GroupPositions,
            Properties = listItem.Properties
        };
    }

    public static ListItem ToEntity(this CreateListItemDto listItem)
    {
        return new ListItem()
        {
            Name = listItem.Name,
            Groups = listItem.Groups,
            GroupPositions = listItem.GroupPositions,
            Properties = listItem.Properties
        };
    }
}
