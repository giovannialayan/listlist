using ListList.Api.Dtos;
using ListList.Api.Entities;

namespace ListList.Api.Mapping;

public static class ListGroupMapping
{
    public static ListGroup ToEntity(this CreateListGroupDto listGroup)
    {
        return new ListGroup()
        {
            Name = listGroup.Name,
            Parent = listGroup.Parent,
            Position = listGroup.Position,
            Settings = listGroup.Settings
        };
    }

    public static ListGroup ToEntity(this UpdateListGroupDto listGroup)
    {
        return new ListGroup()
        {
            Name = listGroup.Name,
            Position = listGroup.Position,
            Settings = listGroup.Settings
        };
    }
}
