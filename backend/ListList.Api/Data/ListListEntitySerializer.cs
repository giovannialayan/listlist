using ListList.Api.Entities;
using MongoDB.Bson.Serialization;

namespace ListList.Api.Data;

public static class ListListEntitySerializer
{
    public static void RegisterBsonClassMap()
    {
        BsonClassMap.RegisterClassMap<ListListEntity>(classMap =>
        {
            classMap.MapMember(list => list._id);
            classMap.MapMember(list => list.Title);
            classMap.MapMember(list => list.Items);
            classMap.MapMember(list => list.Groups);
            classMap.MapMember(list => list.Properties);
        });
    }
}