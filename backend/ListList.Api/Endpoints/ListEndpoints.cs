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

        group.MapGet("/", (ListListContext dbContext) =>
            dbContext.Lists
                .Select(list => list.ToListListDto())
                .AsNoTracking()
                .ToListAsync()
        );

        group.MapGet("/{id}", async (int id, ListListContext dbContext) =>
        {
            ListListEntity? list = await dbContext.Lists.FindAsync(id);

            if (list is null)
            // if(list is null || !list.IsPublic) //later when user is implemented use this
            {
                return Results.NotFound();
            }

            return Results.Ok(list.ToListListDto());
        })
        .WithName(GetListEndpointName);

        //(int creatorId, ListListContext dbContext) //for user version
        group.MapPost("/", async (ListListContext dbContext) =>
        {
            ListListEntity newList = new ListListEntity();

            //newList.owner = creatorId; //for user version

            dbContext.Lists.Add(newList);
            await dbContext.SaveChangesAsync();

            return Results.CreatedAtRoute(GetListEndpointName, new { id = newList.Id }, newList.ToListListDto());
        });

        group.MapPost("/{id}", async (int id, CreateListItemDto createdItem, ListListContext dbContext) =>
        {
            ListListEntity? list = await dbContext.Lists.FindAsync(id);

            if (list is null)
            {
                return Results.NotFound();
            }

            ListItem newlistItem = createdItem.ToEntity();

            dbContext.Entry(list).Property<List<ListItem>>("Items").CurrentValue.Add(newlistItem);
            await dbContext.SaveChangesAsync();

            return Results.Ok();
        });

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

        group.MapPut("/{id}/{iid}", async (int id, int iid, UpdateListItemDto updatedItem, ListListContext dbContext) =>
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

            dbContext.Entry(list).Property<List<ListItem>>("Items").CurrentValue[iid] = updatedItem.ToEntity(iid);
            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });

        group.MapDelete("/{id}", async (int id, ListListContext dbContext) =>
        {
            await dbContext.Lists.Where(list => list.Id == id).ExecuteDeleteAsync();

            return Results.NoContent();
        });

        return group;
    }
}