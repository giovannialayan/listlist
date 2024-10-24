using ListList.Api.Dtos;
using ListList.Api.Entities;

namespace ListList.Api.Mapping;

public static class ListMapping
{
    public static ListListDto ToListListDto(this ListListEntity list)
    {
        return new ListListDto(
            list.Id,
            list.Title,
            list.Items,
            list.Groups,
            list.Properties
        );
    }
}
