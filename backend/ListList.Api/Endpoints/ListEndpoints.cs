using ListList.Api.Data;
using ListList.Api.Dtos;
using ListList.Api.Entities;
using ListList.Api.Mapping;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;
using MongoDB.Driver;

namespace ListList.Api.Endpoints;

public static class ListEndpoints
{
    const string GetListEndpointName = "GetList";

    public static RouteGroupBuilder MapListEndpoints(this WebApplication app)
    {
        RouteGroupBuilder group = app.MapGroup("list").WithParameterValidation();

        //get all lists
        //todo: get all lists from certain user when user is implemented
        group.MapGet("/", async (IMongoDatabase database) =>
        {
            var collection = database.GetCollection<ListListEntity>("lists");

            if (collection is null)
            {
                return Results.NotFound();
            }

            List<ListListEntity> lists = await collection.Find(_ => true).ToListAsync();

            return Results.Ok(lists);
        });

        //get list by id
        group.MapGet("/{id}", async (string id, IMongoDatabase database) =>
        {
            var collection = database.GetCollection<ListListEntity>("lists");

            if (collection is null)
            {
                return Results.Problem();
            }

            ObjectId objId;

            if (!ObjectId.TryParse(id, out objId))
            {
                return Results.BadRequest("invalid list id");
            }

            var filter = Builders<ListListEntity>.Filter.Eq("_id", objId);

            ListListEntity? list = await collection.Find(filter).FirstOrDefaultAsync();

            if (list is null)
            // if(list is null || !list.IsPublic) //todo: later when user is implemented use this
            {
                return Results.NotFound("list not found");
            }

            return Results.Ok(list.ToDto());
        })
        .WithName(GetListEndpointName);

        //create new list
        //(int creatorId, ListListContext dbContext) //todo: for user version
        group.MapPost("/newlist", async (IMongoDatabase database) =>
        {
            var collection = database.GetCollection<ListListEntity>("lists");

            if (collection is null)
            {
                return Results.Problem();
            }

            ListListEntity newList = new ListListEntity();

            //newList.owner = creatorId; //todo: for user version

            await collection.InsertOneAsync(newList);

            return Results.CreatedAtRoute(GetListEndpointName, new { id = newList.Id }, newList.ToDto());
        });

        //create new list from existing list
        //(int creatorId, ListListContext dbContext) //todo: for user version
        group.MapPost("/fromlist", async (ListListDto list, IMongoDatabase database) =>
        {
            var collection = database.GetCollection<ListListEntity>("lists");

            if (collection is null)
            {
                return Results.Problem();
            }

            ListListEntity newList = list.ToEntity();

            //newList.owner = creatorId; //todo: for user version

            await collection.InsertOneAsync(newList);

            return Results.CreatedAtRoute(GetListEndpointName, new { id = newList.Id }, newList.ToDto());
        });

        //create new list item in list by id
        group.MapPost("/{id}/item", async (string id, CreateListItemDto createdItem, IMongoDatabase database) =>
        {
            var collection = database.GetCollection<ListListEntity>("lists");

            if (collection is null)
            {
                return Results.Problem();
            }

            ObjectId objId;

            if (!ObjectId.TryParse(id, out objId))
            {
                return Results.BadRequest("invalid list id");
            }

            //todo: validate that all of the data makes sense, like if the item has a group id that doesnt exist
            //todo: update group size

            ListItem newlistItem = createdItem.ToEntity();

            var filter = Builders<ListListEntity>.Filter.Eq("_id", objId);
            var update = Builders<ListListEntity>.Update.Push(list => list.Items, newlistItem);

            await collection.UpdateOneAsync(filter, update);

            return Results.Ok(); //todo: send back updated list or actually this is technically closer to an update so maybe just return ok is fine
        });

        //create new group in list by id
        group.MapPost("/{id}/group", async (string id, CreateListGroupDto createdGroup, IMongoDatabase database) =>
        {
            var collection = database.GetCollection<ListListEntity>("lists");

            if (collection is null)
            {
                return Results.Problem();
            }

            ObjectId objId;

            if (!ObjectId.TryParse(id, out objId))
            {
                return Results.BadRequest("invalid list id");
            }

            //todo: validate data, make sure every entry is there

            ListGroup newListGroup = createdGroup.ToEntity();

            var filter = Builders<ListListEntity>.Filter.Eq("_id", objId);

            ListListEntity? existingList = await collection.Find(filter).FirstOrDefaultAsync();

            if (existingList is null)
            {
                return Results.NotFound("list not found");
            }

            ObjectId newGroupId = ObjectId.GenerateNewId();
            newListGroup.Id = newGroupId;
            existingList.Groups.Add(newGroupId, newListGroup);

            var update = Builders<ListListEntity>.Update.Set(list => list.Groups, existingList.Groups);

            await collection.UpdateOneAsync(filter, update);

            return Results.Ok(); //todo: send back updated list or actually this is technically closer to an update so maybe just return ok is fine
        });

        //update list by id
        group.MapPut("/{id}", async (string id, UpdateListDto updatedList, IMongoDatabase database) =>
        {
            var collection = database.GetCollection<ListListEntity>("lists");

            if (collection is null)
            {
                return Results.Problem();
            }

            ObjectId objId;

            if (!ObjectId.TryParse(id, out objId))
            {
                return Results.BadRequest("invalid list id");
            }

            var filter = Builders<ListListEntity>.Filter.Eq("_id", objId);

            bool listExists = await collection.Find(filter).AnyAsync();

            if (!listExists)
            {
                return Results.NotFound("list not found");
            }

            var update = Builders<ListListEntity>.Update.Set(list => list.Title, updatedList.Title).Set(list => list.Properties, updatedList.Properties);

            await collection.UpdateOneAsync(filter, update);

            return Results.NoContent();
        });

        //update list item in list by list id and item id
        group.MapPut("/{id}/item/{iid}", async (string id, int iid, UpdateListItemDto updatedItem, IMongoDatabase database) =>
        {
            var collection = database.GetCollection<ListListEntity>("lists");

            if (collection is null)
            {
                return Results.Problem();
            }

            ObjectId objId;

            if (!ObjectId.TryParse(id, out objId))
            {
                return Results.BadRequest("invalid list id");
            }

            var filter = Builders<ListListEntity>.Filter.Eq("_id", objId);

            ListListEntity? list = await collection.Find(filter).FirstOrDefaultAsync();

            if (list is null)
            {
                return Results.NotFound("list not found");
            }

            if (iid < 0 || iid >= list.Items.Count)
            {
                return Results.NotFound("item not found");
            }

            var update = Builders<ListListEntity>.Update.Set(list => list.Items[iid], updatedItem.ToEntity());

            await collection.UpdateOneAsync(filter, update);

            return Results.NoContent();
        });

        //update group in list by list id and group id
        group.MapPut("/{id}/group/{gid}", async (string id, string gid, UpdateListGroupDto updatedGroup, IMongoDatabase database) =>
        {
            var collection = database.GetCollection<ListListEntity>("lists");

            if (collection is null)
            {
                return Results.Problem();
            }

            ObjectId listObjId;

            if (!ObjectId.TryParse(id, out listObjId))
            {
                return Results.BadRequest("invalid list id");
            }

            ObjectId groupObjId;

            if (!ObjectId.TryParse(gid, out groupObjId))
            {
                return Results.BadRequest("invalid group id");
            }

            //if updatedGroup Name is null, Position is null, Settings.Numbered is null, etc

            var filter = Builders<ListListEntity>.Filter.Eq("_id", listObjId);

            ListListEntity? list = await collection.Find(filter).FirstOrDefaultAsync();

            if (list is null)
            {
                return Results.NotFound("list not found");
            }

            if (!list.Groups.ContainsKey(groupObjId))
            {
                return Results.NotFound("group not found");
            }

            var update = Builders<ListListEntity>.Update.Set(list => list.Groups[groupObjId], updatedGroup.ToEntity());

            await collection.UpdateOneAsync(filter, update);

            return Results.NoContent();
        });

        //delete list by id
        group.MapDelete("/{id}", async (string id, IMongoDatabase database) =>
        {
            var collection = database.GetCollection<ListListEntity>("lists");

            if (collection is null)
            {
                return Results.Problem();
            }

            ObjectId objId;

            if (!ObjectId.TryParse(id, out objId))
            {
                return Results.BadRequest("invalid list id");
            }

            var filter = Builders<ListListEntity>.Filter.Eq("_id", objId);

            await collection.DeleteOneAsync(filter);

            return Results.NoContent();
        });

        //delete list item by list id and item id
        group.MapDelete("/{id}/item/{iid}", async (string id, int iid, IMongoDatabase database) =>
        {
            var collection = database.GetCollection<ListListEntity>("lists");

            if (collection is null)
            {
                return Results.Problem();
            }

            ObjectId objId;

            if (!ObjectId.TryParse(id, out objId))
            {
                return Results.BadRequest("invalid list id");
            }

            var filter = Builders<ListListEntity>.Filter.Eq("_id", objId);

            ListListEntity? list = await collection.Find(filter).FirstOrDefaultAsync();

            if (list is null)
            {
                return Results.NotFound("list not found");
            }

            if (iid < 0 || iid >= list.Items.Count)
            {
                return Results.NotFound("item not found");
            }

            //todo: update size of all groups that this item is in
            //todo: update group positions for all items in a group with this item

            list.Items.RemoveAt(iid);

            var update = Builders<ListListEntity>.Update.Set(list => list.Items, list.Items);

            await collection.UpdateOneAsync(filter, update);

            return Results.NoContent();
        });

        //delete group by list id and item id
        group.MapDelete("/{id}/group/{gid}", async (string id, string gid, IMongoDatabase database) =>
        {
            var collection = database.GetCollection<ListListEntity>("lists");

            if (collection is null)
            {
                return Results.Problem();
            }

            ObjectId listObjId;

            if (!ObjectId.TryParse(id, out listObjId))
            {
                return Results.BadRequest("invalid list id");
            }

            ObjectId groupObjId;

            if (!ObjectId.TryParse(gid, out groupObjId))
            {
                return Results.BadRequest("invalid group id");
            }

            var filter = Builders<ListListEntity>.Filter.Eq("_id", listObjId);

            ListListEntity? list = await collection.Find(filter).FirstOrDefaultAsync();

            if (list is null)
            {
                return Results.NotFound("list not found");
            }

            if (!list.Groups.ContainsKey(groupObjId))
            {
                return Results.NotFound("group not found");
            }

            //todo: remove child groups
            //todo: remove items in group that are only in this group
            //todo: remove group from parent's subgroups
            //todo: remove group from items that are in this group and other group(s)

            list.Groups.Remove(groupObjId);
            var update = Builders<ListListEntity>.Update.Set(list => list.Groups, list.Groups);

            await collection.UpdateOneAsync(filter, update);

            return Results.NoContent();
        });

        return group;
    }
}