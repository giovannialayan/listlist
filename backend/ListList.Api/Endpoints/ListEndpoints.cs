using ListList.Api.Data;
using ListList.Api.Dtos;
using ListList.Api.Entities;
using ListList.Api.Mapping;
using Microsoft.EntityFrameworkCore;

namespace ListList.Api.Endpoints;

public static class ListEndpoints
{
    const string GetListEndpointName = "GetList";

    public static RouteGroupBuilder MapListEndpoints(this WebApplication app)
    {
        RouteGroupBuilder group = app.MapGroup("list").WithParameterValidation();

        //get all lists
        //todo: get all lists from certain user when user is implemented
        group.MapGet("/", (ListListContext dbContext) =>
            dbContext.Lists
                .Select(list => list.ToListListDto())
                .AsNoTracking()
                .ToListAsync()
        );

        //get list by id
        group.MapGet("/{id}", async (int id, ListListContext dbContext) =>
        {
            ListListEntity? list = await dbContext.Lists.FindAsync(id);

            if (list is null)
            // if(list is null || !list.IsPublic) //todo: later when user is implemented use this
            {
                return Results.NotFound();
            }

            return Results.Ok(list.ToListListDto());
        })
        .WithName(GetListEndpointName);

        //create new list
        //(int creatorId, ListListContext dbContext) //todo: for user version
        group.MapPost("/", async (ListListContext dbContext) =>
        {
            ListListEntity newList = new ListListEntity();

            //newList.owner = creatorId; //todo: for user version

            dbContext.Lists.Add(newList);
            await dbContext.SaveChangesAsync();

            return Results.CreatedAtRoute(GetListEndpointName, new { id = newList.Id }, newList.ToListListDto());
        });

        //create new list item in list by id
        group.MapPost("/{id}/item", async (int id, CreateListItemDto createdItem, ListListContext dbContext) =>
        {
            ListListEntity? list = await dbContext.Lists.FindAsync(id);

            if (list is null)
            {
                return Results.NotFound();
            }

            //todo: validate that all of the data makes sense, like if the item has a group id that doesnt exist
            //todo: update group size

            ListItem newlistItem = createdItem.ToEntity();

            dbContext.Entry(list).Property<List<ListItem>>("Items").CurrentValue.Add(newlistItem);
            await dbContext.SaveChangesAsync();

            return Results.Ok(); //todo: send back updated list or actually this is technically closer to an update so maybe just return ok is fine
        });

        //create new group in list by id
        group.MapPost("/{id}/group", async (int id, CreateListGroupDto createdGroup, ListListContext dbContext) =>
        {
            ListListEntity? list = await dbContext.Lists.FindAsync(id);

            if (list is null)
            {
                return Results.NotFound();
            }

            //todo: validate data, make sure parent exists or is -1

            ListGroup newListGroup = createdGroup.ToEntity();

            dbContext.Entry(list).Property<List<ListGroup>>("Groups").CurrentValue.Add(newListGroup);
            await dbContext.SaveChangesAsync();

            return Results.Ok(); //todo: send back updated list or actually this is technically closer to an update so maybe just return ok is fine
        });

        //update list by id
        group.MapPut("/{id}", async (int id, UpdateListDto updatedList, ListListContext dbContext) =>
        {
            ListListEntity? list = await dbContext.Lists.FindAsync(id);

            if (list is null)
            {
                return Results.NotFound();
            }

            dbContext.Entry(list).CurrentValues.SetValues(updatedList);
            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });

        //update list item in list by list id and item id
        group.MapPut("/{id}/item/{iid}", async (int id, int iid, UpdateListItemDto updatedItem, ListListContext dbContext) =>
        {
            ListListEntity? list = await dbContext.Lists.FindAsync(id);

            if (list is null)
            {
                return Results.NotFound("list not found");
            }

            if (iid < 0 || iid >= dbContext.Entry(list).Property<List<ListItem>>("Items").CurrentValue.Count)
            {
                return Results.NotFound("list item not found");
            }

            dbContext.Entry(list).Property<List<ListItem>>("Items").CurrentValue[iid] = updatedItem.ToEntity();
            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });

        //update group in list by list id and group id
        group.MapPut("/{id}/group/{gid}", async (int id, int gid, UpdateListGroupDto updatedGroup, ListListContext dbContext) =>
        {
            ListListEntity? list = await dbContext.Lists.FindAsync(id);

            if (list is null)
            {
                return Results.NotFound("list not found");
            }

            if (gid < 0 || gid >= dbContext.Entry(list).Property<List<ListGroup>>("Groups").CurrentValue.Count)
            {
                return Results.NotFound("group not found");
            }

            dbContext.Entry(list).Property<List<ListGroup>>("Groups").CurrentValue[gid] = updatedGroup.ToEntity();
            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });

        //delete list by id
        group.MapDelete("/{id}", async (int id, ListListContext dbContext) =>
        {
            await dbContext.Lists.Where(list => list.Id == id).ExecuteDeleteAsync();

            return Results.NoContent();
        });

        //delete list item by list id and item id
        group.MapDelete("/{id}/item/{iid}", async (int id, int iid, ListListContext dbContext) =>
        {
            ListListEntity? list = await dbContext.Lists.FindAsync(id);

            if (list is null)
            {
                return Results.NotFound("list not found");
            }

            if (iid < 0 || iid >= dbContext.Entry(list).Property<List<ListItem>>("Items").CurrentValue.Count)
            {
                return Results.NotFound("list item not found");
            }

            dbContext.Entry(list).Property<List<ListItem>>("Items").CurrentValue.RemoveAt(iid);
            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });

        //delete group by list id and item id
        group.MapDelete("/{id}/group/{gid}", async (int id, int gid, ListListContext dbContext) =>
        {
            ListListEntity? list = await dbContext.Lists.FindAsync(id);

            if (list is null)
            {
                return Results.NotFound("list not found");
            }

            if (gid < 0 || gid >= dbContext.Entry(list).Property<List<ListGroup>>("Groups").CurrentValue.Count)
            {
                return Results.NotFound("group not found");
            }

            dbContext.Entry(list).Property<List<ListGroup>>("Groups").CurrentValue.RemoveAt(gid);
            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });

        return group;
    }
}