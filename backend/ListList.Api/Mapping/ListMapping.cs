using ListList.Api.Dtos;
using ListList.Api.Entities;
using MongoDB.Bson;

namespace ListList.Api.Mapping;

public static class ListMapping
{
    public static ListListDto ToDto(this ListListEntity list)
    {
        return new ListListDto(
            list.Id,
            list.Title,
            list.Items,
            list.Groups,
            list.Properties
        );
    }

    public static ListListEntity ToEntity(this ListListDto listDto)
    {
        return new ListListEntity()
        {
            Id = listDto.Id,
            Title = listDto.Title,
            Items = listDto.Items,
            Groups = listDto.Groups,
            Properties = listDto.Properties
        };
    }

    public static ListListEntity ToEntity(this UpdateListDto listDto, ListListEntity listEntity)
    {
        return new ListListEntity()
        {
            Id = listEntity.Id,
            Title = listDto.Title,
            Items = listEntity.Items,
            Groups = listEntity.Groups,
            Properties = listDto.Properties
        };
    }
}
