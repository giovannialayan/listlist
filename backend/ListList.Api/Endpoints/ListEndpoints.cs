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
            newList._id = ObjectId.GenerateNewId();

            //newList.owner = creatorId; //todo: for user version

            await collection.InsertOneAsync(newList);

            return Results.CreatedAtRoute(GetListEndpointName, new { id = newList._id }, newList.ToDto());
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
            newList._id = ObjectId.GenerateNewId();

            //regenerate all group ids, idk if this is necessary but i feel like it would make more sense and possibly weed out potential bugs
            Dictionary<string, ListGroup> newGroups = new Dictionary<string, ListGroup>();

            foreach (ListGroup group in newList.Groups.Values)
            {
                Guid newGroupId = Guid.NewGuid();
                group.Id = newGroupId;
                newGroups.Add(newGroupId.ToString(), group);
            }

            newList.Groups = newGroups;

            //newList.owner = creatorId; //todo: for user version

            await collection.InsertOneAsync(newList);

            return Results.CreatedAtRoute(GetListEndpointName, new { id = newList._id }, newList.ToDto());
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

            var filter = Builders<ListListEntity>.Filter.Eq("_id", objId);
            ListListEntity? list = await collection.Find(filter).FirstOrDefaultAsync();

            if (list is null)
            {
                return Results.NotFound("list not found");
            }

            ListItem newlistItem = createdItem.ToEntity();

            //validate group ids in item
            List<string> listGroupIds = list.Groups.Keys.ToList();

            if (newlistItem.Groups.Count > listGroupIds.Count)
            {
                return Results.BadRequest("item.Groups has more groups than exist");
            }

            for (int i = 0; i < newlistItem.Groups.Count; i++)
            {
                if (!listGroupIds.Contains(newlistItem.Groups[i]))
                {
                    return Results.BadRequest("item.Groups group id " + newlistItem.Groups[i] + " does not exist");
                }
            }

            List<string> groupPositionIds = newlistItem.GroupPositions.Keys.ToList();

            if (groupPositionIds.Count != newlistItem.Groups.Count)
            {
                return Results.BadRequest("ther number of groups in item.GroupPositions and item.Groups is not equal");
            }

            if (groupPositionIds.Count > listGroupIds.Count)
            {
                return Results.BadRequest("item.GroupPositions has more groups than exist");
            }

            for (int i = 0; i < groupPositionIds.Count; i++)
            {
                if (!listGroupIds.Contains(groupPositionIds[i]))
                {
                    return Results.BadRequest("item.GroupPositions group id " + groupPositionIds[i] + " does not exist");
                }
            }

            //todo: update group size

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

            var filter = Builders<ListListEntity>.Filter.Eq("_id", objId);
            ListListEntity? existingList = await collection.Find(filter).FirstOrDefaultAsync();

            if (existingList is null)
            {
                return Results.NotFound("list not found");
            }

            //validate position
            if (createdGroup.Position < 0 || createdGroup.Position >= existingList.Groups.Count)
            {
                return Results.BadRequest("invalid group position");
            }

            ListGroup newListGroup = createdGroup.ToEntity();

            Guid newGroupId = Guid.NewGuid();
            newListGroup.Id = newGroupId;
            existingList.Groups.Add(newGroupId.ToString(), newListGroup);

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

            Guid groupGuid;

            if (!Guid.TryParse(gid, out groupGuid))
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

            if (!list.Groups.ContainsKey(gid))
            {
                return Results.NotFound("group not found");
            }

            var update = Builders<ListListEntity>.Update.Set(list => list.Groups[gid], updatedGroup.ToEntity());

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

            Guid groupGuid;

            if (!Guid.TryParse(gid, out groupGuid))
            {
                return Results.BadRequest("invalid group id");
            }

            var filter = Builders<ListListEntity>.Filter.Eq("_id", listObjId);

            ListListEntity? list = await collection.Find(filter).FirstOrDefaultAsync();

            if (list is null)
            {
                return Results.NotFound("list not found");
            }

            if (!list.Groups.ContainsKey(gid))
            {
                return Results.NotFound("group not found");
            }

            //todo: remove child groups
            //todo: remove items in group that are only in this group
            //todo: remove group from parent's subgroups
            //todo: remove group from items that are in this group and other group(s)

            list.Groups.Remove(gid);
            var update = Builders<ListListEntity>.Update.Set(list => list.Groups, list.Groups);

            await collection.UpdateOneAsync(filter, update);

            return Results.NoContent();
        });

        return group;
    }
}